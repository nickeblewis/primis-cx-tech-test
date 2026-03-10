import fs   from 'fs/promises';
import path from 'path';

function escapeField(value) {
  const str = value == null ? '' : String(value);
  return str.includes(',') || str.includes('"') || str.includes('\n')
    ? `"${str.replace(/"/g, '""')}"`
    : str;
}

function buildCsv(countries) {
  const headers = ['Country', 'Capital', 'Population', 'Languages', 'Currency'];
  const rows = countries.map(c => [
    c.name,
    c.capital,
    c.population,
    c.languages,
    c.currency,
  ].map(escapeField).join(','));

  return [headers.join(','), ...rows].join('\n');
}

async function generateCsv(countries, outputDir) {
  await fs.mkdir(outputDir, { recursive: true });
  const csv = buildCsv(countries);
  const outPath = path.join(outputDir, 'countries.csv');
  await fs.writeFile(outPath, csv, 'utf8');
  console.log(`CSV report written to ${outPath}`);
}

export { generateCsv };
