const dotenv = require('dotenv');
const fs = require('fs');

const { CONTEXT_FILE } = require('../utils/constants');

if (fs.existsSync(CONTEXT_FILE)) {
  dotenv.config({ path: CONTEXT_FILE, quiet: true });
} else {
  console.error(
    `ERROR: Env file not found at ${CONTEXT_FILE}. Run "npm run monitoring:seed" first.`,
  );
  process.exit(1);
}
