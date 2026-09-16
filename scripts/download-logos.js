import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { wholesaleBrands, BRAND_LOGO_FILES, getBrandFileSlug } from '../src/data/wholesaleBrands.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output directory for brand logos
const outputDir = path.join(__dirname, '..', 'public', 'assets', 'images', 'brands');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

export function verifyAndReportLogos() {
  console.log('========================================================');
  console.log('Global Trades — Wholesale Brand Logos Verification');
  console.log(`Directory: ${outputDir}`);
  console.log('========================================================\n');

  let validCount = 0;
  let missingCount = 0;

  wholesaleBrands.forEach((brand) => {
    const preferredFile = BRAND_LOGO_FILES[brand.id] || `${getBrandFileSlug(brand.name)}.png`;
    const preferredPath = path.join(outputDir, preferredFile);
    const pngPath = path.join(outputDir, `${getBrandFileSlug(brand.name)}.png`);
    const svgPath = path.join(outputDir, `${getBrandFileSlug(brand.name)}.svg`);

    let targetPath = null;
    let format = 'MISSING';

    if (fs.existsSync(preferredPath)) {
      targetPath = preferredPath;
    } else if (fs.existsSync(pngPath)) {
      targetPath = pngPath;
    } else if (fs.existsSync(svgPath)) {
      targetPath = svgPath;
    }

    if (targetPath) {
      const stats = fs.statSync(targetPath);
      const isSvg = targetPath.endsWith('.svg');
      format = isSvg ? `Vector SVG (${stats.size} B)` : `High-Res PNG (${(stats.size / 1024).toFixed(1)} KB)`;
      console.log(`[OK] #${brand.id} ${brand.name.padEnd(20)} -> ${path.basename(targetPath).padEnd(24)} [${format}]`);
      validCount++;
    } else {
      console.log(`[MISSING] #${brand.id} ${brand.name.padEnd(20)} -> ${preferredFile}`);
      missingCount++;
    }
  });

  console.log('\n========================================================');
  console.log(`Status: ${validCount} / ${wholesaleBrands.length} Brand Logos Active & Ready!`);
  if (missingCount === 0) {
    console.log('All brand logos are present and ready for production!');
  } else {
    console.log(`Warning: ${missingCount} logos need attention.`);
  }
  console.log('========================================================\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  verifyAndReportLogos();
}

export default verifyAndReportLogos;
