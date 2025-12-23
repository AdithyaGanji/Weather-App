const APIKey = 'd1b6d7f4affe43ce857105355252212';
// `http://api.weatherapi.com/v1/current.json?key=${APIKey}&q=${locationName}`

const searchContainer = document.querySelector('.location-search-container');
const inputElement = document.querySelector('.location-input');
const searchIconElement = document.querySelector('.search-icon-container');

document.body.addEventListener('keyup', (event) => {
  if (event.key === 'Enter' && inputElement.value.length > 0)
    searchIconElement.click();
})

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

searchIconElement
  .addEventListener('click', () => {
    displayWeatherInfo();
  }
  );

async function displayWeatherInfo() {
  const locationEntered = inputElement.value;

  const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=${APIKey}&q=${locationEntered}`);
  const data = await response.json();

  document
    .querySelector('.weather-info-container')
    .innerHTML = `<h1>${data.current.temp_c}</h1>`;
}
