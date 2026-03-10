import fs   from 'fs/promises';
import path from 'path';

function buildHtml(countries) {
  const timestamp = new Date().toLocaleString('en-GB', {
    dateStyle: 'long',
    timeStyle: 'short',
  });

  const rows = countries.map((c, i) => {
    const rowClass = i % 2 === 0 ? 'row-even' : 'row-odd';
    return `
      <tr class="${rowClass}">
        <td>${c.flag}</td>
        <td>${c.name}</td>
        <td>${c.capital}</td>
        <td>${c.population}</td>
        <td>${c.languages}</td>
        <td>${c.currency}</td>
      </tr>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Country Report</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: system-ui, sans-serif;
      font-size: 14px;
      color: #1a1a1a;
      background: #f5f5f5;
      padding: 2rem;
    }

    h1 {
      font-size: 1.6rem;
      margin-bottom: 0.25rem;
    }

    .meta {
      font-size: 0.85rem;
      color: #555;
      margin-bottom: 1.5rem;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      background: #fff;
      border-radius: 6px;
      overflow: hidden;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1);
    }

    thead tr {
      background: #2c3e50;
      color: #fff;
      text-align: left;
    }

    th, td {
      padding: 10px 14px;
      vertical-align: middle;
    }

    th { font-weight: 600; }

    tr.row-even { background: #fff; }
    tr.row-odd  { background: #f0f4f8; }

    tbody tr:hover { background: #dce9f5; }

    td:nth-child(4) { text-align: right; font-variant-numeric: tabular-nums; }

    img { display: block; }
  </style>
</head>
<body>
  <h1>Country Report</h1>
  <p class="meta">Generated on ${timestamp} &mdash; ${countries.length} countries</p>

  <table>
    <thead>
      <tr>
        <th>Flag</th>
        <th>Country</th>
        <th>Capital</th>
        <th>Population</th>
        <th>Languages</th>
        <th>Currency</th>
      </tr>
    </thead>
    <tbody>${rows}
    </tbody>
  </table>
</body>
</html>`;
}

async function generateHtml(countries, outputDir) {
  await fs.mkdir(outputDir, { recursive: true });
  const html = buildHtml(countries);
  const outPath = path.join(outputDir, 'countries.html');
  await fs.writeFile(outPath, html, 'utf8');
  console.log(`HTML report written to ${outPath}`);
}

export { generateHtml };
