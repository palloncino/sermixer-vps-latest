import fs from "fs";
import imageToBase64 from "image-to-base64";
import { marked } from "marked";
import path, { dirname } from "path";
import puppeteer from "puppeteer";
import { fileURLToPath } from "url";
import { condizioni_di_contratto_s2 } from "./condizioni-di-contratto-s2-truck.js";
import { condizioni_di_contratto_sermixer } from "./condizioni-di-contratto-sermixer.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Browser instance management for v3.0
let browser;

async function getBrowser() {
  if (!browser) {
    browser = await puppeteer.launch({
      executablePath: process.env.BROWSER_EXECUTABLE,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      timeout: 30000,
    });
  }
  return browser;
}

export async function generatePDF(quote, isConfirmation) {
  console.log('PDF Generation started with:', {
    quoteNumber: quote.quoteNumber,
    isConfirmation,
    company: quote.company
  });

  const browser = await getBrowser();

  // Function to convert image file path to base64
  const convertImagePathToBase64 = async (imagePath) => {
    try {
      const base64Image = await imageToBase64(imagePath);
      return base64Image;
    } catch (error) {
      console.error(`Error converting image path to base64: ${error}`);
      return null;
    }
  };

    // Select header and footer images based on company name
    const isSermixer = String(quote.company).toLowerCase() === 'sermixer';
  const headerImage = isSermixer ? 'sermixer-head.png' : 's2-head.png';
  const footerImage = isSermixer ? 'sermixer-footer.png' : 's2-footer.png';

  // Convert header and footer images to base64
  const base64HeaderImage = await convertImagePathToBase64(
    path.resolve(process.env.IMAGES_FOLDER_PATH, headerImage)
  );
  const base64FooterImage = await convertImagePathToBase64(
    path.resolve(process.env.IMAGES_FOLDER_PATH, footerImage)
  );

  // Convert business signature to base64
  let base64BusinessSignature = null;
  const possibleExtensions = ["png", "jpg", "jpeg"];
  for (const ext of possibleExtensions) {
    const signaturePath = path.resolve(process.env.IMAGES_FOLDER_PATH, `BUSINESS_SIGNATURE.${ext}`);
    
    if (!fs.existsSync(signaturePath)) {
      console.log(`Signature file not found with extension: ${ext}`);
      continue;
    }
    try {
      const base64Image = await convertImagePathToBase64(signaturePath);
      if (base64Image) {
        base64BusinessSignature = base64Image;
        break;
      }
    } catch (error) {
      console.error(`Error converting BUSINESS_SIGNATURE.${ext} to base64:`, error);
    }
  }

  // Function to convert Markdown to HTML
  const convertMarkdownToHtml = (markdown) => {
    const preprocessedMarkdown = markdown.replace(/\\n/g, '<br>'); // Replace \n with <br> tag
    const markdownParsed = marked(preprocessedMarkdown);
    return markdownParsed;
  };

  // Read CSS from file
  const cssPath = path.resolve(__dirname, "styles.css");
  const cssContent = fs.readFileSync(cssPath, "utf8");

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

  // Function to format price
  const formatPrice = (price) => {
    if (price == null) return '0,00';
    return Number(price).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Parse and convert Markdown content
  const productsHtml = await Promise.all(quote.data.addedProducts.map(async (product, index) => {
    const productDescriptionHtml = convertMarkdownToHtml(product.description);

    // Check if the product image URL is valid (not null, empty, or undefined)
    let base64ProductImage = '';
    if (product.imgUrl) {
      const productImagePath = path.resolve(process.env.IMAGES_FOLDER_PATH, path.basename(product.imgUrl));
      base64ProductImage = await convertImagePathToBase64(productImagePath);
    }

    const includedComponents = product.components.filter(component => component.included);
    const componentsHtml = includedComponents.length > 0 
      ? includedComponents.map((component) => {
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
            <div class="reduced-font smaller-font" style="font-weight: bold;">${formatPrice(componentPrice)} €</div>  
          </div>
        </div>
      `;
        }).join("")
      : `<div class="no-components-message">Nessun componente aggiunto</div>`;

    const productPrice = product.discountedPrice || product.price;

    return `
      <div class="second-container mb-4" style="${index > 0 ? 'page-break-before: always;' : ''}">
        <div class="second-container-left-column">
          <div class="container-heading-text">Prodotto</div>
          ${base64ProductImage ? `
          <div class="second-container-left-column-image-container">
            <img style="width: 100%; object-fit: contain;" src="data:image/jpeg;base64,${base64ProductImage}">
          </div>` : `
          <div class="second-container-left-column-image-container">
            <div class="product-image-placeholder">
              📷 Immagine non disponibile
            </div>
          </div>`}

          <div style="font-weight: bold; font-size: 1.2rem; color: red;">
            ${product.name}
          </div>
          <div class="table-v1">
            <div class="table-v1-row highlight">
              <div class="table-v1-key">PREZZO BASE</div>
              <div class="table-v1-value">
                €${formatPrice(productPrice)}
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
              <div class="table-v2-row-head-key-2 reduced-font" style="max-width: 100px; text-align: right;">Prezzo unità</div>
            </div>
            ${componentsHtml}
          </div>
        </div>
      </div>
    `;
  }));

  // Determine which section to include
  const contractSection = isSermixer ? condizioni_di_contratto_sermixer : condizioni_di_contratto_s2;

  // HTML template for the PDF
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Quote PDF</title>
      <style>
        ${cssContent}
        ${additionalStyles}
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
        
        /* Pricing Summary Container - keeps pricing and payment terms together */
        .pricing-summary-container {
          break-inside: avoid;
          page-break-inside: avoid;
          margin-top: 30px;
          margin-bottom: 30px;
          border: 2px solid #90caf9;
          border-radius: 4px;
          background-color: #f3f9ff;
          padding: 25px;
        }
        
        .pricing-totals {
          margin-bottom: 20px;
        }
        
        .pricing-totals .table-v1 {
          background-color: white;
          border: 1px solid #90caf9;
          border-radius: 4px;
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
        }
        
        .pricing-totals .table-v1-row {
          border-bottom: 1px solid #e3f2fd;
          padding: 15px 0;
        }
        
        .pricing-totals .table-v1-row:last-child {
          border-bottom: none;
          font-weight: bold;
          padding: 15px 0;
        }
        
        .payment-terms-section {
          padding: 20px;
          border: 1px solid #90caf9;
          border-radius: 4px;
          background-color: white;
          margin: 0;
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
        
        /* Product image placeholder */
        .product-image-placeholder {
          width: 100%;
          height: 200px;
          background-color: #f5f5f5;
          border: 2px dashed #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: #999;
          font-size: 14px;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="content">
        <div class="header">
          <div class="header-container-right" style="${isSermixer ? '' : 'flex: 1;'}">
            <div class="header-container-right-upper-row">
              <div class="header-container-right-date">Data ${new Date(quote.createdAt).toLocaleDateString('it-IT')}</div>
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
            <div style="color:#cc0000;">${quote.data.selectedClient.companyName}</div>
  
            <div>${quote.data.selectedClient.address.street}</div>
            <div>${quote.data.selectedClient.address.city}, ${quote.data.selectedClient.address.zipCode}, ${quote.data.selectedClient.address.country}</div>
            <div>Telefono: ${quote.data.selectedClient.mobileNumber}</div>
            <div>Email: ${quote.data.selectedClient.email}</div>
            <div>${quote.data.selectedClient.fiscalCode}</div>
            <div>${quote.data.selectedClient.vatNumber}</div>
          </div>
        </div>

        ${productsHtml.join('')}
        <div class="pricing-summary-container">
          <div class="pricing-totals">
        <div class="table-v1">
          <div class="table-v1-row">
            <div class="table-v1-key" style="flex-direction: column;">
              SUBTOTALE<br/><span style="font-size: 0.8rem; font-style: italic;">a voi riservato</span>
            </div>
            <div class="table-v1-value" style="justify-content: flex-end; font-weight: bold;">
              €${formatPrice(quote.TOTAL_WITH_DISCOUNT)}
            </div>
          </div>
          <div class="table-v1-row">
            <div class="table-v1-key" style="flex-direction: column;">
              PREZZO TOTALE<br/><span style="font-size: 0.8rem; font-style: italic;">+ iva 22%</span>
            </div>
            <div class="table-v1-value" style="justify-content: flex-end; font-weight: bold;">
              €${formatPrice(quote.TOTAL_ALL_WITH_TAXES)}
            </div>
            </div>
          </div>
        </div>
        
        ${quote.data.paymentTerms ? `
        <div class="payment-terms-section">
          <div class="payment-terms-title">MODALITÀ DI PAGAMENTO</div>
          <div class="payment-terms-content">${quote.data.paymentTerms}</div>
        </div>
        ` : ''}
        </div>
        
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
              ${base64BusinessSignature ? `
                <img class="signature-image" src="data:image/png;base64,${base64BusinessSignature}" alt="Business Signature" />
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

  const page = await browser.newPage();
  await page.setContent(htmlContent, {
    waitUntil: "domcontentloaded",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
      top: "160px", // Reduced header margin to match preview
      bottom: "140px", // Reduced footer margin to match preview  
      right: "20px", // Reduced side margins
      left: "20px",
    },
    displayHeaderFooter: true,
            headerTemplate: `
          <div style="width: 100%; height: 100%; margin: 0; padding: 0 40px; display: flex; justify-content: center; align-items: center; box-sizing: border-box;">
            <img src="data:image/png;base64,${base64HeaderImage}" style="max-width: calc(100% - 80px); max-height: 100%; object-fit: contain; transform: ${isSermixer ? 'translate(-40px, -30px)' : 'translate(-40px, -20px) scale(0.8)'};" />
          </div>
        `,
    footerTemplate: `
      <div style="width: 100%; padding: 10px 20px; text-align: center; font-size: 10px;">
        ${isSermixer ? `
          <img src="data:image/png;base64,${base64FooterImage}" style="width: 100%; max-height: 70px; object-fit: contain;" />
        ` : `
          <div style="width: auto; margin: 0 auto; text-align: center;">
            <div style="font-size: 8px; line-height: 1.3;">
              S2 TRUCK SERVICE SRL a Socio Unico - Via Edison, 4 - 31020 VILLORBA (TV)
            </div>
            <div style="font-size: 8px; line-height: 1.3;">
              C.F. e P.I. 02263610228 - Sede legale: Via degli Artigiani, 15 - 38057 PERGINE VALSUGANA (TN)
            </div>
            <div style="font-size: 8px; line-height: 1.3;">
              Tel. 0422-919871 - Fax 0422-919890 - e-mail: info@s2truckservice.it - WWW.S2TRUCKSERVICE.IT
            </div>
          </div>
        `}
        <div class="page-number" style="margin-top: 5px; font-size: 9px;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>
           </div>
    `,



  });

  await page.close();
    return pdfBuffer;
}

// Function to generate HTML preview for editing (new feature)
export async function generateHTMLPreview(quote, isConfirmation) {
  console.log('HTML Preview Generation started with:', {
    quoteNumber: quote.quoteNumber,
    isConfirmation,
    company: quote.company
  });

  // Function to convert image file path to base64
  const convertImagePathToBase64 = async (imagePath) => {
    try {
      const base64Image = await imageToBase64(imagePath);
      return base64Image;
    } catch (error) {
      console.error(`Error converting image path to base64: ${error}`);
      return null;
    }
  };

  // Select header and footer images based on company name
  const isSermixer = String(quote.company).toLowerCase() === 'sermixer';
  const headerImage = isSermixer ? 'sermixer-head.png' : 's2-head.png';
  const footerImage = isSermixer ? 'sermixer-footer.png' : 's2-footer.png';

  // Convert header and footer images to base64
  const base64HeaderImage = await convertImagePathToBase64(
    path.resolve(process.env.IMAGES_FOLDER_PATH, headerImage)
  );
  const base64FooterImage = await convertImagePathToBase64(
    path.resolve(process.env.IMAGES_FOLDER_PATH, footerImage)
  );

  // Convert business signature to base64
  let base64BusinessSignature = null;
  const possibleExtensions = ["png", "jpg", "jpeg"];
  for (const ext of possibleExtensions) {
    const signaturePath = path.resolve(process.env.IMAGES_FOLDER_PATH, `BUSINESS_SIGNATURE.${ext}`);
    
    if (!fs.existsSync(signaturePath)) {
      console.log(`Signature file not found with extension: ${ext}`);
      continue;
    }
    try {
      const base64Image = await convertImagePathToBase64(signaturePath);
      if (base64Image) {
        base64BusinessSignature = base64Image;
        break;
      }
    } catch (error) {
      console.error(`Error converting BUSINESS_SIGNATURE.${ext} to base64:`, error);
    }
  }

  // Function to convert Markdown to HTML
  const convertMarkdownToHtml = (markdown) => {
    const preprocessedMarkdown = markdown.replace(/\\n/g, '<br>'); // Replace \n with <br> tag
    const markdownParsed = marked(preprocessedMarkdown);
    return markdownParsed;
  };

  // Read CSS from file
  const cssPath = path.resolve(__dirname, "styles.css");
  const cssContent = fs.readFileSync(cssPath, "utf8");

  // Add signature specific styles + web preview styles
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
    
    /* Simple Preview Styles */
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 80px 20px 20px 20px;
      background-color: #f5f5f5;
      line-height: 1.4;
    }
    
    /* Single document container */
    .pdf-page {
      max-width: 800px;
      margin: 20px auto;
      background-color: white;
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }
    
    /* Header section */
    .pdf-header {
      width: 100%;
      height: 160px;
      background-color: #f8f8f8;
      border-bottom: 2px solid #cc0000;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
      padding: 0 40px;
      margin: 0;
    }
    
    .pdf-header img {
      max-width: calc(100% - 80px);
      max-height: 100%;
      object-fit: contain;
      transform: ${isSermixer ? 'translate(-40px, -30px)' : 'translate(-40px, -20px) scale(0.8)'};
    }
    
    /* Content section */
    .pdf-content {
      padding: 20px;
      box-sizing: border-box;
    }
    
    /* Footer section */
    .pdf-footer {
      width: 100%;
      padding: 20px;
      background-color: #f8f8f8;
      border-top: 2px solid #0066cc;
      text-align: center;
      box-sizing: border-box;
    }
    
    /* Preview info header */
    .preview-info {
      background-color: #2c3e50;
      color: white;
      padding: 15px;
      text-align: center;
      font-weight: bold;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      border-bottom: 3px solid #3498db;
    }
  `;

  // Function to format price
  const formatPrice = (price) => {
    if (price == null) return '0,00';
    return Number(price).toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Parse and convert Markdown content (same as PDF but with visual separators)
  const productsHtml = await Promise.all(quote.data.addedProducts.map(async (product, index) => {
    const productDescriptionHtml = convertMarkdownToHtml(product.description);

    // Check if the product image URL is valid (not null, empty, or undefined)
    let base64ProductImage = '';
    if (product.imgUrl) {
      const productImagePath = path.resolve(process.env.IMAGES_FOLDER_PATH, path.basename(product.imgUrl));
      base64ProductImage = await convertImagePathToBase64(productImagePath);
    }

    const includedComponents = product.components.filter(component => component.included);
    const componentsHtml = includedComponents.length > 0 
      ? includedComponents.map((component) => {
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
                <div class="reduced-font smaller-font" style="font-weight: bold;">${formatPrice(componentPrice)} €</div>
              </div>
            </div>
          `;
        }).join("")
      : `<div class="no-components-message">Nessun componente aggiunto</div>`;

    const productPrice = product.discountedPrice || product.price;

    return `
      <div class="second-container mb-4 ${index > 0 ? 'product-container-with-break' : ''}" style="${index > 0 ? 'border-top: 3px solid #cc0000; margin-top: 30px; padding-top: 20px;' : ''}">
        ${index > 0 ? '<div class="simulated-area">🔄 <strong>PAGE BREAK</strong> - New page starts here in PDF</div>' : ''}
        <div class="second-container-left-column">
          <div class="container-heading-text">Prodotto</div>
          ${base64ProductImage ? `
          <div class="second-container-left-column-image-container">
            <img style="width: 100%; object-fit: contain;" src="data:image/jpeg;base64,${base64ProductImage}">
          </div>` : `
          <div class="second-container-left-column-image-container">
            <div class="product-image-placeholder">
              Immagine
            </div>
          </div>`}

          <div style="font-weight: bold; font-size: 1.2rem; color: #cc0000;">
            ${product.name}
          </div>
          <div class="table-v1">
            <div class="table-v1-row highlight">
              <div class="table-v1-key">PREZZO BASE</div>
              <div class="table-v1-value" style="justify-content: flex-start;">
                €${formatPrice(productPrice)}
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
              <div class="table-v2-row-head-key-2 reduced-font" style="max-width: 100px; text-align: right;">Prezzo unità</div>
            </div>
            ${componentsHtml}
          </div>
        </div>
      </div>
    `;
  }));

  // Determine which section to include
  const contractSection = isSermixer ? condizioni_di_contratto_sermixer : condizioni_di_contratto_s2;

  // HTML template for preview (with web-friendly modifications)
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Quote HTML Preview</title>
      <style>
        ${cssContent}
        ${additionalStyles}
        .header-container img {
          width: ${isSermixer ? '100%' : 'auto'};
          max-height: ${isSermixer ? '100px' : '120px'};
          object-fit: contain;
        }
        .footer-container img {
          width: ${isSermixer ? '100%' : '50%'};
          object-fit: contain;
          margin: 0 auto;
        }
        
        /* Pricing Summary Container - keeps pricing and payment terms together */
        .pricing-summary-container {
          break-inside: avoid;
          page-break-inside: avoid;
          margin-top: 30px;
          margin-bottom: 30px;
          border: 2px solid #90caf9;
          border-radius: 4px;
          background-color: #f3f9ff;
          padding: 25px;
        }
        
        .pricing-totals {
          margin-bottom: 20px;
        }
        
        .pricing-totals .table-v1 {
          background-color: white;
          border: 1px solid #90caf9;
          border-radius: 4px;
          margin: 0;
          padding: 20px;
          box-sizing: border-box;
        }
        
        .pricing-totals .table-v1-row {
          border-bottom: 1px solid #e3f2fd;
          padding: 15px 0;
        }
        
        .pricing-totals .table-v1-row:last-child {
          border-bottom: none;
          font-weight: bold;
          padding: 15px 0;
        }
        
        .payment-terms-section {
          padding: 20px;
          border: 1px solid #90caf9;
          border-radius: 4px;
          background-color: white;
          margin: 0;
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
        
        /* Product image placeholder */
        .product-image-placeholder {
          width: 100%;
          height: 200px;
          background-color: #f5f5f5;
          border: 2px dashed #ccc;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: #999;
          font-size: 14px;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <!-- Fixed preview info header -->
      <div class="preview-info">
        📄 PDF Preview - ${quote.company} ${isConfirmation ? 'CONFERMA ORDINE' : 'PREVENTIVO'} N°${quote.quoteNumber}
        <br>
        <small style="font-weight: normal; opacity: 0.9;">Content preview with header and footer simulation</small>
      </div>

      <!-- Single container with header, content, footer -->
      <div class="pdf-page">
        <!-- Header -->
        <div class="pdf-header">
          ${base64HeaderImage ? `<img src="data:image/png;base64,${base64HeaderImage}" />` : '<span style="color: #cc0000; font-weight: bold;">Header image not found</span>'}
        </div>
        
        <!-- All content -->
        <div class="pdf-content">
        <div class="header">
          <div class="header-container-right" style="${isSermixer ? '' : 'flex: 1;'}">
            <div class="header-container-right-upper-row">
              <div class="header-container-right-date">Data ${new Date(quote.createdAt).toLocaleDateString('it-IT')}</div>
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
            <div style="color:#cc0000;">${quote.data.selectedClient.companyName}</div>
  
            <div>${quote.data.selectedClient.address.street}</div>
            <div>${quote.data.selectedClient.address.city}, ${quote.data.selectedClient.address.zipCode}, ${quote.data.selectedClient.address.country}</div>
            <div>Telefono: ${quote.data.selectedClient.mobileNumber}</div>
            <div>Email: ${quote.data.selectedClient.email}</div>
            <div>${quote.data.selectedClient.fiscalCode}</div>
            <div>${quote.data.selectedClient.vatNumber}</div>
          </div>
        </div>

        ${productsHtml.join('')}
        <div class="pricing-summary-container">
          <div class="pricing-totals">
            <div class="table-v1">
              <div class="table-v1-row">
                <div class="table-v1-key" style="flex-direction: column;">
                  SUBTOTALE<br/><span style="font-size: 0.8rem; font-style: italic;">a voi riservato</span>
                </div>
            <div class="table-v1-value" style="justify-content: flex-end; font-weight: bold;">
              €${formatPrice(quote.TOTAL_WITH_DISCOUNT)}
            </div>
          </div>
          <div class="table-v1-row">
            <div class="table-v1-key" style="flex-direction: column;">
              PREZZO TOTALE<br/><span style="font-size: 0.8rem; font-style: italic;">+ iva 22%</span>
            </div>
            <div class="table-v1-value" style="justify-content: flex-end; font-weight: bold;">
              €${formatPrice(quote.TOTAL_ALL_WITH_TAXES)}
            </div>
          </div>
            </div>
          </div>
          
          ${quote.data.paymentTerms ? `
          <div class="payment-terms-section">
            <div class="payment-terms-title">MODALITÀ DI PAGAMENTO</div>
            <div class="payment-terms-content">${quote.data.paymentTerms}</div>
          </div>
          ` : ''}
        </div>
        
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
              ${base64BusinessSignature ? `
                <img class="signature-image" src="data:image/png;base64,${base64BusinessSignature}" alt="Business Signature" />
              ` : `
                <div class="signature-placeholder"></div>
              `}
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="pdf-footer">
          ${isSermixer ? (base64FooterImage ? `<img src="data:image/png;base64,${base64FooterImage}" style="width: 100%; max-height: 70px; object-fit: contain;" />` : '<span style="color: #0066cc; font-weight: bold;">Footer image not found</span>') : `
            <div style="font-size: 8px; line-height: 1.3; color: #333;">
              S2 TRUCK SERVICE SRL a Socio Unico - Via Edison, 4 - 31020 VILLORBA (TV)<br>
              C.F. e P.I. 02263610228 - Sede legale: Via degli Artigiani, 15 - 38057 PERGINE VALSUGANA (TN)<br>
              Tel. 0422-919871 - Fax 0422-919890 - e-mail: info@s2truckservice.it - WWW.S2TRUCKSERVICE.IT
            </div>
          `}
        </div>
      </div>
    </body>
  </html>
`;

  return htmlContent;
}
