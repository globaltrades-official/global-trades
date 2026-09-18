import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BRANDING, CONTACT } from '@/constants/theme';

/**
 * Loads an image via fetch + Blob URL + canvas downscaling to create a lightweight,
 * high-resolution base64 JPEG that NEVER taints the canvas and works across all browsers.
 *
 * @param {string} url - Relative or absolute image URL
 * @param {number} maxDim - Maximum width/height in pixels
 * @returns {Promise<string|null>} Data URL string or null
 */
async function loadScaledImageDataUrl(url, maxDim = 160) {
  if (!url) return null;

  // Strategy A: Native fetch -> Blob -> local Blob URL -> Canvas (immune to CORS taint)
  try {
    const res = await fetch(url);
    if (res.ok) {
      const blob = await res.blob();
      const dataUrl = await new Promise((resolve) => {
        const blobUrl = URL.createObjectURL(blob);
        const img = new Image();
        const timer = setTimeout(() => {
          URL.revokeObjectURL(blobUrl);
          // Fallback: Read directly via FileReader
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

            const exportedData = canvas.toDataURL('image/jpeg', 0.82);
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
    // Strategy A failed, proceed to Strategy B
  }

  // Strategy B: Standard Image element without crossOrigin for direct same-domain loading
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
        resolve(canvas.toDataURL('image/jpeg', 0.82));
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
 * Generates and downloads an executive-themed, photo-rich PDF catalog based on customer filters.
 *
 * @param {Array} products - Filtered products list
 * @param {Object} activeFilters - Current filter criteria { category, brand, search }
 * @param {Function} onProgress - Progress callback ({ percent, status, current, total })
 */
export async function generateCatalogPdf(products = [], activeFilters = {}, onProgress = null) {
  if (!products || products.length === 0) return;

  const total = products.length;

  // 1. Preload Company Logo
  if (onProgress) onProgress({ percent: 5, status: 'Preparing branding...' });
  const logoDataUrl = await loadScaledImageDataUrl(BRANDING.LOGO_PATH || '/company-logo.png', 180);

  // 2. Preload Product Images concurrently in batches
  if (onProgress) onProgress({ percent: 15, status: `Loading product photos (0/${total})...`, current: 0, total });

  const productImages = [];
  let loadedCount = 0;

  // Process in concurrent batches of 10 for rapid loading and smooth progress
  const batchSize = 10;
  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const batchPromises = batch.map(async (item) => {
      const safeName = (item.name || '').replace(/[^a-zA-Z0-9]/g, '_');
      const imageSrc = item.image || `/catalog_images/${safeName}.jpg`;
      const dataUrl = await loadScaledImageDataUrl(imageSrc, 160);
      loadedCount++;
      if (onProgress) {
        const percent = Math.min(88, Math.round(15 + (loadedCount / total) * 73));
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

  if (onProgress) onProgress({ percent: 90, status: 'Designing PDF document pages...' });

  // 3. Initialize jsPDF Document (A4 Portrait)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210mm
  const pageHeight = doc.internal.pageSize.getHeight(); // 297mm

  const { category = 'All', brand = 'All', search = '' } = activeFilters;

  // -------------------------------------------------------------
  // THEME: EXECUTIVE B2B DARK NAVY & GOLD ACCENT
  // -------------------------------------------------------------

  // Top Dark Midnight Banner
  doc.setFillColor(8, 20, 38); // #081426 (Midnight Navy)
  doc.rect(0, 0, pageWidth, 40, 'F');

  // Dual Accent Stripes: Gold (#F59E0B) + Cyan (#00A3E0)
  doc.setFillColor(245, 158, 11); // Amber / Gold
  doc.rect(0, 40, pageWidth, 1.5, 'F');
  doc.setFillColor(0, 163, 224); // Cyan
  doc.rect(0, 41.5, pageWidth, 1.2, 'F');

  // Render Logo Badge in Header
  if (logoDataUrl) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(12, 6, 28, 28, 4, 4, 'F');
    doc.setDrawColor(245, 158, 11);
    doc.setLineWidth(0.4);
    doc.roundedRect(12, 6, 28, 28, 4, 4, 'S');
    const logoFormat = logoDataUrl.includes('data:image/png') ? 'PNG' : 'JPEG';
    doc.addImage(logoDataUrl, logoFormat, 14, 8, 24, 24);
  }

  // Company Name
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text(BRANDING.COMPANY_NAME || 'GLOBAL TRADES', 44, 15);

  // Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(0, 163, 224); // Cyan
  doc.text('WHOLESALE C&F DISTRIBUTOR · KOZHIKODE, KERALA', 44, 21);

  // Contact Details
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(220, 235, 255);
  doc.text(
    `Enquiries Desk: ${CONTACT.ENQUIRY_PHONE || '94479 31507'}   |   WhatsApp Orders: ${CONTACT.WHATSAPP_DISPLAY || '0495 2765320'}`,
    44,
    27
  );
  doc.text(
    'PT Usha Road, Near Beach, Kozhikode - 673032   |   ★ 4.6 Google Rating (36 Verified B2B Reviews)',
    44,
    33
  );

  // -------------------------------------------------------------
  // FILTER SUMMARY CONTAINER
  // -------------------------------------------------------------
  const summaryY = 48;
  const summaryHeight = 22;

  // Soft Ice-Blue Card Background with Navy Border
  doc.setFillColor(243, 247, 252);
  doc.setDrawColor(186, 210, 238);
  doc.setLineWidth(0.3);
  doc.roundedRect(12, summaryY, pageWidth - 24, summaryHeight, 2, 2, 'FD');

  // Left Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(15, 38, 74);
  doc.text('Official Commercial Products Directory (Custom Selection)', 16, summaryY + 6.5);

  // Filter Chips / Labels
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(40, 60, 90);

  const activeLabels = [];
  if (category && category !== 'All') activeLabels.push(`Category: ${category}`);
  if (brand && brand !== 'All') activeLabels.push(`Brand: ${brand}`);
  if (search && search.trim()) activeLabels.push(`Keyword: "${search.trim()}"`);
  if (activeLabels.length === 0) activeLabels.push('All Commercial Categories & Brands Included');

  doc.text(`Active Filter Criteria: ${activeLabels.join('   •   ')}`, 16, summaryY + 12.5);

  // Wholesale Notice
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Note: Live wholesale rates & bulk tier discounts are shared daily on WhatsApp: 0495 2765320.',
    16,
    summaryY + 18
  );

  // Right Side: Total Items Badge (Amber / Gold Pill)
  const badgeWidth = 44;
  const badgeX = pageWidth - 12 - badgeWidth - 4;
  doc.setFillColor(245, 158, 11); // Gold
  doc.roundedRect(badgeX, summaryY + 4, badgeWidth, 7, 2, 2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(8, 20, 38);
  doc.text(
    `${total} ${total === 1 ? 'Product' : 'Products'} Listed`,
    badgeX + badgeWidth / 2,
    summaryY + 8.8,
    { align: 'center' }
  );

  // Generation Date
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(`Issued: ${dateStr}`, badgeX + badgeWidth / 2, summaryY + 17, { align: 'center' });

  // -------------------------------------------------------------
  // PRODUCTS TABLE WITH EMBEDDED PACKSHOT IMAGES
  // -------------------------------------------------------------
  const tableData = products.map((item, idx) => [
    idx + 1,
    '', // Image placeholder column drawn via didDrawCell
    `${item.name}\nCategory: ${item.category || 'Food Service'}`,
    item.brand || 'Global Trades',
    item.size || 'Standard',
  ]);

  autoTable(doc, {
    startY: summaryY + summaryHeight + 5,
    head: [['NO.', 'IMAGE', 'PRODUCT DESCRIPTION & CATEGORY', 'BRAND', 'PACKAGING']],
    body: tableData,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      textColor: [8, 20, 38],
      cellPadding: 2,
      lineColor: [220, 230, 242],
      lineWidth: 0.15,
      minCellHeight: 20, // Ample space for the 15mm image
      valign: 'middle',
    },
    headStyles: {
      fillColor: [15, 38, 74], // Deep Navy
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'left',
      minCellHeight: 8,
    },
    alternateRowStyles: {
      fillColor: [249, 251, 254],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 9, fontStyle: 'bold', textColor: [100, 116, 139] },
      1: { halign: 'center', cellWidth: 24 },
      2: { cellWidth: 'auto', fontStyle: 'bold' },
      3: { halign: 'center', cellWidth: 32, fontStyle: 'bold', textColor: [26, 76, 152] },
      4: { halign: 'center', cellWidth: 24, fontStyle: 'bold', textColor: [8, 20, 38] },
    },
    margin: { left: 12, right: 12, bottom: 16 },

    didDrawCell: (data) => {
      // Draw product packshot thumbnail in column 1 (IMAGE)
      if (data.section === 'body' && data.column.index === 1) {
        const rowIndex = data.row.index;
        const imgDataUrl = productImages[rowIndex];
        const cell = data.cell;
        const imgSize = 15.5; // mm
        const x = cell.x + (cell.width - imgSize) / 2;
        const y = cell.y + (cell.height - imgSize) / 2;

        if (imgDataUrl) {
          try {
            // White card background behind the packshot
            doc.setFillColor(255, 255, 255);
            doc.setDrawColor(218, 228, 240);
            doc.setLineWidth(0.2);
            doc.roundedRect(x - 0.6, y - 0.6, imgSize + 1.2, imgSize + 1.2, 1, 1, 'FD');

            const format = imgDataUrl.includes('data:image/png') ? 'PNG' : 'JPEG';
            doc.addImage(imgDataUrl, format, x, y, imgSize, imgSize);
          } catch (e) {
            console.error('Failed to embed product image in cell:', e);
          }
        } else {
          // Monogram placeholder if photo unavailable
          doc.setFillColor(240, 244, 250);
          doc.setDrawColor(218, 228, 240);
          doc.roundedRect(x, y, imgSize, imgSize, 1.5, 1.5, 'FD');
          doc.setFont('helvetica', 'bold');
          doc.setFontSize(7.5);
          doc.setTextColor(26, 76, 152);
          doc.text('GT', x + imgSize / 2, y + imgSize / 2 + 2, { align: 'center' });
        }
      }
    },

    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      const currentPage = data.pageNumber;

      // Draw top bar on pages 2+
      if (currentPage > 1) {
        doc.setFillColor(8, 20, 38);
        doc.rect(0, 0, pageWidth, 10, 'F');
        doc.setFillColor(245, 158, 11);
        doc.rect(0, 10, pageWidth, 1, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.text('GLOBAL TRADES · WHOLESALE PRODUCTS DIRECTORY', 12, 6.5);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(220, 235, 255);
        doc.text('WhatsApp: 0495 2765320  |  Call: 94479 31507', pageWidth - 12, 6.5, { align: 'right' });
      }

      // Footer line on all pages
      doc.setDrawColor(200, 215, 235);
      doc.setLineWidth(0.3);
      doc.line(12, pageHeight - 11, pageWidth - 12, pageHeight - 11);

      // Gold dot
      doc.setFillColor(245, 158, 11);
      doc.circle(14, pageHeight - 6.5, 0.8, 'F');

      // Left Footer text
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(100, 116, 139);
      doc.text(
        'Global Trades Calicut · Wholesale Institutional Food Service · Prices subject to daily confirmation on WhatsApp',
        17,
        pageHeight - 6.5
      );

      // Right Page Number
      const pageStr = `Page ${currentPage} of ${pageCount}`;
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 38, 74);
      doc.text(pageStr, pageWidth - 12, pageHeight - 6.5, { align: 'right' });
    },
  });

  // 4. Generate Meaningful Filename
  let fileSlug = 'Wholesale_Catalog';
  if (brand && brand !== 'All') {
    fileSlug = `Catalog_${brand.replace(/[^a-zA-Z0-9]/g, '_')}`;
  } else if (category && category !== 'All') {
    fileSlug = `Catalog_${category.replace(/[^a-zA-Z0-9]/g, '_')}`;
  } else if (search && search.trim()) {
    fileSlug = `Catalog_${search.trim().replace(/[^a-zA-Z0-9]/g, '_')}`;
  }

  const fileName = `Global_Trades_${fileSlug}.pdf`;

  if (onProgress) onProgress({ percent: 100, status: 'Downloading PDF catalog...' });

  doc.save(fileName);
}
