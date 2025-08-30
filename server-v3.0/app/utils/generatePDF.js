import fs from "fs";
import { marked } from "marked";
import path, { dirname } from "path";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import sanitizeHtml from "sanitize-html";
import mime from "mime-types";
import { condizioni_di_contratto_s2 } from "./condizioni-di-contratto-s2-truck.js";
import { condizioni_di_contratto_sermixer } from "./condizioni-di-contratto-sermixer.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Singleton browser (reuse between requests)
let browserPromise = null;
async function getBrowser() {
  if (!browserPromise) {
    browserPromise = puppeteer.launch({
      executablePath: process.env.BROWSER_EXECUTABLE,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      timeout: 30000,
    });
  }
  return browserPromise;
}

// Safe base64 from disk
async function toBase64(filePath) {
  try {
    const buf = await fs.promises.readFile(filePath);
    return buf.toString("base64");
  } catch {
    return null;
  }
}

function dataUrl(base64, filePath, fallbackMime = "image/png") {
  if (!base64) return null;
  const mt = mime.lookup(filePath) || fallbackMime;
  return `data:${mt};base64,${base64}`;
}

// Currency formatting with Intl
const EUR = new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" });
const formatPrice = (value) => EUR.format(Number(value ?? 0));

// Safe markdown to HTML conversion
function mdToSafeHtml(md) {
  const html = marked.parse(md || "");
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags,
    allowedAttributes: { a: ["href", "name", "target"], img: ["src", "alt"] },
  });
}

