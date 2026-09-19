import * as jspdfLib from 'jspdf';
const jsPDF = jspdfLib.jsPDF || jspdfLib.default?.jsPDF || jspdfLib.default;
import { BRANDING, CONTACT } from '@/constants/theme';

/**
 * Loads an image via fetch + Blob URL + canvas downscaling to create a lightweight,
 * high-resolution base64 JPEG that NEVER taints the canvas and works across all browsers.
 *
 * @param {string} url - Relative or absolute image URL
 * @param {number} maxDim - Maximum width/height in pixels
 * @returns {Promise<string|null>} Data URL string or null
 */
async function loadScaledImageDataUrl(url, maxDim = 220) {
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
    // Strategy A failed, proceed to Strategy B
  }

  // Strategy B: Standard Image element fallback for direct same-domain loading
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
 * Draws the Executive Cover Page for full multi-page catalog downloads.
 */
function drawCoverPage(doc, totalProducts, dateStr, logoDataUrl, pageWidth, pageHeight) {
  // Midnight Navy Background
  doc.setFillColor(8, 20, 38); // #081426
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Top Royal Navy Surface Header
  doc.setFillColor(15, 38, 74); // #0F264A
  doc.rect(0, 0, pageWidth, 52, 'F');

  // Dual Accent Stripes: Gold & Cyan
  doc.setFillColor(245, 158, 11); // Amber / Gold #F59E0B
  doc.rect(0, 52, pageWidth, 2, 'F');
  doc.setFillColor(0, 163, 224); // Cyan #00A3E0
  doc.rect(0, 54, pageWidth, 1.5, 'F');

  // Centered Floating Logo Badge
  const logoBoxW = 44;
  const logoBoxH = 44;
  const logoBoxX = (pageWidth - logoBoxW) / 2;
  const logoBoxY = 30;

  doc.setFillColor(255, 255, 255);
  doc.roundedRect(logoBoxX, logoBoxY, logoBoxW, logoBoxH, 5, 5, 'F');
  doc.setDrawColor(245, 158, 11); // Gold Border
  doc.setLineWidth(0.8);
  doc.roundedRect(logoBoxX, logoBoxY, logoBoxW, logoBoxH, 5, 5, 'S');

  if (logoDataUrl) {
    const logoFormat = logoDataUrl.includes('data:image/png') ? 'PNG' : 'JPEG';
    doc.addImage(logoDataUrl, logoFormat, logoBoxX + 4, logoBoxY + 4, 36, 36);
  }

  // Company Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(25);
  doc.text(BRANDING.COMPANY_NAME || 'GLOBAL TRADES', pageWidth / 2, 86, { align: 'center' });

  // Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(0, 163, 224); // Cyan
  doc.text('WHOLESALE C&F DISTRIBUTOR & DEALER · KOZHIKODE, KERALA', pageWidth / 2, 93, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(180, 205, 235);
  doc.text('PROCESSED FOODS · BEVERAGES · HORECA & INSTITUTIONAL FOOD SERVICE', pageWidth / 2, 99, { align: 'center' });

  // Subtle separator line
  doc.setDrawColor(30, 60, 100);
  doc.setLineWidth(0.4);
  doc.line(36, 106, pageWidth - 36, 106);

  // Central Gold Catalog Badge
  doc.setFillColor(245, 158, 11); // Gold #F59E0B
  doc.roundedRect(pageWidth / 2 - 58, 114, 116, 10.5, 3, 3, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(8, 20, 38);
  doc.text('OFFICIAL COMMERCIAL PRODUCT CATALOGUE', pageWidth / 2, 120.8, { align: 'center' });

  // Edition subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(220, 235, 255);
  doc.text(`COMPLETE DIRECTORY · ${totalProducts} VERIFIED WHOLESALE PRODUCTS`, pageWidth / 2, 131.5, { align: 'center' });

  // 3 Feature Highlight Cards
  const cardW = 56;
  const cardH = 28;
  const cardGap = 8;
  const totalCardsW = 3 * cardW + 2 * cardGap;
  const startCardX = (pageWidth - totalCardsW) / 2;
  const cardY = 142;

  const features = [
    { title: 'AUTHORISED C&F', desc: 'Direct wholesale distribution for leading national & global brands', color: [0, 163, 224] },
    { title: 'HORECA SPECIALIST', desc: 'Custom packing & bulk tier supply for cafes, restaurants & bakeries', color: [245, 158, 11] },
    { title: 'DAILY DISPATCH', desc: 'Cold-chain & ambient commercial logistics across Malabar & Kerala', color: [34, 197, 94] },
  ];

  features.forEach((feat, idx) => {
    const cx = startCardX + idx * (cardW + cardGap);
    doc.setFillColor(15, 38, 74);
    doc.setDrawColor(40, 75, 120);
    doc.setLineWidth(0.3);
    doc.roundedRect(cx, cardY, cardW, cardH, 3, 3, 'FD');

    // Colored Accent Stripe
    doc.setFillColor(feat.color[0], feat.color[1], feat.color[2]);
    doc.roundedRect(cx, cardY, cardW, 1.5, 1, 1, 'F');

    // Title
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(feat.color[0], feat.color[1], feat.color[2]);
    doc.text(feat.title, cx + cardW / 2, cardY + 8.5, { align: 'center' });

    // Desc
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(205, 225, 248);
    const descLines = doc.splitTextToSize(feat.desc, cardW - 6);
    doc.text(descLines, cx + cardW / 2, cardY + 14.5, { align: 'center' });
  });

  // Contact & Wholesale Desk Box
  const deskY = 181;
  const deskW = 184;
  const deskH = 52;
  const deskX = (pageWidth - deskW) / 2;

  doc.setFillColor(12, 28, 54);
  doc.setDrawColor(245, 158, 11);
  doc.setLineWidth(0.5);
  doc.roundedRect(deskX, deskY, deskW, deskH, 3, 3, 'FD');

  // Desk Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(245, 158, 11);
  doc.text('WHOLESALE ORDER & ENQUIRY DESK', pageWidth / 2, deskY + 9, { align: 'center' });

  // Contact Grid
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(255, 255, 255);

  doc.text(`Enquiries & Sales Desk: +91 ${CONTACT.ENQUIRY_PHONE || '94479 31507'}`, deskX + 10, deskY + 18);
  doc.text(`WhatsApp Orders Desk: ${CONTACT.WHATSAPP_DISPLAY || '0495 2765320'}`, deskX + 10, deskY + 25);
  doc.text(`Office & Warehouse: PT Usha Road, 4th Gate, Vellayil, Kozhikode - 673032`, deskX + 10, deskY + 32);

  // Email & Hours
  doc.setTextColor(180, 205, 235);
  doc.setFontSize(7.5);
  doc.text(`Email: ${CONTACT.EMAIL || 'globaltrades2011@gmail.com'}   |   Hours: 10:00 AM – 6:00 PM (Mon–Sat)`, deskX + 10, deskY + 39);

  // Daily Quote Note
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(0, 163, 224);
  doc.text('Note: Real-time bulk pricing, institutional rates & tier discounts are shared daily on WhatsApp.', deskX + 10, deskY + 46);

  // Bottom Footer on Cover
  doc.setDrawColor(30, 60, 100);
  doc.setLineWidth(0.3);
  doc.line(12, pageHeight - 16, pageWidth - 12, pageHeight - 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(140, 165, 195);
  doc.text(`Catalogue Published & Issued: ${dateStr} · Kozhikode, Kerala`, 12, pageHeight - 10);
  doc.text('Global Trades Wholesale & Institutional Distribution', pageWidth - 12, pageHeight - 10, { align: 'right' });
}

/**
 * Draws the top running header on product pages.
 */
function drawPageHeader(doc, logoDataUrl, pageWidth) {
  // Midnight Navy Banner
  doc.setFillColor(8, 20, 38); // #081426
  doc.rect(0, 0, pageWidth, 14, 'F');

  // Dual Accent Stripes: Gold & Cyan
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 14, pageWidth, 1.2, 'F');
  doc.setFillColor(0, 163, 224);
  doc.rect(0, 15.2, pageWidth, 0.8, 'F');

  // Mini Logo Badge (if available)
  let textStartX = 12;
  if (logoDataUrl) {
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(12, 2, 10, 10, 1.5, 1.5, 'F');
    const logoFormat = logoDataUrl.includes('data:image/png') ? 'PNG' : 'JPEG';
    doc.addImage(logoDataUrl, logoFormat, 12.8, 2.8, 8.4, 8.4);
    textStartX = 25;
  }

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.text(BRANDING.COMPANY_NAME || 'GLOBAL TRADES', textStartX, 7);

  // Header Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(0, 163, 224);
  doc.text('WHOLESALE PRODUCT CATALOGUE · KOZHIKODE', textStartX, 11);

  // Right Header Contacts
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(220, 235, 255);
  doc.text(
    `WhatsApp Orders: ${CONTACT.WHATSAPP_DISPLAY || '0495 2765320'}   |   Call: ${CONTACT.ENQUIRY_PHONE || '94479 31507'}`,
    pageWidth - 12,
    8.5,
    { align: 'right' }
  );
}

/**
 * Draws the running footer on product pages.
 */
function drawPageFooter(doc, currentPage, totalPages, pageWidth, pageHeight) {
  // Divider line
  doc.setDrawColor(210, 225, 240);
  doc.setLineWidth(0.3);
  doc.line(12, pageHeight - 11, pageWidth - 12, pageHeight - 11);

  // Gold Dot Accent
  doc.setFillColor(245, 158, 11);
  doc.circle(14, pageHeight - 6.5, 0.8, 'F');

  // Left Disclaimer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(100, 116, 139);
  doc.text(
    'Global Trades Calicut · Wholesale Institutional Food Service · Rates confirmed daily via WhatsApp: 0495 2765320',
    17,
    pageHeight - 6.5
  );

  // Right Page Number
  const pageStr = `Page ${currentPage} of ${totalPages}`;
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 38, 74);
  doc.text(pageStr, pageWidth - 12, pageHeight - 6.5, { align: 'right' });
}

/**
 * Draws an individual Product Card in the Lookbook 2-column layout.
 */
function drawProductCard(doc, item, imgDataUrl, cardX, cardY, cardW, cardH) {
  // Card Container Background & Border
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(218, 228, 240);
  doc.setLineWidth(0.3);
  doc.roundedRect(cardX, cardY, cardW, cardH, 2.5, 2.5, 'FD');

  // Top Accent Stripe (Royal Blue)
  doc.setFillColor(26, 76, 152); // #1A4C98
  doc.roundedRect(cardX, cardY, cardW, 1.2, 1, 1, 'F');

  // Left Photo Frame Container
  const photoBoxW = 34;
  const photoBoxH = 41;
  const photoBoxX = cardX + 3.5;
  const photoBoxY = cardY + 3.5;

  doc.setFillColor(248, 250, 253);
  doc.setDrawColor(226, 234, 244);
  doc.setLineWidth(0.2);
  doc.roundedRect(photoBoxX, photoBoxY, photoBoxW, photoBoxH, 2, 2, 'FD');

  // Render Product Photo or Elegant Fallback Monogram
  const imgSize = 30;
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
    // Fallback Monogram
    doc.setFillColor(235, 242, 250);
    doc.circle(photoBoxX + photoBoxW / 2, photoBoxY + photoBoxH / 2 - 2, 10, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(26, 76, 152);
    doc.text('GT', photoBoxX + photoBoxW / 2, photoBoxY + photoBoxH / 2 + 1.5, { align: 'center' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(5.5);
    doc.setTextColor(120, 140, 165);
    doc.text('Packshot on Request', photoBoxX + photoBoxW / 2, photoBoxY + photoBoxH / 2 + 13.5, { align: 'center' });
  }

  // Right Side Details
  const textX = cardX + 41;
  const maxTextW = cardW - 44; // ~46mm

  // 1. Brand Badge Pill
  const brandName = item.brand || 'Global Trades';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  const brandTextW = Math.min(doc.getTextWidth(brandName) + 4.5, maxTextW);

  doc.setFillColor(235, 243, 252); // Soft Royal Blue tint
  doc.roundedRect(textX, cardY + 4.2, brandTextW, 4.2, 1, 1, 'F');
  doc.setTextColor(26, 76, 152);
  doc.text(brandName, textX + 2.2, cardY + 7.4);

  // 2. Product Name (Up to 2 lines)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.2);
  doc.setTextColor(8, 20, 38);
  const nameLines = doc.splitTextToSize(item.name || '', maxTextW);

  if (nameLines.length === 1) {
    doc.text(nameLines[0], textX, cardY + 13.5);
  } else {
    doc.text(nameLines[0], textX, cardY + 12.2);
    doc.text(nameLines[1], textX, cardY + 15.8);
  }

  // 3. Packaging / Pack Size Badge
  const sizeStr = item.size ? `Pack: ${item.size}` : 'Standard Packaging';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  const sizeTextW = Math.min(doc.getTextWidth(sizeStr) + 5, maxTextW);

  const sizeY = nameLines.length > 1 ? cardY + 20.2 : cardY + 18.2;
  doc.setFillColor(241, 245, 249); // Soft slate
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.2);
  doc.roundedRect(textX, sizeY, sizeTextW, 4.2, 1, 1, 'FD');
  doc.setTextColor(30, 41, 59);
  doc.text(sizeStr, textX + 2.5, sizeY + 3.1);

  // 4. Category Tag
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.6);
  doc.setTextColor(100, 116, 139);
  const catY = sizeY + 8;
  doc.text(`Category: ${item.category || 'General Wholesale'}`, textX, catY);

  // 5. Wholesale Supply Badge
  const badgeY = cardY + 39.5;
  doc.setFillColor(236, 253, 245); // Light Emerald
  doc.setDrawColor(167, 243, 208);
  doc.setLineWidth(0.2);
  doc.roundedRect(textX, badgeY, maxTextW, 4.5, 1, 1, 'FD');

  // Emerald live stock dot
  doc.setFillColor(16, 185, 129);
  doc.circle(textX + 2.8, badgeY + 2.25, 0.8, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.2);
  doc.setTextColor(6, 95, 70);
  doc.text('Wholesale Stock · Inquire Now', textX + 5, badgeY + 3.2);
}

/**
 * Generates and downloads a modern Lookbook-style PDF catalog based on customer filters.
 *
 * @param {Array} products - Filtered or full products list
 * @param {Object} activeFilters - Current filter criteria { category, brand, search }
 * @param {Function} onProgress - Progress callback ({ percent, status, current, total })
 */
export async function generateCatalogPdf(products = [], activeFilters = {}, onProgress = null) {
  if (!products || products.length === 0) return;

  const total = products.length;
  const { category = 'All', brand = 'All', search = '' } = activeFilters;

  // 1. Preload Company Logo
  if (onProgress) onProgress({ percent: 5, status: 'Preparing branding & high-res assets...' });
  const logoDataUrl = await loadScaledImageDataUrl(BRANDING.LOGO_PATH || '/company-logo.png', 220);

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
      const dataUrl = await loadScaledImageDataUrl(imageSrc, 220);
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

  if (onProgress) onProgress({ percent: 88, status: 'Composing Lookbook catalog pages...' });

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

  // Determine if this catalog download warrants the Executive Front Cover Page
  // Full catalog downloads (unfiltered or > 12 products with 'All') receive the cover page
  const isFullCatalog = category === 'All' && brand === 'All' && !search && total > 12;

  // Lookbook Card Grid Specifications
  const marginX = 12;
  const colGap = 6;
  const cardW = (pageWidth - 2 * marginX - colGap) / 2; // 90mm
  const cardH = 48; // 48mm
  const rowGap = 4;

  let currentProductIndex = 0;
  let pageNumber = 1;

  // Draw Cover Page if Full Catalog
  if (isFullCatalog) {
    drawCoverPage(doc, total, dateStr, logoDataUrl, pageWidth, pageHeight);
    doc.addPage();
    pageNumber++;
  }

  // Calculate Product Pages
  // First product page for filtered downloads has a 16mm Filter Summary Card at the top (fits 4 rows = 8 items)
  // Subsequent pages (or all pages of full catalog) fit 5 rows = 10 items
  const isFirstProductPageFiltered = !isFullCatalog;

  while (currentProductIndex < total) {
    const isFirstFilteredPage = isFirstProductPageFiltered && (pageNumber === 1);
    const maxRows = isFirstFilteredPage ? 4 : 5;
    const maxItemsOnThisPage = maxRows * 2;

    // Draw Top Running Header
    drawPageHeader(doc, logoDataUrl, pageWidth);

    let startY = 19;

    // If First Filtered Page: Render Filter Summary Banner
    if (isFirstFilteredPage) {
      const summaryHeight = 16;
      doc.setFillColor(243, 247, 252);
      doc.setDrawColor(186, 210, 238);
      doc.setLineWidth(0.3);
      doc.roundedRect(marginX, startY, pageWidth - 2 * marginX, summaryHeight, 2, 2, 'FD');

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(15, 38, 74);
      doc.text('Commercial Product Directory (Custom Selection)', marginX + 4, startY + 5.5);

      // Filter Chips
      const activeLabels = [];
      if (category && category !== 'All') activeLabels.push(`Category: ${category}`);
      if (brand && brand !== 'All') activeLabels.push(`Brand: ${brand}`);
      if (search && search.trim()) activeLabels.push(`Keyword: "${search.trim()}"`);
      if (activeLabels.length === 0) activeLabels.push('All Commercial Categories & Brands Included');

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.2);
      doc.setTextColor(50, 75, 105);
      doc.text(`Active Filters: ${activeLabels.join('   •   ')}`, marginX + 4, startY + 11.2);

      // Total Items Pill on Right
      const badgeW = 38;
      const badgeX = pageWidth - marginX - badgeW - 3;
      doc.setFillColor(245, 158, 11); // Gold
      doc.roundedRect(badgeX, startY + 3.5, badgeW, 6.2, 1.8, 1.8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(8, 20, 38);
      doc.text(`${total} Products`, badgeX + badgeW / 2, startY + 7.8, { align: 'center' });

      startY += summaryHeight + 4; // 39mm
    }

    // Render Cards Grid on This Page
    const pageItems = products.slice(currentProductIndex, currentProductIndex + maxItemsOnThisPage);

    pageItems.forEach((item, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);

      const cardX = marginX + col * (cardW + colGap);
      const cardY = startY + row * (cardH + rowGap);

      const globalIndex = currentProductIndex + idx;
      const imgDataUrl = productImages[globalIndex];

      drawProductCard(doc, item, imgDataUrl, cardX, cardY, cardW, cardH);
    });

    currentProductIndex += pageItems.length;

    // Advance to next page if more products remain
    if (currentProductIndex < total) {
      doc.addPage();
      pageNumber++;
    }
  }

  // Stamp Footers with accurate Total Pages on all product pages
  const totalPages = doc.internal.getNumberOfPages();
  const startFooterPage = isFullCatalog ? 2 : 1;

  for (let p = startFooterPage; p <= totalPages; p++) {
    doc.setPage(p);
    drawPageFooter(doc, p, totalPages, pageWidth, pageHeight);
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

  const fileName = `Global_Trades_${fileSlug}.pdf`;

  if (onProgress) onProgress({ percent: 100, status: 'Downloading Lookbook PDF catalog...' });

  doc.save(fileName);
}
