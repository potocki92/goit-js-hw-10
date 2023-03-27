import './css/styles.css';
/*
    The fetchCountries function is imported from a separate file named fetchCountries.js. 
    This function retrieves data from an external API based on the search term and returns it as a Promise.
*/
import { fetchCountries } from './fetchCountries.js';
var debounce = require('lodash.debounce');
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const searchInput = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

/*
  This code adds an event listener to the 'countryList' element. 
  When an item in the list is clicked, the code retrieves the 'id' of the clicked list item and passes it as a parameter to the 'fetchCountries' function. 
  The returned data from 'fetchCountries' is then passed to the 'renderList' function to display the list of countries. 
  If an error occurs during the process, the Notiflix library is used to display a failure notification.
*/
countryList.addEventListener('click', event => {
  const clickedElement = event.target;
  const listItem = clickedElement.closest('li');
  if (listItem) {
    const selectedCountry = listItem.id;
    fetchCountries(selectedCountry)
      .then(data => {
        renderList(data);
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, something went wrong.');
      });
  }
});
/*
The handleSearch function is passed to the debounce function with a delay set to the value of DEBOUNCE_DELAY. 
Inside this function, we retrieve the value of the search input field, check if it's not empty, and then call the fetchCountries function with the retrieved search term. 
The handleSearch function is assigned to the keyup event of the searchInput element.
*/

const handleSearch = debounce(() => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    fetchCountries(searchTerm)
      .then(data => {
        renderList(data);
        if (data.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (data.length >= 2 && data.length <= 10) {
          Notiflix.Notify.success(`${data.length} countries found.`);
        } else if (data.length === 1) {
          Notiflix.Notify.success('One country found.');
        } else {
          Notiflix.Notify.failure('Oops, there is no country with that name.');
        }
      })
      .catch(error => {
        Notiflix.Notify.failure('Oops, there is no country with that name.');
      });
  } else {
    countryList.innerHTML = '';
  }
}, DEBOUNCE_DELAY);

/* 
    The generateStyleString function generates a string of CSS styles based on a provided key, 
    which is used to style the HTML elements in the renderList function. 
*/
const generateStyleString = styleKey => {
  const styles = {
    ul: {
      display: 'flex',
      'flex-direction': 'column',
      gap: '10px',
      padding: 0,
    },
    li: {
      'list-style': 'none',
      display: 'inline-flex',
      gap: '10px',
      cursor: 'pointer',
    },
    img: {
      width: '35px',
    },
    p: {
      margin: 0,
    },
    h4: {
      'font-size': '30px',
      'font-weight': 'bold',
      margin: 0,
    },
    span: {
      'font-weight': 'bold',
    },
  };
  const selectedStyles = styles[styleKey];
  return Object.entries(selectedStyles)
    .map(([property, value]) => `${property}:${value}`)
    .join(';');
};

/*
    The renderList function generates HTML markup based on the data returned from the fetchCountries function.
    It displays a list of countries and their flags, which match the search term entered by the user. 
    If there is only one country that matches the search term, it displays more detailed information about that country, 
    such as its name, capital, population, and languages.

    The function generates HTML markup using the map function, which creates an HTML list item for each country object in the data array. 
    It then injects the generated HTML markup into the DOM using innerHTML. 
    If the length of the data array is equal to 1, the function displays detailed information about the country using another HTML markup.

    The function also uses a generateStyleString function to generate inline styles for the HTML elements.

    Finally, an event listener is added to the searchInput element, 
    which listens for changes to the input field and invokes the handleSearch function.
*/
const renderList = data => {
  const markup = data
    .map(
      ({ name: { common }, flags }) => `
        <li id="${common}" style="${generateStyleString('li')}">
          <img src="${
            flags[0]
          }" alt="${common} flag" style="${generateStyleString('img')}">
          <p style="${generateStyleString('p')}">${common}</p>
        </li>
      `
    )
    .join('');

  countryList.innerHTML = markup;
  countryList.style.cssText = generateStyleString('ul');
  countryInfo.innerHTML = '';

  if (data.length === 1) {
    const { name, capital, population, languages, flags } = data[0];
    countryList.innerHTML = '';
    countryInfo.innerHTML = `
        <ul style="${generateStyleString('ul')}">
          <li style="${generateStyleString('li')}">
            <img src="${flags[0]}" alt="${
      name.common
    } flag" style="${generateStyleString('img')}">
            <h4 style="${generateStyleString('h4')}">${name.common}</h4>
          </li>
          <li style="${generateStyleString('li')}">
            <span style="${generateStyleString('span')}">Capital:</span>
            <p style="${generateStyleString('p')}">${capital[0] || '-'}</p>
          </li>
          <li style="${generateStyleString('li')}">
            <span style="${generateStyleString('span')}">Population:</span>
            <p style="${generateStyleString('p')}">${population}</p>
          </li>
          <li style="${generateStyleString('li')}">
            <span style="${generateStyleString('span')}">Languages:</span>
            <p style="${generateStyleString('p')}">${Object.values(
      languages
    ).join(', ')}</p>
</li>
</ul>`;
  }
};

/*
    event listener is added to the searchInput element, which listens for changes to the input field and invokes the handleSearch function with a delay using the debounce function.
*/
searchInput.addEventListener('input', handleSearch);
