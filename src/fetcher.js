require('dotenv').config();

async function fetchCountriesByRegion(region = 'europe') {
  const url = `${process.env.BASE_URL}/region/${region}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch region "${region}": ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  console.log(data);
  return data;
}

module.exports = { fetchCountriesByRegion };
