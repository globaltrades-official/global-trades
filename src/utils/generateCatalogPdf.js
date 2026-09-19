import * as jspdfLib from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BRANDING, CONTACT } from '@/constants/theme';

const jsPDF = jspdfLib.jsPDF || jspdfLib.default?.jsPDF || jspdfLib.default;

/**
 * Loads an image via fetch + Blob URL + canvas downscaling to create a lightweight,
 * high-resolution base64 JPEG that NEVER taints the canvas and works across all browsers.
 *
 * @param {string} url - Relative or absolute image URL
 * @param {number} maxDim - Maximum width/height in pixels
 * @returns {Promise<string|null>} Data URL string or null
 */
async function loadScaledImageDataUrl(url, maxDim = 200) {
  if (!url) return null;

  // Strategy A: Native fetch -> Blob -> local Blob URL -> Canvas
  try {
    const res = await fetch(url);
    if (res.ok) {
      const blob = await res.blob();
      const dataUrl = await new Promise((resolve) => {
        const blobUrl = URL.createObjectURL(blob);
        const img = new Image();
        const timer = setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
          const reader = new FileReader();
          reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        }, 3000);

        img.onload = () => {
          clearTimeout(timer);
          try {
            const canvas = document.createElement('canvas');
            let width = img.naturalWidth || maxDim;
            let height = img.naturalHeight || maxDim;

            if (width > height) {
              if (width > maxDim) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              }
            } else {
              if (height > maxDim) {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);

            const exportedData = canvas.toDataURL('image/jpeg', 0.85);
            URL.revokeObjectURL(blobUrl);
            resolve(exportedData);
          } catch (e) {
            URL.revokeObjectURL(blobUrl);
            const reader = new FileReader();
            reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
          }
        };

        img.onerror = () => {
          clearTimeout(timer);
          URL.revokeObjectURL(blobUrl);
          const reader = new FileReader();
          reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null);
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(blob);
        };

        img.src = blobUrl;
      });

      if (dataUrl) return dataUrl;
    }
  } catch (err) {
    // Proceed to Strategy B
  }

  // Strategy B: Image element fallback
  return new Promise((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => resolve(null), 3000);

    img.onload = () => {
      clearTimeout(timer);
      try {
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(img.naturalWidth || maxDim, maxDim);
        canvas.height = Math.min(img.naturalHeight || maxDim, maxDim);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      } catch (e) {
        resolve(null);
      }
    };

    img.onerror = () => {
      clearTimeout(timer);
      resolve(null);
    };

    img.src = url;
  });
}

/**
 * Draws the Master Executive Header on Page 1 (Height: ~43mm).
 * Crisp, clean, authoritative white & royal blue aesthetic.
 */