export async function generatePDF(quote, isConfirmation) {
  console.log('PDF Generation started with:', {
    quoteNumber: quote.quoteNumber,
    isConfirmation,
    company: quote.company
  });

  let browser;
  let page;

  try {
    browser = await getBrowser();
    page = await browser.newPage();

    if (!page) {
      throw new Error("Failed to create new browser page");
    }
    // Select header and footer images based on company name
    const isSermixer = String(quote.company).toLowerCase() === 'sermixer';
    const headerFile = path.resolve(process.env.IMAGES_FOLDER_PATH, isSermixer ? 'sermixer-head.png' : 's2-head.png');
    const footerFile = path.resolve(process.env.IMAGES_FOLDER_PATH, isSermixer ? 'sermixer-footer.png' : 's2-footer.png');

    const headerB64 = await toBase64(headerFile);
    const footerB64 = await toBase64(footerFile);

    const headerUrl = dataUrl(headerB64, headerFile);
    const footerUrl = dataUrl(footerB64, footerFile);

    // Read CSS from file
    const cssPath = path.resolve(__dirname, "styles.css");
    const cssContent = await fs.promises.readFile(cssPath, "utf8");

  // Convert business signature to base64
  let businessSignatureUrl = null;
  const possibleExtensions = ["png", "jpg", "jpeg"];
  for (const ext of possibleExtensions) {
    const signaturePath = path.resolve(process.env.IMAGES_FOLDER_PATH, `BUSINESS_SIGNATURE.${ext}`);
    
    if (!fs.existsSync(signaturePath)) {
      console.log(`Signature file not found with extension: ${ext}`);
      continue;
    }
    try {
      const base64Image = await toBase64(signaturePath);
      if (base64Image) {
        businessSignatureUrl = dataUrl(base64Image, signaturePath);
        break;
      }
    } catch (error) {
      console.error(`Error converting BUSINESS_SIGNATURE.${ext} to base64:`, error);
    }
  }

  // Function to convert Markdown to HTML
  const convertMarkdownToHtml = (markdown) => {
    const preprocessedMarkdown = markdown.replace(/\\n/g, '<br>'); // Replace \n with <br> tag
    return mdToSafeHtml(preprocessedMarkdown);
  };

  // Add signature specific styles
  const additionalStyles = `
    .signature-image {
      max-width: 200px;
      max-height: 100px;
      object-fit: contain;
      margin-top: 10px;
    }
    .signature-section {
      margin-top: 30px;
      page-break-inside: avoid;
    }
    .signatures {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
    }
    .signature {
      flex: 1;
      max-width: 45%;
      text-align: center;
    }
  `;

  // Use the improved EUR formatter from the top of the file
  // (formatPrice is already defined globally)

  // Parse and convert Markdown content
  const productsHtml = await Promise.all(quote.data.addedProducts.map(async (product, index) => {
    const productDescriptionHtml = convertMarkdownToHtml(product.description);

    // Check if the product image URL is valid (not null, empty, or undefined)
    let productImageUrl = null;
    if (product.imgUrl) {
      const productImagePath = path.resolve(process.env.IMAGES_FOLDER_PATH, path.basename(product.imgUrl));
      const base64Image = await toBase64(productImagePath);
      if (base64Image) {
        productImageUrl = dataUrl(base64Image, productImagePath);
      }
    }

    const componentsHtml = product.components.filter(component => component.included).map((component) => {
      const componentDescriptionHtml = convertMarkdownToHtml(component.description);
      const componentPrice = component.discountedPrice || component.price;

      // Include quantity in the component display
      return `
        <div class="table-v2-row">
          <div class="table-v2-cell-container">
            <div class="reduced-font smaller-font" style="font-weight: bold;">
              ${component.name} (Unità: ${component.quantity || 1})
            </div>
            <!-- <div>${componentDescriptionHtml}</div> -->
          </div>
          <div class="table-v2-price">
            <div>${formatPrice(componentPrice)}</div>
          </div>
        </div>
      `;
    }).join("");

    const productPrice = product.discountedPrice || product.price;

    return `
      <div class="second-container mb-4 product-section" ${index > 0 ? 'style="break-before: page;"' : ''}>
        <div class="second-container-left-column">
          <div class="container-heading-text">Prodotto</div>
          ${productImageUrl ? `
          <div class="second-container-left-column-image-container">
            <img style="width: 100%; object-fit: contain;" src="${productImageUrl}">
          </div>` : ''}
          <br />
          <div style="font-weight: bold; font-size: 1.2rem; color: red;">
            ${product.name}
          </div>
          <div class="table-v1">
            <div class="table-v1-row">
              <div class="table-v1-key">PREZZO BASE</div>
              <div class="table-v1-value" style="justify-content: flex-start;">
                ${formatPrice(productPrice)}
              </div>
            </div>
          </div>
          <div class="reduced-font">
            ${productDescriptionHtml}
          </div>
        </div>
        <div class="second-container-right-column">
          <div class="container-heading-text">Componenti</div>
          <div class="table-v2">
            <div class="table-v2-row-head">
              <div class="table-v2-row-head-key-1 reduced-font">Nome</div>
              <div class="table-v2-row-head-key-2 reduced-font" style="max-width: 120px; text-align: right;">Prezzo unità</div>
            </div>
            ${componentsHtml}
          </div>
        </div>
      </div>
    `;
  }));

  // Determine which section to include
  const contractSection = isSermixer ? condizioni_di_contratto_sermixer : condizioni_di_contratto_s2;

  // HTML template for the PDF with Paged.js support
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Quote PDF</title>
      <style>
        /* Paged-media CSS for proper pagination */
        @page {
          size: A4;
          margin: 18mm 14mm 18mm 14mm;
          @top-center { content: element(print-header); }
          @bottom-center { content: element(print-footer); }
        }

        /* CSS Variables for consistent spacing */
        :root { 
          --s1: 2mm; 
          --s2: 4mm; 
          --s3: 6mm; 
          --s4: 8mm; 
          --s6: 12mm; 
        }

        /* Running elements for headers/footers */
        header.print-header { 
          position: running(print-header); 
          width: 100%;
          text-align: center;
          padding: 0 20px;
        }
        footer.print-footer { 
          position: running(print-footer); 
          width: 100%;
          text-align: center;
          padding: 0 20px;
        }

        ${cssContent}
        ${additionalStyles}

        /* Enhanced pagination styles */
        body { 
          font-size: 11pt; 
          line-height: 1.35; 
          print-color-adjust: exact; 
          -webkit-print-color-adjust: exact; 
        }
        
        h1, h2, h3, .container-heading-text { 
          margin: 0 0 var(--s3) 0; 
          break-after: avoid-page; 
        }
        
        .first-container, .second-container, .payment-terms-section, .object-description-container { 
          break-inside: avoid; 
          padding: var(--s1) 0;
        }
        
        .table-v1-row, .table-v2-row { 
          break-inside: avoid; 
          padding: var(--s1) 0; 
        }
        
        img { 
          display: block; 
          max-width: 100%; 
          height: auto; 
          break-inside: avoid; 
        }

        .product-section {
          widows: 2; 
          orphans: 2;
        }

        .signature-section {
          break-inside: avoid;
          margin-top: var(--s6);
        }
        .header-container img {
          width: ${isSermixer ? '100%' : 'auto'};
          max-height: ${isSermixer ? '100px' : '120px'};
          object-fit: contain;
        }
        .footer-container img {
          width: ${isSermixer ? '100%' : '50%'};
          object-fit: contain;
          margin: 0 auto; /* Center the footer image for s2 company */
        }
        .payment-terms-section {
          margin-top: 30px;
          margin-bottom: 30px;
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 5px;
          background-color: #f9f9f9;
        }
        .payment-terms-title {
          font-weight: bold;
          font-size: 16px;
          margin-bottom: 10px;
          color: #333;
          text-transform: uppercase;
          border-bottom: 2px solid #cc0000;
          padding-bottom: 5px;
          display: inline-block;
        }
        .payment-terms-content {
          font-size: 13px;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <!-- Running header element -->
      <header class="print-header">
        ${headerUrl ? `<img src="${headerUrl}" style="${isSermixer ? 'width: 100%; max-height: 140px; object-fit: contain;' : 'width: auto; max-height: 100px; object-fit: contain;'}" />` : ''}
      </header>

      <!-- Running footer element -->
      <footer class="print-footer">
        ${isSermixer
          ? (footerUrl ? `<img src="${footerUrl}" style="width: 100%; object-fit: contain;" />` : '')
          : `<div style="font-size: 9px; line-height: 1.4; text-align: center;">
               <div>S2 TRUCK SERVICE SRL a Socio Unico - Via Edison, 4 - 31020 VILLORBA (TV)</div>
               <div>C.F. e P.I. 02263610228 - Sede legale: Via degli Artigiani, 15 - 38057 PERGINE VALSUGANA (TN)</div>
               <div>Tel. 0422-919871 - Fax 0422-919890 - e-mail: info@s2truckservice.it - WWW.S2TRUCKSERVICE.IT</div>
             </div>`
        }
        <div class="page-number">Pagina <span class="pageNumber"></span> di <span class="totalPages"></span></div>
      </footer>

      <div class="content">
        <div class="header">
          <div class="header-container-right" style="${isSermixer ? '' : 'flex: 1;'}">
            <div class="header-container-right-upper-row">
              <div class="header-container-right-date">Data ${new Date(quote.issuedDate).toLocaleDateString('it-IT')}</div>
              <div class="header-container-right-offer-number">Offerta n. ${quote.quoteNumber}</div>
            </div>
            <div class="header-container-right-lower-row">
              ${isConfirmation ? 'CONFERMA ORDINE' : 'PREVENTIVO'}
            </div>
          </div>
        </div>
        <div class="first-container mb-4">
          <div class="first-container-left-column">
            <div class="object-description-container">
            <div style="margin-bottom: .4rem;">Oggetto: <strong>${quote.data.quoteHeadDetails.object || "NA"}</strong></div>
            <div>${quote.data.quoteHeadDetails.description ? `Descrizione: ${quote.data.quoteHeadDetails.description}` : ""}</div>
          </div>
          </div>
          <div class="first-container-right-column">
            <div>SPETT.LE</div>
            <div style="color:red;">${quote.data.selectedClient.companyName}</div>
            <br />
            <div>${quote.data.selectedClient.address.street}</div>
            <div>${quote.data.selectedClient.address.city}, ${quote.data.selectedClient.address.zipCode}, ${quote.data.selectedClient.address.country}</div>
            <div>Telefono: ${quote.data.selectedClient.mobileNumber}</div>
            <div>Email: ${quote.data.selectedClient.email}</div>
            <div>${quote.data.selectedClient.fiscalCode}</div>
            <div>${quote.data.selectedClient.vatNumber}</div>
          </div>
        </div>

        ${productsHtml.join('')}
        <div class="table-v1">
          <div class="table-v1-row">
            <div class="table-v1-key" style="flex-direction: column;">
              SUBTOTALE<br/><span style="font-size: 0.8rem; font-style: italic;">a voi riservato</span>
            </div>
            <div class="table-v1-value" style="justify-content: flex-end; font-weight: bold;">
              ${formatPrice(quote.TOTAL_WITH_DISCOUNT)}
            </div>
          </div>
          <div class="table-v1-row">
            <div class="table-v1-key" style="flex-direction: column;">
              PREZZO TOTALE<br/><span style="font-size: 0.8rem; font-style: italic;">+ iva 22%</span>
            </div>
            <div class="table-v1-value" style="justify-content: flex-end; font-weight: bold;">
              ${formatPrice(quote.TOTAL_ALL_WITH_TAXES)}
            </div>
          </div>
        </div>
        
        ${quote.data.paymentTerms ? `
        <div class="payment-terms-section">
          <div class="payment-terms-title">MODALITÀ DI PAGAMENTO</div>
          <div class="payment-terms-content">${quote.data.paymentTerms}</div>
        </div>
        ` : ''}
        
        ${contractSection}
        
        <div class="signature-section">
          <div class="signature-date">
            <strong>Data</strong> ${new Date(quote.dateOfSignature).toLocaleDateString('it-IT')}
          </div>
          <div class="signatures">
            <div class="signature">
              <div class="signature-title">Firma cliente</div>
              <div class="signature-placeholder"></div>
            </div>
            <div class="signature">
              <div class="signature-title">Firma fornitore</div>
              ${businessSignatureUrl ? `
                <img class="signature-image" src="${businessSignatureUrl}" alt="Business Signature" />
              ` : `
                <div class="signature-placeholder"></div>
              `}
            </div>
          </div>
        </div>
      </div>
    </body>
  </html>
`;

  await page.setContent(htmlContent, {
    waitUntil: "load",
  });

  // Inject Paged.js from node_modules (ES modules compatible)
  const pagedJsPath = path.resolve(__dirname, "../node_modules/pagedjs/dist/paged.polyfill.js");
  console.log(`Loading Paged.js from: ${pagedJsPath}`);
  
  try {
    await page.addScriptTag({ 
      path: pagedJsPath
    });
    console.log("Paged.js script loaded successfully");
  } catch (error) {
    console.error("Failed to load Paged.js:", error);
    throw new Error(`Paged.js loading failed: ${error.message}`);
  }

  // Wait until Paged.js finishes laying out pages (with timeout)
  await page.evaluate(() => new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Paged.js rendering timeout after 30 seconds"));
    }, 30000);
    
    document.addEventListener("pagedjs:rendered", () => {
      clearTimeout(timeout);
      resolve();
    }, { once: true });
    
    // Fallback: if Paged.js doesn't fire the event, resolve anyway after a short delay
    setTimeout(() => {
      clearTimeout(timeout);
      console.log("Paged.js event not fired, proceeding without it");
      resolve();
    }, 5000);
  }));

  // Generate PDF with Paged.js pagination (no Chromium header/footer)
  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { 
      top: "0", 
      bottom: "0", 
      left: "0", 
      right: "0" 
    }, // margins come from @page now
    displayHeaderFooter: false
  });

    return pdfBuffer;
  } catch (error) {
    console.error("PDF Generation Error:", error);
    
    // Provide more specific error messages
    if (error.message.includes("require is not defined")) {
      throw new Error("PDF generation failed: ES module compatibility issue");
    } else if (error.message.includes("pagedjs")) {
      throw new Error("PDF generation failed: Paged.js loading error");
    } else if (error.message.includes("Cannot find package")) {
      throw new Error(`PDF generation failed: Missing dependency - ${error.message}`);
    } else if (error.message.includes("Navigation failed")) {
      throw new Error("PDF generation failed: Browser navigation error");
    } else if (error.message.includes("Protocol error")) {
      throw new Error("PDF generation failed: Browser protocol error");
    } else {
      throw new Error(`PDF generation failed: ${error.message}`);
    }
  } finally {
    // Ensure the page is closed even if pdf() throws
    if (page) {
      try { 
        await page.close(); 
      } catch (closeError) {
        console.error("Error closing page:", closeError);
      }
    }
  }
}
