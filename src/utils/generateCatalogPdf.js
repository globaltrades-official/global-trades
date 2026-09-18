import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BRANDING, CONTACT } from '@/constants/theme';

/**
 * Generates and downloads a branded PDF catalog based on customer filters.
 *
 * @param {Array} products - Filtered products list
 * @param {Object} activeFilters - Current filter criteria { category, brand, search }
 */
export function generateCatalogPdf(products = [], activeFilters = {}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const { category = 'All', brand = 'All', search = '' } = activeFilters;

  // 1. Header Banner (Navy Blue)
  doc.setFillColor(26, 76, 152); // #1A4C98
  doc.rect(0, 0, pageWidth, 34, 'F');

  // Decorative Accent Stripe (Cyan)
  doc.setFillColor(0, 163, 224); // #00A3E0
  doc.rect(0, 34, pageWidth, 2, 'F');

  // Header Title
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(BRANDING.COMPANY_NAME || 'GLOBAL TRADES', 14, 13);

  // Header Subtitle
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(220, 235, 255);
  doc.text('WHOLESALE C&F DISTRIBUTOR · KOZHIKODE, KERALA', 14, 19);
  doc.text(
    `Enquiries: ${CONTACT.ENQUIRY_PHONE || '94479 31507'}   |   WhatsApp Orders: ${CONTACT.WHATSAPP_DISPLAY || '0495 2765320'}`,
    14,
    25
  );
  doc.text('Address: PT Usha Road, Kozhikode - 673032, Kerala', 14, 30);

  // 2. Filter Summary Card
  const startY = 42;
  doc.setFillColor(244, 248, 252);
  doc.setDrawColor(208, 223, 239);
  doc.roundedRect(14, startY, pageWidth - 28, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(26, 76, 152);
  doc.text('Wholesale Product Catalog (Custom Selection)', 18, startY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(8, 20, 38);

  const filterDescriptions = [];
  if (category && category !== 'All') filterDescriptions.push(`Category: ${category}`);
  if (brand && brand !== 'All') filterDescriptions.push(`Brand: ${brand}`);
  if (search && search.trim()) filterDescriptions.push(`Keyword: "${search.trim()}"`);
  if (filterDescriptions.length === 0) filterDescriptions.push('Selection: All Catalog Categories & Brands');

  doc.text(`Active Filters: ${filterDescriptions.join('   |   ')}`, 18, startY + 14);

  const today = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(229, 37, 40); // Red highlight
  doc.text(`Total Products: ${products.length} Items`, 18, startY + 20);

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Generated on: ${today}`, pageWidth - 55, startY + 20);

  // 3. Products Table
  const tableData = products.map((item, idx) => [
    idx + 1,
    item.name || 'N/A',
    item.brand || '-',
    item.category || '-',
    item.size || '-',
  ]);

  autoTable(doc, {
    startY: startY + 28,
    head: [['#', 'Product Description', 'Brand', 'Category', 'Packing / Size']],
    body: tableData,
    theme: 'grid',
    styles: {
      font: 'helvetica',
      fontSize: 8.5,
      textColor: [8, 20, 38],
      cellPadding: 2.2,
      lineColor: [220, 230, 242],
      lineWidth: 0.1,
      valign: 'middle',
    },
    headStyles: {
      fillColor: [26, 76, 152],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5,
      halign: 'left',
    },
    alternateRowStyles: {
      fillColor: [248, 250, 254],
    },
    columnStyles: {
      0: { halign: 'center', cellWidth: 10 },
      1: { cellWidth: 'auto', fontStyle: 'bold' },
      2: { cellWidth: 32 },
      3: { cellWidth: 36 },
      4: { halign: 'center', cellWidth: 26 },
    },
    margin: { left: 14, right: 14, bottom: 18 },
    didDrawPage: (data) => {
      // Footer on every page
      const pageCount = doc.internal.getNumberOfPages();
      const currentPage = data.pageNumber;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(120, 135, 155);

      // Line above footer
      doc.setDrawColor(220, 230, 242);
      doc.line(14, pageHeight - 11, pageWidth - 14, pageHeight - 11);

      // Footer disclaimer
      doc.text(
        'Global Trades Wholesale · PT Usha Rd, Kozhikode · Live wholesale pricing confirmed via WhatsApp: 0495 2765320',
        14,
        pageHeight - 6
      );

      // Page numbers
      const pageStr = `Page ${currentPage} of ${pageCount}`;
      doc.text(pageStr, pageWidth - 14 - doc.getTextWidth(pageStr), pageHeight - 6);
    },
  });

  // 4. Determine Dynamic File Name
  let fileSlug = 'Filtered_Catalog';
  if (brand && brand !== 'All') {
    fileSlug = `Catalog_${brand.replace(/[^a-zA-Z0-9]/g, '_')}`;
  } else if (category && category !== 'All') {
    fileSlug = `Catalog_${category.replace(/[^a-zA-Z0-9]/g, '_')}`;
  } else if (search && search.trim()) {
    fileSlug = `Catalog_Search_${search.trim().replace(/[^a-zA-Z0-9]/g, '_')}`;
  }

  const fileName = `Global_Trades_${fileSlug}.pdf`;
  doc.save(fileName);
}