function drawPageOneMasterHeader(doc, logoDataUrl, activeFilters, total, dateStr, pageWidth) {
  // Top Triple Accent Bar
  doc.setFillColor(8, 20, 38); // Midnight Navy
  doc.rect(0, 0, pageWidth, 4, 'F');
  doc.setFillColor(245, 158, 11); // Gold
  doc.rect(0, 4, pageWidth, 1.2, 'F');
  doc.setFillColor(0, 163, 224); // Cyan
  doc.rect(0, 5.2, pageWidth, 0.8, 'F');

  // Left: Official Logo
  if (logoDataUrl) {
    const logoFormat = logoDataUrl.includes('data:image/png') ? 'PNG' : 'JPEG';
    doc.addImage(logoDataUrl, logoFormat, 12, 8, 23, 23);
  }

  // Company Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(8, 20, 38); // Deep Midnight Navy
  doc.text(BRANDING.COMPANY_NAME || 'GLOBAL TRADES', 38, 16.5);

  // Wholesale Badge next to name
  doc.setFillColor(245, 158, 11); // Gold
  doc.roundedRect(106, 11.5, 36, 5.5, 1.5, 1.5, 'F');
  doc.setTextColor(8, 20, 38);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.text('OFFICIAL WHOLESALE', 124, 15.2, { align: 'center' });

  // Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.8);
  doc.setTextColor(26, 76, 152); // Royal Blue
  doc.text('DISTRIBUTORS, DEALERS & C&F AGENTS OF PROCESSED FOODS · KOZHIKODE', 38, 22);

  // Specialties
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text('Processed Foods · Beverages · HORECA & Institutional Food Service Supplies', 38, 27);

  // Right Side: Structured Contact & Orders Card
  const cardX = 145;
  const cardY = 7.5;
  const cardW = 53;
  const cardH = 24.5;

  doc.setFillColor(244, 248, 252);
  doc.setDrawColor(208, 223, 239);
  doc.setLineWidth(0.25);
  doc.roundedRect(cardX, cardY, cardW, cardH, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(8, 20, 38);
  doc.text(`Enquiries: +91 ${CONTACT.ENQUIRY_PHONE || '94479 31507'}`, cardX + 3.5, cardY + 5);

  doc.setTextColor(5, 150, 105); // Emerald Green
  doc.text(`WhatsApp: ${CONTACT.WHATSAPP_DISPLAY || '0495 2765320'}`, cardX + 3.5, cardY + 10);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setTextColor(100, 116, 139);
  doc.text('PT Usha Rd, Vellayil, Kozhikode - 673032', cardX + 3.5, cardY + 15);

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(5.5);
  doc.setTextColor(180, 83, 9);
  doc.text('Live rates & tier discounts on WhatsApp', cardX + 3.5, cardY + 20);

  // Filter & Selection Ribbon (Y = 33.5 to 40.5mm)
  const { category = 'All', brand = 'All', search = '' } = activeFilters;
  const filterParts = [];
  if (category && category !== 'All') filterParts.push(`Category: ${category}`);
  if (brand && brand !== 'All') filterParts.push(`Brand: ${brand}`);
  if (search && search.trim()) filterParts.push(`Search: "${search.trim()}"`);
  const filterSummaryText = filterParts.length > 0 ? filterParts.join('   •   ') : 'All Commercial Categories & Brands Included';

  doc.setFillColor(248, 250, 253);
  doc.setDrawColor(226, 234, 244);
  doc.setLineWidth(0.2);
  doc.roundedRect(12, 33.5, pageWidth - 24, 7, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(26, 76, 152);
  doc.text(`SELECTION: ${filterSummaryText}`, 15, 38);

  doc.setTextColor(8, 20, 38);
  doc.text(`${total} Products Listed   |   Issued: ${dateStr}`, pageWidth - 15, 38, { align: 'right' });

  // Crisp Divider Line
  doc.setDrawColor(220, 230, 242);
  doc.setLineWidth(0.3);
  doc.line(12, 42.5, pageWidth - 12, 42.5);
}

/**
 * Draws the Running Header on Pages 2+ (Height: 14mm).
 */
function drawSubsequentPageHeader(doc, logoDataUrl, pageWidth) {
  // Top Bar
  doc.setFillColor(8, 20, 38);
  doc.rect(0, 0, pageWidth, 13, 'F');
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 13, pageWidth, 1, 'F');

  let textStartX = 12;
  if (logoDataUrl) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(12, 1.5, 10, 10, 1.5, 1.5, 'F');
    const logoFormat = logoDataUrl.includes('data:image/png') ? 'PNG' : 'JPEG';
    doc.addImage(logoDataUrl, logoFormat, 12.8, 2.3, 8.4, 8.4);
    textStartX = 25;
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(BRANDING.COMPANY_NAME || 'GLOBAL TRADES', textStartX, 6.8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(0, 163, 224);
  doc.text('WHOLESALE PRODUCT CATALOGUE · KOZHIKODE', textStartX, 10.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(220, 235, 255);
  doc.text(
    `WhatsApp Orders: ${CONTACT.WHATSAPP_DISPLAY || '0495 2765320'}   |   Call: ${CONTACT.ENQUIRY_PHONE || '94479 31507'}`,
    pageWidth - 12,
    7.8,
    { align: 'right' }
  );
}

/**
 * Draws the Running Footer on every page.
 */
function drawPageFooter(doc, currentPage, totalPages, pageWidth, pageHeight) {
  doc.setDrawColor(210, 225, 240);
  doc.setLineWidth(0.3);
  doc.line(12, pageHeight - 11, pageWidth - 12, pageHeight - 11);

  doc.setFillColor(245, 158, 11);
  doc.circle(14, pageHeight - 6.5, 0.8, 'F');

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Global Trades Calicut · Wholesale Institutional Food Service · Rates confirmed daily via WhatsApp: 0495 2765320',
    17,
    pageHeight - 6.5
  );

  const pageStr = `Page ${currentPage} of ${totalPages}`;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 38, 74);
  doc.text(pageStr, pageWidth - 12, pageHeight - 6.5, { align: 'right' });
}

// ----------------------------------------------------------------------------
// TEMPLATE: LOOKBOOK 2-COLUMN PRODUCT CARDS (Default)
// ----------------------------------------------------------------------------
function generateCardsTemplate(doc, products, productImages, activeFilters, dateStr, logoDataUrl, pageWidth, pageHeight) {
  const marginX = 12;
  const colGap = 6;
  const cardW = (pageWidth - 2 * marginX - colGap) / 2; // 90mm
  const cardH = 44; // 44mm
  const rowGap = 3.5;
  const total = products.length;

  let currentProductIndex = 0;
  let pageNumber = 1;

  while (currentProductIndex < total) {
    const isPageOne = pageNumber === 1;
    let startY = 17;
    let maxRows = 5;

    if (isPageOne) {
      drawPageOneMasterHeader(doc, logoDataUrl, activeFilters, total, dateStr, pageWidth);
      startY = 46;
      maxRows = 5; // 5 rows = 10 cards on page 1
    } else {
      drawSubsequentPageHeader(doc, logoDataUrl, pageWidth);
      startY = 17;
      maxRows = 5; // 5 rows = 10 cards on page 2+
    }

    const maxItemsOnThisPage = maxRows * 2;
    const pageItems = products.slice(currentProductIndex, currentProductIndex + maxItemsOnThisPage);

    pageItems.forEach((item, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const cardX = marginX + col * (cardW + colGap);
      const cardY = startY + row * (cardH + rowGap);
      const globalIndex = currentProductIndex + idx;
      const imgDataUrl = productImages[globalIndex];

      // Card Container
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(218, 228, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(cardX, cardY, cardW, cardH, 2.5, 2.5, 'FD');

      // Top Accent Stripe (Royal Blue)
      doc.setFillColor(26, 76, 152);
      doc.roundedRect(cardX, cardY, cardW, 1.2, 1, 1, 'F');

      // Left Photo Box
      const photoBoxW = 32;
      const photoBoxH = 37.5;
      const photoBoxX = cardX + 3;
      const photoBoxY = cardY + 3.2;

      doc.setFillColor(248, 250, 253);
      doc.setDrawColor(226, 234, 244);
      doc.setLineWidth(0.2);
      doc.roundedRect(photoBoxX, photoBoxY, photoBoxW, photoBoxH, 2, 2, 'FD');

      const imgSize = 28;
      const imgX = photoBoxX + (photoBoxW - imgSize) / 2;
      const imgY = photoBoxY + (photoBoxH - imgSize) / 2;

      if (imgDataUrl) {
        try {
          const format = imgDataUrl.includes('data:image/png') ? 'PNG' : 'JPEG';
          doc.addImage(imgDataUrl, format, imgX, imgY, imgSize, imgSize);
        } catch (e) {
          console.error('Failed to embed product image:', e);
        }
      } else {
        doc.setFillColor(235, 242, 250);
        doc.circle(photoBoxX + photoBoxW / 2, photoBoxY + photoBoxH / 2 - 2, 9, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(26, 76, 152);
        doc.text('GT', photoBoxX + photoBoxW / 2, photoBoxY + photoBoxH / 2 + 1.2, { align: 'center' });
      }

      // Text Details Area
      const textX = cardX + 38;
      const maxTextW = cardW - 41;

      // Brand Badge Pill
      const brandName = item.brand || 'Global Trades';
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      const brandTextW = Math.min(doc.getTextWidth(brandName) + 4.5, maxTextW);
      doc.setFillColor(235, 243, 252);
      doc.roundedRect(textX, cardY + 3.8, brandTextW, 3.8, 1, 1, 'F');
      doc.setTextColor(26, 76, 152);
      doc.text(brandName, textX + 2.2, cardY + 6.6);

      // Product Name
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.8);
      doc.setTextColor(8, 20, 38);
      const nameLines = doc.splitTextToSize(item.name || '', maxTextW);
      if (nameLines.length === 1) {
        doc.text(nameLines[0], textX, cardY + 12);
      } else {
        doc.text(nameLines[0], textX, cardY + 11);
        doc.text(nameLines[1], textX, cardY + 14.3);
      }

      // Packaging Badge
      const sizeStr = item.size ? `Pack: ${item.size}` : 'Standard Pack';
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      const sizeTextW = Math.min(doc.getTextWidth(sizeStr) + 4.5, maxTextW);
      const sizeY = nameLines.length > 1 ? cardY + 18.5 : cardY + 16.5;
      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.2);
      doc.roundedRect(textX, sizeY, sizeTextW, 3.8, 1, 1, 'FD');
      doc.setTextColor(30, 41, 59);
      doc.text(sizeStr, textX + 2.2, sizeY + 2.8);

      // Category
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.4);
      doc.setTextColor(100, 116, 139);
      doc.text(`Cat: ${item.category || 'General'}`, textX, sizeY + 7.5);

      // Wholesale Stock Tag
      const badgeY = cardY + 36.5;
      doc.setFillColor(236, 253, 245);
      doc.setDrawColor(167, 243, 208);
      doc.setLineWidth(0.2);
      doc.roundedRect(textX, badgeY, maxTextW, 4.2, 1, 1, 'FD');
      doc.setFillColor(16, 185, 129);
      doc.circle(textX + 2.6, badgeY + 2.1, 0.7, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6);
      doc.setTextColor(6, 95, 70);
      doc.text('Wholesale Stock · Inquire Now', textX + 4.8, badgeY + 3);
    });

    currentProductIndex += pageItems.length;

    if (currentProductIndex < total) {
      doc.addPage();
      pageNumber++;
    }
  }

  // Stamp Footers
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawPageFooter(doc, p, totalPages, pageWidth, pageHeight);
  }
}

