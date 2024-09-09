// DOM elements
const searchBox = document.getElementById("searchBox");
const displayCity = document.getElementById("city");
const displayCountry = document.getElementById("country");
const displayTemp = document.getElementById("display-temp");
const weekCard = document.getElementById("week-card");
const sunriseTime = document.getElementById("sunrise-time");
const sunsetTime = document.getElementById("sunset-time");
const airQuality = document.getElementById("air-quality");
const airQualityImg = document.getElementById("air-quality-image");
const api_key = "6f2b3f778ac24034af373652240909";

// Get current date
const currentDate = new Date();

// Function to update the calendar
function updateCalendar() {
  const calendarBody = document.querySelector(".table");
  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  );
  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  );

  let calendarHTML = `
    <thead>
      <tr><th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th></tr>
    </thead>
    <tbody>`;

  let day = 1;
  for (let i = 0; i < 6; i++) {
    calendarHTML += "<tr>";
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < firstDay.getDay()) {
        calendarHTML += "<td></td>";
      } else if (day > lastDay.getDate()) {
        calendarHTML += "<td></td>";
      } else {
        calendarHTML += `<td${
          day === currentDate.getDate() ? ' class="today-date"' : ""
        }>${day}</td>`;
        day++;
      }
    }
    calendarHTML += "</tr>";
    if (day > lastDay.getDate()) break;
  }

  calendarHTML += "</tbody>";
  calendarBody.innerHTML = calendarHTML;
}

// Function to set the display date
function setDisplayDate() {
  const displayDate = document.getElementById("display-date");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const month = months[currentDate.getMonth()];
  const year = currentDate.getFullYear();
  const date = currentDate.getDate();
  const day = days[currentDate.getDay()];

  displayDate.innerHTML = `${day} ${date}, ${month} ${year}`;
}

// Update calendar and date on page load
updateCalendar();
setDisplayDate();

// Event listener for search box
searchBox.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    getWeatherData(searchBox.value);
  }
});

// Function to update weather forecast
function showData(type) {
  if (type === "day") {
    getWeatherData(searchBox.value, "week");
  } else {
    getWeatherData(searchBox.value, "week");
  }
}

// Function to get public IP address and weather data for location
function getPublicIp() {
  fetch("https://ipapi.co/json/", {
    method: "GET",
    headers: {},
  })
    .then((response) => response.json())
    .then((data) => {
      getWeatherData(data.country_name);
    })
    .catch((err) => {
      console.error(err);
    });
}

getPublicIp();

