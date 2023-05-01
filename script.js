
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function injectHTML(list) {
  console.log('fired injectHTML')
  const target = document.querySelector('#markets_list');
  target.innerHTML = '';
  list.forEach((item) => {
    const str = `<li>${item.market_name}</li>`;
    target.innerHTML += str
  })
}


/*
function haversine_distance(mk1, mk2) {
  var R = 3958.8; // Radius of the Earth in miles
  var rlat1 = mk1.position.lat() * (Math.PI/180); // Convert degrees to radians
  var rlat2 = mk2.position.lat() * (Math.PI/180); // Convert degrees to radians
  var difflat = rlat2-rlat1; // Radian difference (latitudes)
  var difflon = (mk2.position.lng()-mk1.position.lng()) * (Math.PI/180); // Radian difference (longitudes)

  var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
  return d;
}
*/




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

function calculateDistance(marketList) {
  let marketdistance = [];
  
  marketList.forEach(market => {
    const marketLatLng = new google.maps.LatLng(market.location.latitude, market.location.longitude);
    marketdistance = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, marketLatLng);

    console.log(marketdistance);
  });
/*
  // 4. Sort list of farmers markets by distance
  marketList.sort((a, b) => a.distance - b.distance);
*/
  // 5. Display sorted list of farmers markets
  const target = document.querySelector('#markets_list');
  target.innerHTML = '';
  marketList.forEach((item) => {
    const str = `<li>${item.market_name} (${item.marketdistance} miles)</li>`;
    target.innerHTML += str;
  });
};



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