// ----------------------------------------------------------------------------
// TEMPLATE: EXECUTIVE CATALOG TABLE
// ----------------------------------------------------------------------------
function generateTableTemplate(doc, products, productImages, activeFilters, dateStr, logoDataUrl, pageWidth, pageHeight) {
  const tableData = products.map((item, idx) => [
    idx + 1,
    '', // Photo placeholder
    `${item.name}\nCategory: ${item.category || 'Wholesale Goods'}`,
    item.brand || 'Global Trades',
    item.size || 'Standard',
    'Inquire on WhatsApp',
  ]);

  autoTable(doc, {
    startY: 46, // Starts right below the 43mm master header
    head: [['NO.', 'IMAGE', 'PRODUCT DESCRIPTION & CATEGORY', 'BRAND', 'PACKAGING', 'STOCK / ENQUIRY']],
    body: tableData,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8.2,
      textColor: [8, 20, 38],
      cellPadding: 2.2,
      lineColor: [218, 228, 240],
      lineWidth: 0.15,
      minCellHeight: 21,
      valign: 'middle',
    },
    headStyles: {
      fillColor: [15, 38, 74],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 7.8,
      halign: 'left',
      minCellHeight: 8,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 254],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 9, fontStyle: 'bold', textColor: [100, 116, 139] },
      1: { halign: 'center', cellWidth: 26 },
      2: { cellWidth: 'auto', fontStyle: 'bold' },
      3: { halign: 'center', cellWidth: 30, fontStyle: 'bold', textColor: [26, 76, 152] },
      4: { halign: 'center', cellWidth: 22, fontStyle: 'bold', textColor: [30, 41, 59] },
      5: { halign: 'center', cellWidth: 26, fontStyle: 'bold', textColor: [5, 150, 105] },
    },
    margin: { left: 12, right: 12, bottom: 15, top: 17 },

    didDrawCell: (data) => {
      if (data.section === 'body' && data.column.index === 1) {
        const rowIndex = data.row.index;
        const imgDataUrl = productImages[rowIndex];
        const cell = data.cell;
        const imgSize = 17;
        const x = cell.x + (cell.width - imgSize) / 2;
        const y = cell.y + (cell.height - imgSize) / 2;

        if (imgDataUrl) {
          try {
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(218, 228, 240);
            doc.setLineWidth(0.2);
            doc.roundedRect(x - 0.5, y - 0.5, imgSize + 1, imgSize + 1, 1, 1, 'FD');

            const format = imgDataUrl.includes('data:image/png') ? 'PNG' : 'JPEG';
            doc.addImage(imgDataUrl, format, x, y, imgSize, imgSize);
          } catch (e) {}
        } else {
          doc.setFillColor(240, 245, 252);
          doc.roundedRect(x, y, imgSize, imgSize, 1.5, 1.5, 'FD');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(8);
          doc.setTextColor(26, 76, 152);
          doc.text('GT', x + imgSize / 2, y + imgSize / 2 + 2, { align: 'center' });
        }
      }
    },

    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      const currentPage = data.pageNumber;

      if (currentPage === 1) {
        drawPageOneMasterHeader(doc, logoDataUrl, activeFilters, products.length, dateStr, pageWidth);
      } else {
        drawSubsequentPageHeader(doc, logoDataUrl, pageWidth);
      }

      drawPageFooter(doc, currentPage, pageCount, pageWidth, pageHeight);
    },
  });
}

