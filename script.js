
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
  });
}

const map = initMap();

//markerPlace(marketList, map);


document.addEventListener('DOMContentLoaded', async () => findMarket());