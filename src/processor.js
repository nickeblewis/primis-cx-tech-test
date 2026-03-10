function processCountries(raw) {
// AI (claude code) was used to write this function, which takes the raw API response and transforms it into a more usable format for our HTML and CSV generators.
// It also handles missing or malformed data gracefully by providing 'N/A' defaults where appropriate.
  if (!Array.isArray(raw)) return [];

  return raw
    .map(country => {
      const name = country?.name?.common ?? 'N/A';

      const capitalArr = country?.capital;
      const capital = Array.isArray(capitalArr) && capitalArr.length > 0
        ? capitalArr[0]
        : 'N/A';

      const pop = country?.population;
      const population = typeof pop === 'number'
        ? pop.toLocaleString('en-GB')
        : 'N/A';

      const langs = country?.languages;
      const languages = langs && typeof langs === 'object' && Object.keys(langs).length > 0
        ? Object.values(langs).join(', ')
        : 'N/A';

      const currencyObj = country?.currencies;
      let currency = 'N/A';
      if (currencyObj && typeof currencyObj === 'object') {
        const firstKey = Object.keys(currencyObj)[0];
        if (firstKey) {
          const c = currencyObj[firstKey];
          const cName   = c?.name   ?? null;
          const cSymbol = c?.symbol ?? null;
          if (cName && cSymbol) currency = `${cName} (${cSymbol})`;
          else if (cName)       currency = cName;
          else if (cSymbol)     currency = cSymbol;
        }
      }

      const flagUrl = country?.flags?.png ?? null;
      const flag = flagUrl
        ? `<img src="${flagUrl}" alt="Flag of ${name}" width="32">`
        : 'N/A';

      return { name, capital, population, languages, currency, flag };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

export { processCountries };