// ----------------------------------------------------------------------------
// TEMPLATE: MINIMALIST LUXURY
// ----------------------------------------------------------------------------
function generateMinimalistTemplate(doc, products, productImages, activeFilters, dateStr, logoDataUrl, pageWidth, pageHeight) {
  const marginX = 12;
  const rowW = pageWidth - 2 * marginX;
  const rowH = 21;
  const total = products.length;

  let currentProductIndex = 0;
  let pageNumber = 1;

  while (currentProductIndex < total) {
    const isPageOne = pageNumber === 1;
    let startY = 17;
    let maxRows = 11;

    if (isPageOne) {
      drawPageOneMasterHeader(doc, logoDataUrl, activeFilters, total, dateStr, pageWidth);
      startY = 46;
      maxRows = 10;
    } else {
      drawSubsequentPageHeader(doc, logoDataUrl, pageWidth);
      startY = 17;
      maxRows = 11;
    }

    const pageItems = products.slice(currentProductIndex, currentProductIndex + maxRows);

    pageItems.forEach((item, idx) => {
      const rowY = startY + idx * rowH;
      const globalIndex = currentProductIndex + idx;
      const imgDataUrl = productImages[globalIndex];

      if (idx % 2 === 1) {
        doc.setFillColor(249, 251, 254);
        doc.rect(marginX, rowY, rowW, rowH, 'F');
      }

      doc.setDrawColor(230, 238, 248);
      doc.setLineWidth(0.2);
      doc.line(marginX, rowY + rowH, marginX + rowW, rowY + rowH);

      const photoSize = 17;
      const photoX = marginX + 3;
      const photoY = rowY + (rowH - photoSize) / 2;

      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(218, 228, 240);
      doc.setLineWidth(0.2);
      doc.roundedRect(photoX, photoY, photoSize, photoSize, 1.5, 1.5, 'FD');

      if (imgDataUrl) {
        try {
          const format = imgDataUrl.includes('data:image/png') ? 'PNG' : 'JPEG';
          doc.addImage(imgDataUrl, format, photoX + 0.5, photoY + 0.5, photoSize - 1, photoSize - 1);
        } catch (e) {}
      } else {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(26, 76, 152);
        doc.text('GT', photoX + photoSize / 2, photoY + photoSize / 2 + 2, { align: 'center' });
      }

      const detailsX = photoX + photoSize + 5;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(8, 20, 38);
      doc.text(item.name || '', detailsX, rowY + 8);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Brand: ${item.brand || 'Global Trades'}   ·   Category: ${item.category || 'General'}`, detailsX, rowY + 14.5);

      const packStr = item.size ? `Size: ${item.size}` : 'Standard';
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.8);
      const packW = doc.getTextWidth(packStr) + 6;
      const packX = marginX + rowW - packW - 4;

      doc.setFillColor(241, 245, 249);
      doc.setDrawColor(226, 232, 240);
      doc.roundedRect(packX, rowY + 4.5, packW, 4.8, 1.2, 1.2, 'FD');
      doc.setTextColor(30, 41, 59);
      doc.text(packStr, packX + 3, rowY + 8);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(6.5);
      doc.setTextColor(5, 150, 105);
      doc.text('WhatsApp: 0495 2765320', packX + packW, rowY + 15.5, { align: 'right' });
    });

    currentProductIndex += pageItems.length;

    if (currentProductIndex < total) {
      doc.addPage();
      pageNumber++;
    }
  }

  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    drawPageFooter(doc, p, totalPages, pageWidth, pageHeight);
  }
}

/**
 * Generates and downloads a custom branded PDF catalog based on customer filters and selected template.
 *
 * @param {Array} products - Filtered or full products list
 * @param {Object} activeFilters - Current filter criteria { category, brand, search }
 * @param {Function} onProgress - Progress callback ({ percent, status, current, total })
 * @param {string} template - Template style: 'cards' (default lookbook) | 'table' | 'minimalist'
 */
export async function generateCatalogPdf(products = [], activeFilters = {}, onProgress = null, template = 'cards') {
  if (!products || products.length === 0) return;

  const total = products.length;
  const { category = 'All', brand = 'All', search = '' } = activeFilters;

  // 1. Preload Company Logo
  if (onProgress) onProgress({ percent: 5, status: 'Preparing branding & high-res assets...' });
  const logoDataUrl = await loadScaledImageDataUrl(BRANDING.LOGO_PATH || '/company-logo.png', 200);

  // 2. Preload Product Images concurrently in batches
  if (onProgress) onProgress({ percent: 12, status: `Loading product photos (0/${total})...`, current: 0, total });

  const productImages = [];
  let loadedCount = 0;
  const batchSize = 10;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const batchPromises = batch.map(async (item) => {
      const safeName = (item.name || '').replace(/[^a-zA-Z0-9]/g, '_');
      const imageSrc = item.image || `/catalog_images/${safeName}.jpg`;
      const dataUrl = await loadScaledImageDataUrl(imageSrc, 200);
      loadedCount++;
      if (onProgress) {
        const percent = Math.min(85, Math.round(12 + (loadedCount / total) * 73));
        onProgress({
          percent,
          status: `Processing product images (${loadedCount}/${total})...`,
          current: loadedCount,
          total,
        });
      }
      return dataUrl;
    });

    const batchResults = await Promise.all(batchPromises);
    productImages.push(...batchResults);
  }

  if (onProgress) onProgress({ percent: 88, status: `Composing ${template.toUpperCase()} catalog pages...` });

  // 3. Initialize jsPDF Document (A4 Portrait)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm

  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Render according to selected template
  if (template === 'table') {
    generateTableTemplate(doc, products, productImages, activeFilters, dateStr, logoDataUrl, pageWidth, pageHeight);
  } else if (template === 'minimalist') {
    generateMinimalistTemplate(doc, products, productImages, activeFilters, dateStr, logoDataUrl, pageWidth, pageHeight);
  } else {
    // Default: 'cards' (Modern 2-Column Lookbook Cards)
    generateCardsTemplate(doc, products, productImages, activeFilters, dateStr, logoDataUrl, pageWidth, pageHeight);
  }

  // 4. Generate Meaningful Filename
  let fileSlug = 'Wholesale_Catalog';
  if (brand && brand !== 'All') {
    fileSlug = `Catalog_${brand.replace(/[^a-zA-Z0-9]/g, '_')}`;
  } else if (category && category !== 'All') {
    fileSlug = `Catalog_${category.replace(/[^a-zA-Z0-9]/g, '_')}`;
  } else if (search && search.trim()) {
    fileSlug = `Catalog_${search.trim().replace(/[^a-zA-Z0-9]/g, '_')}`;
  }

  const templateSlug = template !== 'cards' ? `_${template}` : '';
  const fileName = `Global_Trades_${fileSlug}${templateSlug}.pdf`;

  if (onProgress) onProgress({ percent: 100, status: 'Downloading PDF catalog...' });

  doc.save(fileName);
}