// Function to get weather data
function getWeatherData(city) {
  fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${api_key}&q=${city}&days=7`
  )
    .then((response) => response.json())
    .then((result) => {
      if (result.location && result.current) {
        displayCity.innerHTML = result.location.name;
        displayCountry.innerHTML = result.location.country;
        displayTemp.innerHTML = `${result.current.temp_c}°C`;
        updateAirQuality(result.location.name);

        if (result.forecast && result.forecast.forecastday) {
          updateWeatherForecast(result.forecast.forecastday, "week");
        } else {
          console.error("Forecast data not available.");
        }
      } else {
        console.error("Location or Current weather data is missing.");
      }
    })
    .catch((error) => {
      console.error(error);
      alert("City Not Found");
    });
}

// Function to update weather forecast
function updateWeatherForecast(data, type) {
  sunriseTime.innerHTML = data[0].astro.sunrise.replace(" AM", "");
  sunsetTime.innerHTML = data[0].astro.sunset.replace(" PM", "");

  weekCard.innerHTML = "";
  let numCards = type === "day" ? 24 : 7;

  for (let i = 0; i < numCards; i++) {
    let dayName = getDayName(data[i].date);
    let dayTemp = Math.round(data[i].day.avgtemp_c);
    let weatherCondition = getCondition(data[i].day.condition.code);
    let iconSrc = data[i].day.condition.icon;
    let windSpeed = Math.round(data[i].day.maxwind_kph);
    let humidity = Math.round(data[i].day.avghumidity);

    weekCard.innerHTML += `
      <div class="col-auto col-md-3">
                <div class="week-card">
                  <div class="row d-flex justify-content-between">
                    <div class="col-6">
                      <h4 class="fw-bold">${dayName}</h4>
                      <p class="fw-bold opacity-75">${weatherCondition}</p>
                    </div>
                    <div class="col-6">
                      <img
                        src="${iconSrc}"
                        alt="cloudy"
                        class="card-img"
                      />
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-5">
                      <div class="row">
                        <div class="col-6">
                          <img
                            src="assets/icons/wind-speed.svg"
                            alt="Wind Speed"
                            class="windspeed-img"
                          />
                          <img
                            src="assets/icons/humidity.svg"
                            alt="Humidity"
                            class="humidity-img mt-2"
                          />
                        </div>
                        <div class="col-6">
                          <p class="wind-speed">${windSpeed}kmh</p>
                          <p class="mb-2 humidity">${humidity}%</p>
                        </div>
                      </div>
                    </div>
                    <div class="col-1 align-content-end align-items-end">
                      <h3 class="card-temp">${dayTemp}</h3>
                    </div>
                  </div>
                </div>
              </div>

    `;
  }
}

// Function to get weather condition based on code
function getCondition(conditionCode) {
  const weatherConditions = [
    { code: 1000, text: "Sunny" },
    { code: 1003, text: "Cloudy" },
    { code: 1006, text: "Cloudy" },
    { code: 1009, text: "Overcast" },
    { code: 1030, text: "Mist" },
    { code: 1063, text: "Cloudy" },
    { code: 1066, text: "Snowy" },
    { code: 1069, text: "Sleet" },
    { code: 1072, text: "Freeze" },
    { code: 1087, text: "Thundery" },
    { code: 1114, text: "Snowy" },
    { code: 1117, text: "Blizzard" },
    { code: 1135, text: "Fog" },
    { code: 1147, text: "Freezing" },
    { code: 1150, text: "Drizzle" },
    { code: 1153, text: "Drizzle" },
    { code: 1168, text: "Freezing" },
    { code: 1171, text: "Freeze" },
    { code: 1180, text: "Light Rainy" },
    { code: 1183, text: "Rainy" },
    { code: 1186, text: "Rainy" },
    { code: 1189, text: "Rainy" },
    { code: 1192, text: "Rainy" },
    { code: 1195, text: "Rainy" },
    { code: 1198, text: "Freezing" },
    { code: 1201, text: "Freezing" },
    { code: 1204, text: "Sleet" },
    { code: 1207, text: "Sleet" },
    { code: 1210, text: "Snowy" },
    { code: 1213, text: "Snowy" },
    { code: 1216, text: "Snowy" },
    { code: 1219, text: "Snowy" },
    { code: 1222, text: "Snowy" },
    { code: 1225, text: "Snowy" },
    { code: 1237, text: "IcePellets" },
    { code: 1240, text: "Rainy" },
    { code: 1243, text: "Rainy" },
    { code: 1246, text: "Rainy" },
    { code: 1249, text: "Snowy" },
    { code: 1252, text: "Sleet" },
    { code: 1255, text: "Snowy" },
    { code: 1258, text: "Snowy" },
    { code: 1261, text: "IcePallet" },
    { code: 1264, text: "Snowy" },
    { code: 1273, text: "Thundery" },
    { code: 1276, text: "Thundery" },
    { code: 1279, text: "Thundery" },
    { code: 1282, text: "Thundery" },
  ];

  for (let i = 0; i < weatherConditions.length; i++) {
    if (weatherConditions[i].code === conditionCode) {
      return weatherConditions[i].text;
    }
  }
  return "Unknown";
}

// Function to get the day name from a date string
function getDayName(dateStr) {
  const date = new Date(dateStr);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
}

//Update Air Quality
function updateAirQuality(location) {
  const requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  fetch(
    `https://api.weatherapi.com/v1//current.json?key=${api_key}&q=${location}&aqi=yes`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => {
      let status =
        parseFloat(result.current.air_quality.o3) >= 40.0 ? `Good` : `Bad`;

      airQuality.style.color = status === "Good" ? "#0AC249" : "red";
      //airQualityImg.style.color = status === "Good" ? "red" : "red";

      airQuality.innerHTML = status;
    })
    .catch((error) => console.error(error));
}
