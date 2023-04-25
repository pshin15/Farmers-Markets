
// 2. map array method to change my data into the map
/* 
  use array methods to filter and process the data from the API. 
  use the filter() method to remove any data that does not have an inspection score
*/

function initMap() {
  const map = L.map('map').setView([38.99, -76.94], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  return map;
}

async function findMarket() {

  const address = document.querySelector('.markets'); 

  address.addEventListener('submit', async (Submit) => {
    Submit.preventDefault();
    console.log('submitted form'); 

    let currentList = [];

  // 1. asynch data request
    const response = await fetch(
      'https://data.princegeorgescountymd.gov/resource/sphi-rwax.json'); 
    marketList = await response.json();  
    console.table(marketList);    
    
  initMap();
  });
}

document.addEventListener('DOMContentLoaded', async () => 
  initMap(), findMarket());
