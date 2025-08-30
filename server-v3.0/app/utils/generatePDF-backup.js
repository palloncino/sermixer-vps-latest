import puppeteer from "puppeteer";
import { marked } from "marked";
import path, { dirname } from "path";
import imageToBase64 from "image-to-base64";
import fs from "fs";
import { fileURLToPath } from "url";
import { condizioni_di_contratto_sermixer } from "./condizioni-di-contratto-sermixer.js";
import { condizioni_di_contratto_s2 } from "./condizioni-di-contratto-s2-truck.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function generatePDF(quote, isConfirmation) {
  const browser = await puppeteer.launch({
    executablePath: process.env.BROWSER_EXECUTABLE,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    timeout: 30000,
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
  const possibleExtensions = ["jpg", "jpeg", "png"];
  for (const ext of possibleExtensions) {
    try {
      const base64Image = await convertImagePathToBase64(
        path.resolve(process.env.IMAGES_FOLDER_PATH, `BUSINESS_SIGNATURE.${ext}`)
      );
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

    const componentsHtml = product.components.map((component) => {
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
            <div>€${formatPrice(componentPrice)}</div>
          </div>
        </div>
      `;
    }).join("");

    const productPrice = product.discountedPrice || product.price;

    return `
      <div class="second-container mb-4" style="${index > 0 ? 'page-break-before: always;' : ''}">
        <div class="second-container-left-column">
          <div class="container-heading-text">Prodotto</div>
          ${base64ProductImage ? `
          <div class="second-container-left-column-image-container">
            <img style="width: 100%; object-fit: contain;" src="data:image/jpeg;base64,${base64ProductImage}">
          </div>` : ''}
          <br />
          <div style="font-weight: bold; font-size: 1.2rem; color: red;">
            ${product.name}
          </div>
          <div class="table-v1">
            <div class="table-v1-row">
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
      </style>
    </head>
    <body>
      <div class="content">
        <div class="header">
          <div class="header-container-right" style="${isSermixer ? '' : 'flex: 1;'}">
            <div class="header-container-right-upper-row">
              <div class="header-container-right-date">Data ${new Date(quote.createdAt).toLocaleDateString('en-GB')}</div>
              <div class="header-container-right-offer-number">Offerta n. ${quote.id}</div>
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
        ${contractSection}
        
        <div class="signature-section">
          <div class="signature-date">
            <strong>Data</strong> ${new Date(quote.dateOfSignature).toLocaleDateString('en-GB')}
          </div>
          <div class="signatures">
          ${isConfirmation && base64BusinessSignature ? `
            <div class="signature">
              <div class="signature-title">Firma titolare</div>
              <img class="signature-image" src="data:image/png;base64,${base64BusinessSignature}" alt="Business Signature" />
            </div>
            ` : ''}
            <div class="signature">
              <div class="signature-title">Firma cliente</div>
              <div class="signature-placeholder"></div>
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
      top: "160px", // Increase top margin to make space for header
      bottom: "140px", // Increase bottom margin to make space for footer
      right: "40px",
      left: "40px",
    },
    displayHeaderFooter: true,
    headerTemplate: `
      <div style="width: 100%; text-align: center;">
        <img src="data:image/png;base64,${base64HeaderImage}" style="${isSermixer ? 'width: 100%; max-height: 100px; object-fit: contain;' : 'width: auto; max-height: 120px; object-fit: contain;'}" />
      </div>
    `,
    footerTemplate: `
      <div style="width: 100%; text-align: center; font-size: 10px; position: relative;">
        <img src="data:image/png;base64,${base64FooterImage}" style="${isSermixer ? 'width: 100%; object-fit: contain;' : 'width: 50%;'} margin: 0 auto;" />
        <div class="page-number">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>
      </div>
    `,
  });

  await browser.close();
  return pdfBuffer;
}
