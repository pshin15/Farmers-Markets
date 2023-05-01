
// finds the users current coordinates  
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      console.log(`${userLatLng}`);
    });
  } else { 
    console.log("Geolocation is not supported by this browser.");
  }
}



let userLatLng;



// calculates the distance between user coordinates and market coordinates
function calculateDistance(list) {
  let marketdistance = [];
  // loops through each market
  list.forEach(market => {
    const marketLatLng = {latitude: market.location.latitude, longitude: market.location.longitude};

    //const marketdistance = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, marketLatLng);
    //const marketdistancemiles = marketdistance/1609.344

    //marketdistances.push({ market_name: market.market_name, distance: marketdistancemiles });
    console.log(marketLatLng);

  });

};


// adds list of market names and their distances to the page
function injectHTML(marketList) {
  console.log('fired injectHTML')
  const target = document.querySelector('#markets_list');
  target.innerHTML = "";
  /*
  if (Array.isArray(list)) {
    list.forEach((item) => {
      const str = `<li>${item.market_name} (${item.marketdistancemiles} miles away)</li>`;
      target.innerHTML += str;
    });
  } else {
    const str = `<li>Distance: ${data} miles</li>`;
    target.innerHTML = str;
  }
  */
  marketList.forEach((item) => {
    const str = `<li>${item.market_name} (${item.marketdistancemiles} miles)</li>`;
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
function markerPlace(array, map) {
  //console.log('array for markers', array);
  array.forEach((item) => {
    const {latitude, longitude} = item.location;
    //L.marker([38.78, -77.01]).addTo(map);
    L.marker([latitude, longitude]).addTo(map);

    //marker.bindPopup(`<h3>${item.market_name}</h3><p>${item.location_address}</p>`);
  });
}
*/



async function findMarket() {
  const allMarkets = document.querySelector('.markets'); 
  //const filter = document.querySelector('.filter_button');

  let marketList = [];

  allMarkets.addEventListener('submit', async (Submit) => {
    Submit.preventDefault();
    console.log('submitted form'); 

  // 1. asynch data request
    const response = await fetch(
      'https://data.princegeorgescountymd.gov/resource/sphi-rwax.json'); 
    marketList = await response.json();  //object from json data
    console.log(marketList);    
    injectHTML(marketList);

    getCurrentLocation();

    calculateDistance(marketList, userLatLng);
  });

  //filter.addEventListener()
  
}

const map = initMap();

//markerPlace(marketList, map);


document.addEventListener('DOMContentLoaded', async () => findMarket());