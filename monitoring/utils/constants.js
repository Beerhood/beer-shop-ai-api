const path = require('path');
const fs = require('fs');

const MON_ROOT = path.join(process.cwd(), 'monitoring');
const TEMP_DIR = path.join(MON_ROOT, 'temp');
const CONTEXT_FILE = path.join(TEMP_DIR, '.env.temp');
const REPORTS_DIR = path.join(MON_ROOT, 'reports');

if (!fs.existsSync(TEMP_DIR)) fs.mkdirSync(TEMP_DIR, { recursive: true });
if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

module.exports = {
  MON_ROOT,
  TEMP_DIR,
  CONTEXT_FILE,
  REPORTS_DIR,
};
