import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';
import { wholesaleBrands } from '../src/data/wholesaleBrands.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Output directory for brand logos
const outputDir = path.join(__dirname, '..', 'public', 'assets', 'images', 'brands');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Map brand names to their official domains
const getBrandDomain = (brandName) => {
  const domains = {
    "Monin": "monin.com",
    "Barry Callebaut": "barry-callebaut.com",
    "Veeba": "veeba.in",
    "Del Monte": "delmonte.com",
    "American Garden": "americangarden.com",
    "Kikkoman": "kikkoman.com",
    "Lee Kum Kee": "leekumkee.com",
    "Fruitomans": "fruitomans.com",
    "Morton": "mortonfoods.com",
    "Golden Crown": "goldencrown.com",
    "D'lecta": "dlecta.com",
    "HyFun Foods": "hyfunfoods.com",
    "Amul": "amul.com",
    "Western": "western.com",
    "Fortune": "fortunefoods.com",
    "Tetley": "tetley.com",
    "Malas": "malas.co.in",
    "Manama": "manama.co.in",
    "Bru": "bru.com",
    "Nestle": "nestle.com",
    "Nova": "novadairy.com",
    "Cacao Barry": "cacaobarry.com",
    "Cadbury": "cadbury.co.uk",
    "Ferrero": "ferrero.com",
    "Bush": "bushbeverage.com",
    "Delta": "delta-bakery.com",
    "Mothers Maid": "mothersmaid.com",
    "Celebre": "celebre.in",
    "Woh Hup": "wohhup.com",
    "Pouchung": "pouchung.com",
    "Thaichung": "thaichung.com",
    "HP Sauce": "hpsauce.co.uk",
    "Mae Pranom": "maepranom.com",
    "Sriraja Panich": "srirajapanich.com",
    "Weikfield": "weikfield.com",
    "Druk": "druk.bh",
    "Kissan": "kissan.co.in",
    "Maggi": "maggi.in",
    "Knorr": "knorr.com",
    "Chua Hah Seng": "chuahahseng.com",
    "Namjai": "namjaifood.com",
    "Milky Mist": "milkymist.com",
    "Figaro": "figaro.com",
    "Due Vittori": "duevittori.com",
    "Pietro": "pietro-gilardi.com",
    "Olavio": "olavio.com",
    "Spighe Di Campo": "spighedicampo.it"
  };
  return domains[brandName] || `${brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
};

// Check if buffer contains a valid image (PNG, JPEG, SVG, WebP, ICO)
function isValidImageBuffer(buffer) {
  if (!buffer || buffer.length < 150) return false;
  const hex = buffer.subarray(0, 8).toString('hex');

  // PNG: 89 50 4e 47
  if (hex.startsWith('89504e47')) return true;
  // JPEG: ff d8 ff
  if (hex.startsWith('ffd8ff')) return true;
  // WebP: 52 49 46 46 ... 57 45 42 50
  if (hex.startsWith('52494646')) return true;
  // ICO: 00 00 01 00
  if (hex.startsWith('00000100')) return true;
  // SVG text
  const text = buffer.subarray(0, 100).toString('utf-8').trim().toLowerCase();
  if (text.startsWith('<svg') || text.startsWith('<?xml') || text.includes('<svg')) return true;

  return false;
}

// Download candidate image
async function tryDownloadImage(url, filePath) {
  try {
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 7000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/png,image/jpeg,image/svg+xml,image/*;q=0.9,*/*;q=0.5'
      }
    });

    if (response.status === 200 && isValidImageBuffer(response.data)) {
      fs.writeFileSync(filePath, response.data);
      return response.data.length;
    }
  } catch (err) {
    // try next
  }
  return 0;
}

export async function downloadLogos() {
  console.log('Starting automated brand logo download...\n');
  console.log(`Output Directory: ${outputDir}\n`);

  let successCount = 0;
  let fallbackCount = 0;

  for (const brand of wholesaleBrands) {
    const domain = getBrandDomain(brand.name);
    const fileSlug = brand.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const filePath = path.join(outputDir, `${fileSlug}.png`);

    // Check if existing file is already a valid image
    if (fs.existsSync(filePath)) {
      const existing = fs.readFileSync(filePath);
      if (isValidImageBuffer(existing)) {
        console.log(`[ALREADY PRESENT] ${brand.name} -> ${fileSlug}.png (${existing.length} bytes)`);
        successCount++;
        continue;
      } else {
        fs.unlinkSync(filePath);
      }
    }

    const candidateUrls = [
      `https://icon.horse/icon/${domain}`,
      `https://www.google.com/s2/favicons?domain=${domain}&sz=128`,
      `https://icons.duckduckgo.com/ip3/${domain}.ico`
    ];

    let downloadedSize = 0;

    for (const url of candidateUrls) {
      downloadedSize = await tryDownloadImage(url, filePath);
      if (downloadedSize > 0) {
        console.log(`[DOWNLOADED] ${brand.name} (${domain}) -> ${fileSlug}.png (${downloadedSize} bytes)`);
        successCount++;
        break;
      }
    }

    if (downloadedSize === 0) {
      console.log(`[STANDBY] ${brand.name} (${domain}) -> Will render styled official avatar medallion`);
      fallbackCount++;
    }

    // Small delay to be polite to CDNs
    await new Promise((resolve) => setTimeout(resolve, 80));
  }

  console.log(`\n========================================`);
  console.log(`Brand logo download process completed!`);
  console.log(`Images saved: ${successCount}`);
  console.log(`Avatar medallion fallbacks: ${fallbackCount}`);
  console.log(`========================================\n`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  downloadLogos();
}
