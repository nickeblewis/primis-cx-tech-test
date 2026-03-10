#!/usr/bin/env node

/**
 * CLI Tool - fetch country data by region
 * Usage: node index.js [region]
 * Example: node index.js europe
 */

/* AI was used to boilerplate this project, but most core logic was hand-written by me unless where noted. */

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

  // I chose to break the project down into these modules to keep things organized and maintainable, even though it's a small project. The main function just orchestrates the flow:
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
