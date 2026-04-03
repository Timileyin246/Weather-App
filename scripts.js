const API_KEY  = "7a19846875d47cd61b48eabe682a57fe";
const BASE_URL = "https://api.openweathermap.org/data/2.5";

const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const errorMsg  = document.getElementById("errorMsg");
const loader    = document.getElementById("loader");


async function getWeather() {
  const city = cityInput.value.trim();
  if (!city) return;

  reset();
  showLoader(true);

  try {
    const res = await fetch(
      `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || "Something went wrong.");
    }

    const data = await res.json();
    displayWeather(data);

  } catch (err) {
    showError(err.message);
  } finally {
    showLoader(false);
  }
}


function displayWeather(data) {
  const { name, sys, main, weather, wind } = data;

  document.getElementById("cityName").textContent     = `${name}, ${sys.country}`;
  document.getElementById("weatherDesc").textContent  = weather[0].description;
  document.getElementById("weatherIcon").src          = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
  document.getElementById("temperature").textContent  = `${Math.round(main.temp)}°C`;
  document.getElementById("feelsLike").innerHTML    = `Feels Like <br> ${Math.round(main.feels_like)}°`;
  document.getElementById("humidity").innerHTML     = `Humidity <br> ${main.humidity}%`;
  document.getElementById("windspeed").innerHTML    = `Wind Speed <br> ${wind.speed} m/s`;

  document.getElementById("currentWeather").classList.remove("hidden");
}


function showError(msg) {
  errorMsg.textContent = `⚠️ ${msg}`;
  errorMsg.classList.remove("hidden");
}

function showLoader(state) {
  loader.classList.toggle("hidden", !state);
  loader.classList.toggle("flex", state);
}

function reset() {
  errorMsg.classList.add("hidden");
  document.getElementById("currentWeather").classList.add("hidden");
}


searchBtn.addEventListener("click", getWeather);
cityInput.addEventListener("keypress", e => {
  if (e.key === "Enter") getWeather();
});