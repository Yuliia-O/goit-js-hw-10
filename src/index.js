import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const listEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');
const searchBox = document.querySelector('#search-box');

searchBox.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

function inputHandler() {
    const searchValue = searchBox.value.trim();

    if (!searchValue) {
        clearMarkup();
        return;
    }

    fetchCountries(searchValue)
        .then(country => {
            if (country.length > 9) {
                clearMarkup();
                Notify.info(
                    'Too many matches found. Please enter a more specific name.'
                );
            } else if (country.length === 1) {
                listEl.innerHTML = '';
                renderCountryCard(country);
            } else {
                countryInfoEl.innerHTML = '';
                renderCountriesList(country);
            }
        })
        .catch(e => {
            console.log(e);
            Notify.failure('Oops, there is no country with that name');
        });
}

function renderCountriesList(countries) {
    const countriesListMarkup = countries
        .map(
            country =>
                `<li class="country-name"><img src="${country.flags.svg}" alt="${country.flags.alt}"> ${country.name.official}</li>`
        )
        .join('');
    listEl.innerHTML = countriesListMarkup;
}

function renderCountryCard(countries) {
    const countryCaedMarkup = countries.map(
        el =>
            `<h2><img src="${el.flags.svg}" alt="${el.flags.alt}"> ${
                el.name.official
            }</h2><p><span>Capital:</span> ${
                el.capital
            }</p><p><span>Population:</span> ${
                el.population
            }</p><p><span>Languages:</span> ${Object.values(el.languages).join(
                ', '
            )}</p>`
    );
    countryInfoEl.innerHTML = countryCaedMarkup;
}

function clearMarkup() {
    countryInfoEl.innerHTML = '';
    listEl.innerHTML = '';
}
