#!/usr/bin/env node

/**
 * CLI Tool - fetch country data by region
 * Usage: node index.js [region]
 * Example: node index.js europe
 */

import path from 'path';
import { fileURLToPath } from 'url';

// -- Config
const BASE_URL = 'https://restcountries.com/v3.1';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.resolve(__dirname, 'output');

// -- Modules
import { fetchCountriesByRegion } from './src/fetcher.js';
import { processCountries }        from './src/processor.js';
import { generateHtml }            from './src/htmlGenerator.js';
import { generateCsv }             from './src/csvGenerator.js';

async function main() {
  const region = process.argv[2] || 'europe';

  const raw        = await fetchCountriesByRegion(region); // Pass through the region to the fetcher
  const countries  = processCountries(raw);
  await generateHtml(countries, OUTPUT_DIR);
  await generateCsv(countries, OUTPUT_DIR);

  // Report to the user how many countries we fetched and where the files are
  console.log(`Fetched ${countries.length} countries. Files written to ${OUTPUT_DIR}`);
}

main().catch(err => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
