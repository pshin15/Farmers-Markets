
let userloc;

// finds the users current coordinates
async function getCurrentLocation(marketList) {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        userloc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        console.log(`${userloc}`);
        resolve(userloc);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
      reject("Geolocation not supported");
    }
  });
}



// callback to get permission from the user to get their location, https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API/Using_the_Permissions_API#accessing_the_permissions_api
var geoBtn = document.querySelector('.enable');

function handlePermission() {
  navigator.permissions.query({ name: "geolocation" }).then((result) => {
    if (result.state === "granted") {
      report(result.state);
      geoBtn.style.display = "none";
    } else if (result.state === "prompt") {
      report(result.state);
      geoBtn.style.display = "none";
      navigator.geolocation.getCurrentPosition(
        revealPosition,
        positionDenied,
        geoSettings
      );
    } else if (result.state === "denied") {
      report(result.state);
      geoBtn.style.display = "inline";
    }
    result.addEventListener("change", () => {
      report(result.state);
    });
  });
}

function report(state) {
  console.log(`Permission ${state}`);
}

handlePermission();



let userLatLng;

// calculates the distance between user coordinates and market coordinates
async function calculateDistance(marketList) {
  const userLocation = await getCurrentLocation();
  console.log("CurrentPos", `${userloc}`);
  console.log("MarketList", marketList);

  marketList = marketList.map(market => {
    const latitude = parseFloat(market.location.latitude);
    const longitude = parseFloat(market.location.longitude);
    const marketLatLng = new google.maps.LatLng(latitude, longitude);
    const distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(userLocation, marketLatLng);
    const distanceMiles = distanceMeters / 1609.344;
    console.log("distance", distanceMiles)

    return { ...market, distance: (distanceMiles).toFixed(2) };
  });

  console.log("Updated Market List", marketList);

  injectHTML(marketList);
}


// adds list of market names and their distances to the page
function injectHTML(marketList) {
  console.log('fired injectHTML')
  const target = document.querySelector('#markets_list');
  target.innerHTML = "";
  marketList.forEach((item) => {
    const str = `<li>${item.market_name} (${item.distance} miles)</li>`;
    target.innerHTML += str
  })
}



function initMap() {
  var map = L.map('map').setView([38.99, -76.94], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 25,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  return map;
}

/*
function markerPlace(marketList, map) {
  marketList.forEach((item) => {
    const marketLatLng = {latitude: item.location.latitude, longitude: item.location.longitude};
    L.marker(marketLatLng).addTo(map);

    //marker.bindPopup(`<h3>${item.market_name}</h3><p>${item.location_address}</p>`);
  });
}
    //const {latitude, longitude} = item.location;
    //L.marker([38.78, -77.01]).addTo(map);
*/



async function findMarket() {
  const allMarkets = document.querySelector('.markets');

  let marketList = [];

  allMarkets.addEventListener('submit', async (Submit) => {
    Submit.preventDefault();
    console.log('submitted form');

    // 1. asynch data request
    const response = await fetch(
      'https://data.princegeorgescountymd.gov/resource/sphi-rwax.json');
    marketList = await response.json();
    console.log("CurrentMarker", marketList);

    await calculateDistance(marketList);
    //injectHTML(marketList);
    getCurrentLocation();
  });
}

const map = initMap();



document.addEventListener('DOMContentLoaded', async () => findMarket());