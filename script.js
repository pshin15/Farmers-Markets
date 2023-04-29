
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



function initMap() {
  var map = L.map('map').setView([38.99, -76.94], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 25,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);

  //var script = document.createElement('script');
  //document.head.appendChild(script);
  
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


// finds the users current coordinates  
/*                 
function getCurrentLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude; // where lat is stored
      const longitude = position.coords.longitude; // where long is stored
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      
        // Calculate the distance between two points
      const marketLatLng = new google.maps.LatLng(38.98, -76.93); // replace with the coordinates from the dataset

      const distance = google.maps.geometry.spherical.computeDistanceBetween(pointA, pointB);
      console.log('Distance: ' + distance);
    });
  } else { 
    console.log("Geolocation is not supported by this browser.");
  }
}
function showPosition(position) {
  x.innerHTML = "Latitude: " + position.coords.latitude + 
  "<br>Longitude: " + position.coords.longitude;
}*/



async function findMarket() {
  const address = document.querySelector('.markets'); 
  //const submitButton = document.querySelector('#data_load');

  let marketList = [];

  address.addEventListener('submit', async (Submit) => {
    Submit.preventDefault();
    console.log('submitted form'); 

  // 1. asynch data request
    const response = await fetch(
      'https://data.princegeorgescountymd.gov/resource/sphi-rwax.json'); 
    marketList = await response.json();  //object from json data
    console.table(marketList);    
    injectHTML(marketList);
    //getCurrentLocation();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const userLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        console.log(`${userLatLng}`);
        
        marketList.forEach(market => {
          const marketLatLng = new google.maps.LatLng(market.latitude, market.longitude);
          const distance = google.maps.geometry.spherical.computeDistanceBetween(userLatLng, marketLatLng);

          market.distance = distance;
        });

        // 4. Sort list of farmers markets by distance
        marketList.sort((a, b) => a.distance - b.distance);

        // 5. Display sorted list of farmers markets
        const target = document.querySelector('#markets_list');
        target.innerHTML = '';
        marketList.forEach((item) => {
          const str = `<li>${item.market_name} (${item.distance.toFixed(2)} miles)</li>`;
          target.innerHTML += str;
        });
      });

      } else { 
      console.log("Geolocation is not supported by this browser.");
    }
  });
}


const map = initMap();
//markerPlace(marketList, map);


document.addEventListener('DOMContentLoaded', async () => findMarket());