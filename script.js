let loc = document.getElementById("location");
let tempicon = document.getElementById("temp-icon");
let tempvalue = document.getElementById("temp-value");
let climate = document.getElementById("climate");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");

searchButton.addEventListener('click', async (e) => {
  e.preventDefault();
  const city = searchInput.value;
  try {
    const weatherData = await getWeather(city);
    updateUI(weatherData);
    searchInput.value = '';
  } catch (error) {
    alert('City not found');
  }
});

const getWeather = async (city) => {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=1cd36414aa09a0d05f7a6293271aebeb`, { mode: 'cors' });
  const weatherData = await response.json();
  return weatherData;
};

const updateUI = (data) => {
  const { name } = data;
  const { feels_like } = data.main;
  const { id, main } = data.weather[0];
  loc.textContent = name;
  climate.textContent = main;
  tempvalue.textContent = Math.round(feels_like - 273);
  tempicon.src = getIconPath(id);
};

const getIconPath = (id) => {
  if (id < 300 && id > 200) {
    return "./icons/thunderstorm.png";
  } else if (id < 400 && id > 300) {
    return "./icons/cloud.png";
  } else if (id < 600 && id > 500) {
    return "./icons/rain.png";
  } else if (id < 700 && id > 600) {
    return "./icons/snow.png";
  } else if (id < 800 && id > 700) {
    return "./icons/clouds.png";
  } else if (id == 800) {
    return "./icons/cloudy.png";
  } else {
    return "./icons/cloud.png";
  }
};

window.addEventListener("load", async () => {
  let long;
  let lat;
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async (position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      const proxy = "https://cors-anywhere.herokuapp.com/";
      const api = `${proxy}api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&appid=1cd36414aa09a0d05f7a6293271aebeb`;
      try {
        const weatherData = await fetch(api, { mode: 'cors' }).then(response => response.json());
        updateUI(weatherData);
      } catch (error) {
        alert('Could not get current location weather data');
      }
    });
  }
});
