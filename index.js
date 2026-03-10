#!/usr/bin/env node

/**
 * CLI Tool - fetch country data by region
 * Usage: node index.js [region]
 * Example: node index.js europe
 */

const path = require('path');

// -- Config
const BASE_URL = 'https://restcountries.com/v3.1';
const OUTPUT_DIR = path.resolve(__dirname, 'output');

// -- Modules
const { fetchCountriesByRegion } = require('./src/fetcher');
const { processCountries }        = require('./src/processor');
const { generateHtml }            = require('./src/htmlgenerator');
const { generateCsv }             = require('./src/csvGenerator');

// ─── HTTP helpers ─────────────────────────────────────────────────────────────

const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const url = `${BASE_URL}${path}`;

  const options = {
    method,
    headers: { ...DEFAULT_HEADERS, ...headers },
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const res = await fetch(url, options);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status} ${res.statusText}: ${text}`);
  }

  const contentType = res.headers.get('content-type') ?? '';
  return contentType.includes('application/json') ? res.json() : res.text();
}

const api = {
  get:    (path, opts)       => request(path, { ...opts, method: 'GET' }),
  post:   (path, body, opts) => request(path, { ...opts, method: 'POST', body }),
  put:    (path, body, opts) => request(path, { ...opts, method: 'PUT', body }),
  patch:  (path, body, opts) => request(path, { ...opts, method: 'PATCH', body }),
  delete: (path, opts)       => request(path, { ...opts, method: 'DELETE' }),
};

// ─── Entry point ──────────────────────────────────────────────────────────────

async function main() {
  const region = process.argv[2] || 'europe';

  const raw        = await fetchCountriesByRegion(region);
  const countries  = processCountries(raw);
  await generateHtml(countries, OUTPUT_DIR);
  await generateCsv(countries, OUTPUT_DIR);

  console.log(`Fetched ${countries.length} countries. Files written to ${OUTPUT_DIR}`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
