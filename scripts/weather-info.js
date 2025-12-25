import dayjs from 'https://unpkg.com/dayjs@1.11.19/esm/index.js';

import { weatherCategoryCodes, hourMappings } from './mappings.js';

const APIKey = 'd1b6d7f4affe43ce857105355252212';
const inputElement = document.querySelector('.location-input');
const searchIconElement = document.querySelector('.search-icon-container');

// Set focus on the location input as soon as the page loads
inputElement.focus();

setInterval(() => {
  if (inputElement.value.length > 0) {
    searchIconElement.style.left = '0';
    searchIconElement.style.opacity = '1';
  }
  else {
    searchIconElement.style.left = '4.75rem';
    searchIconElement.style.opacity = '0';
  }
}, 1);

(function addEventListeners() {
  document
    .body
    .addEventListener('keyup', (event) => {
      if (event.key === 'Enter' && inputElement.value.length > 0)
        searchIconElement.click();
      });

  searchIconElement
    .addEventListener('click', () => {
      displayWeatherInfo() 
    });
})();

(function setInitialConfiguration() {
  document
  .querySelector('.location-input')
  .value = 'London';

  document
    .querySelector('.search-icon-container')
    .click();
})();

async function displayWeatherInfo() {
  const locationEntered = inputElement.value;

  try {
    const response = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=${APIKey}&q=${locationEntered}&days=2`);
    const data = await response.json();
    
    // If the user enters a typo,
    // replace it with the closest matching name from the API
    inputElement.value = data.location.name;

    const tempInCelcius = data.current.temp_c;
    const weatherCondition = data.current.condition.text;
    const weatherConditionCode = data.current.condition.code;

    const weatherCategory = weatherCategoryCodes.get(weatherConditionCode);

    document
      .querySelector('.error-info-container')
      .style.display = 'none';

    document
      .querySelector('.weather-info-container')
      .style.display = 'flex';

    document
      .querySelector('.hourly-weather-info-container')
      .style.display = 'flex';

    document
      .querySelector('.weather-info-container')
      .innerHTML = `
        <img class="weather-category-icon" src="images/weather-category-icons/${weatherCategory}.svg">
        <div class="temperature-container">
          <div class="temperature">${tempInCelcius}</div>
          <div class="degree-celcius">°C</div>
        </div>
        <div class="weather-condition">${weatherCondition}</div>
      `;

    document
      .querySelector('.weather-info-container')
      .style.borderBottom = '1px solid var(--bg-secondary)';

    displayHourlyWeatherInfo(data);
  } catch (error) {
    document
      .querySelector('.weather-info-container')
      .style.display = 'none';

    document
      .querySelector('.hourly-weather-info-container')
      .style.display = 'none';

    document
      .querySelector('.error-info-container')
      .style.display = 'flex';

    document
      .querySelector('.error-info-container')
      .innerHTML = `
        <img class="no-result-icon" src="images/no-result-icon.svg">
        <div class="error-header">Something went wrong!</div>
        <div class="error-message">We're unable to retrieve the weather details. Ensure you've entered a valid city or try again later.</div>
      `;
  }
}

function displayHourlyWeatherInfo(data) {
  let now = dayjs(data.location.localtime);
  let todayDate = now.get('D');

  let index = 0;
  let day = 'Today';
  
  let html = '';
  for (let i = 0; i <= 24; i++) {
    const [curHour, curHourDate] = [now.$H, now.$D];

    if (curHourDate !== todayDate) {
      index = 1
      day = 'Tom'
    }

    const curHourTemp = data.forecast.forecastday[index].hour[curHour].temp_c;
    const curHourWeatherConditionCode = data.forecast.forecastday[index].hour[curHour].condition.code;
    const curHourweatherCategory = weatherCategoryCodes.get(curHourWeatherConditionCode);

    // console.log(curHour, curHourDate, data.forecast.forecastday[index].hour[curHour].temp_c);
    // console.log(curHour, curHourDate, data.forecast.forecastday[index]);

    html += `
      <div class="this-hour-weather-info">
        <div class="day-and-hour">${day} <span class="hour">${hourMappings.get(curHour)}</span></div>
        <img class="hour-weather-category-icon" src="images/weather-category-icons/${curHourweatherCategory}.svg">
        <div class="temp-at-this-hour-container">
          <div class="temp-at-this-hour">${curHourTemp}</div>
          <div class="degree-symbol-sm">°</div>
        </div>
      </div>
    `;

    now = now.add(1, 'h');
  }

  document
    .querySelector('.hourly-weather-info-container')
    .innerHTML = html;
}
