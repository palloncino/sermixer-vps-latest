// import path, { dirname } from "path";
// import { marked } from "marked";
// import imageToBase64 from "image-to-base64";
// import fs from "fs";
// import { fileURLToPath } from "url";
// import { condizioni_di_contratto_sermixer } from "./condizioni-di-contratto-sermixer.js"; // Import section B

// const __dirname = dirname(fileURLToPath(import.meta.url));

// export async function generateHTML(quote, isConfirmation) {
//     // Convert logo to base64
//     let base64Logo;
//     try {
//         base64Logo = await imageToBase64(
//             path.resolve(process.env.IMAGES_FOLDER_PATH, "logo.png")
//         );
//     } catch (error) {
//         console.error("Error converting logo to base64:", error);
//         return;
//     }

//     // Convert business signature to base64
//     let base64BusinessSignature = null;
//     const possibleExtensions = ["jpg", "jpeg", "png"];
//     for (const ext of possibleExtensions) {
//         try {
//             const base64Image = await imageToBase64(
//                 path.resolve(process.env.IMAGES_FOLDER_PATH, `BUSINESS_SIGNATURE.${ext}`)
//             );
//             if (base64Image) {
//                 base64BusinessSignature = base64Image;
//                 break;
//             }
//         } catch (error) {
//             console.error(`Error converting BUSINESS_SIGNATURE.${ext} to base64:`, error);
//         }
//     }

//     // Function to convert image file path to base64
//     const convertImagePathToBase64 = async (imagePath) => {
//         try {
//             const base64Image = await imageToBase64(imagePath);
//             return base64Image;
//         } catch (error) {
//             console.error(`Error converting image path to base64: ${error}`);
//             return null;
//         }
//     };

//     const convertMarkdownToHtml = (markdown) => {
//         const preprocessedMarkdown = markdown.replace(/\\n/g, '<br>'); // Replace \n with <br> tag
//         const markdownParsed = marked(preprocessedMarkdown);
//         return markdownParsed;
//     };
    

//     // Read CSS from file
//     const cssPath = path.resolve(__dirname, "styles.css");
//     const cssContent = fs.readFileSync(cssPath, "utf8");

//     // Function to format price
//     const formatPrice = (price) => price.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');

//     // Parse and convert Markdown content
//     const productsHtml = await Promise.all(quote.data.addedProducts.map(async (product, index) => {
//         const productDescriptionHtml = convertMarkdownToHtml(product.description);
//         const productImagePath = path.resolve(process.env.IMAGES_FOLDER_PATH, path.basename(product.imgUrl));
//         const base64ProductImage = await convertImagePathToBase64(productImagePath);

//         const componentsHtml = product.components.map((component) => {
//             const componentDescriptionHtml = convertMarkdownToHtml(component.description);
//             return `
//         <div class="table-v2-row">
//           <div class="table-v2-cell-container">
//             <div class="reduced-font smaller-font" style="font-weight: bold;">${component.name}</div>
//             <!-- <div>${componentDescriptionHtml}</div> -->
//           </div>
//           <div class="table-v2-price">
//             <div>€${formatPrice(component.price)}</div>
//           </div>
//         </div>
//       `;
//         }).join("");

//         return `
//       <div class="second-container mb-4">
//         <div class="second-container-left-column">
//           <div class="container-heading-text">Prodotto</div>
//           <div class="second-container-left-column-image-container">
//             <img style="width: 100%; object-fit: contain;" src="data:image/jpeg;base64,${base64ProductImage}">
//           </div>
//           <br />
//           <div style="font-weight: bold; font-size: 1.2rem; color: red;">
//             ${product.name}
//           </div>
//           <div class="table-v1">
//             <div class="table-v1-row">
//               <div class="table-v1-key">PREZZO BASE</div>
//               <div class="table-v1-value" style="justify-content: flex-start;">
//                 €${formatPrice(product.price)}
//               </div>
//             </div>
//           </div>
//           <div class="reduced-font">
//             ${productDescriptionHtml}
//           </div>
//         </div>
//         <div class="second-container-right-column">
//           <div class="container-heading-text">Componenti</div>
//           <div class="table-v2">
//             <div class="table-v2-row-head">
//               <div class="table-v2-row-head-key-1 reduced-font">Nome</div>
//               <div class="table-v2-row-head-key-2 reduced-font" style="max-width: 120px; text-align: right;">Prezzo</div>
//             </div>
//             ${componentsHtml}
//           </div>
//         </div>
//       </div>
//     `;
//     }));

