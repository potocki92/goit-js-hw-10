/*
    This is a function that takes a country name as input and returns a promise that resolves with the data of countries matching the input name. 
    The function constructs a URL using the input name and sends a GET request to the restcountries API. If the request is successful, the function returns a JSON object with the data of the matching countries. 
    If the request fails, the function throws an error with the HTTP status code or a custom error message. The function is exported for use in other modules.
*/
const fetchCountries = (name) => {
  const url = `https://restcountries.com/v3/name/${name}?fields=name,capital,population,flags,languages`;
  return fetch(url).then(response => {
    if (!response.ok) {
      return Promise.reject(new Error(response.status))
    }
    return response.json()
  }).catch(error => {
    console.error(error);
    return Promise.reject(new Error('An error occurred while fetching the data.'))
  })
}

export { fetchCountries }