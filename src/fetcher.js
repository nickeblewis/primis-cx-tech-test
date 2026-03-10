import 'dotenv/config';

async function fetchCountriesByRegion(region = 'europe') {
  const url = `${process.env.BASE_URL}/region/${region}`;

  let response;
  try {
    response = await fetch(url);
  } catch (err) {
    throw new Error(`Network error fetching region "${region}": ${err.message}`);
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText} fetching region "${region}"`);
  }

  return response.json();
}

export { fetchCountriesByRegion };