//     // Conditional rendering for discounted total
//     const discountedTotalHtml = quote.TOTAL_ALL !== quote.TOTAL_ALL_DISCOUNTED ? `
//     <div class="table-v1-row">
//       <div class="table-v1-key" style="flex-direction: column;">PREZZO TOTALE <br/><div style="font-size: 0.6rem;">CON SCONTO A VOI RISERVATO</div></div>
//       <div class="table-v1-value" style="justify-content: flex-end; font-weight: bold;">
//         €${formatPrice(quote.TOTAL_ALL_DISCOUNTED)}
//       </div>
//     </div>` : '';

//     // Convert the note to HTML if it exists
//     const noteHtml = quote.note ? `
//     <div class="note-section" style="margin: 2rem 0 2rem 0;">
//       <h4>Note</h4>
//       <div class="reduced-font">${convertMarkdownToHtml(quote.note)}</div>
//     </div>
//   ` : '';

//     // HTML template for the PDF
//     const htmlContent = `
//   <!DOCTYPE html>
//   <html lang="en">
//     <head>
//       <meta charset="UTF-8" />
//       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//       <title>Quote PDF</title>
//       <style>
//         ${cssContent}
//         .signature-section {
//           page-break-inside: avoid;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="header">
//         <div class="header-container-left">
//           <div class="header-container-left-logo-container">
//             <img class="header-container-left-logo-container-logo" src="data:image/png;base64,${base64Logo}" alt="logo" />
//             <h3 class="header-container-left-logo-container-text">${quote.company}</h3>
//           </div>
//         </div>
//         <div class="header-container-right">
//           <div class="header-container-right-upper-row">
//             <div class="header-container-right-date">Data ${new Date(quote.createdAt).toLocaleDateString('en-GB')}</div>
//             <div class="header-container-right-offer-number">Offerta n. ${quote.id}</div>
//           </div>
//           <div class="header-container-right-lower-row">
//             ${isConfirmation ? 'CONFERMA ORDINE' : 'PREVENTIVO'}
//           </div>
//         </div>
//       </div>
//       <div class="first-container mb-4">
//         <div class="first-container-left-column">
//         </div>
//         <div class="first-container-right-column">
//           <div>SPETT.LE</div>
//           <div style="color:red;">${quote.data.selectedClient.companyName}</div>
//           <br />
//           <div>${quote.data.selectedClient.address.street}</div>
//           <div>${quote.data.selectedClient.address.city}, ${quote.data.selectedClient.address.zipCode}, ${quote.data.selectedClient.address.country}</div>
//           <div>Telefono: ${quote.data.selectedClient.mobileNumber}</div>
//           <div>Email: ${quote.data.selectedClient.email}</div>
//           <div>${quote.data.selectedClient.fiscalCode}</div>
//           <div>${quote.data.selectedClient.vatNumber}</div>
//         </div>
//       </div>
//       ${productsHtml.join('')}
//       ${noteHtml}
//       <div class="table-v1">
//         <div class="table-v1-row">
//           <div class="table-v1-key">PREZZO BASE</div>
//           <div class="table-v1-value" style="justify-content: flex-end; font-weight: bold;">€${formatPrice(quote.TOTAL_BASE_PRICE)}</div>
//         </div>
//         <div class="table-v1-row">
//           <div class="table-v1-key">PREZZO COMPONENTI</div>
//           <div class="table-v1-value" style="justify-content: flex-end; font-weight: bold;">€${formatPrice(quote.TOTAL_ACCESSORIES)}</div>
//         </div>
//         <div class="table-v1-row">
//           <div class="table-v1-key">PREZZO TOTALE</div>
//           <div class="table-v1-value" style="justify-content: flex-end; font-weight: bold;">€${formatPrice(quote.TOTAL_ALL)}</div>
//         </div>
//         ${discountedTotalHtml}
//       </div>
//       ${condizioni_di_contratto_sermixer}
      
//       <div class="signature-section">
//         <div class="signature-date">
//           <strong>Data</strong> ${new Date(quote.dateOfSignature).toLocaleDateString('en-GB')}
//         </div>
//         <div class="signatures">
//         ${isConfirmation && base64BusinessSignature ? `
//           <div class="signature">
//             <div class="signature-title">Firma titolare</div>
//             <img class="signature-image" src="data:image/png;base64,${base64BusinessSignature}" alt="Business Signature" />
//           </div>
//           ` : ''}
//           <div class="signature">
//             <div class="signature-title">Firma cliente</div>
//             <div class="signature-placeholder"></div>
//           </div>
//         </div>
//       </div>
//     </body>
//   </html>
//   `;

//     return htmlContent;
// }
