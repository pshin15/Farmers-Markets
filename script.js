(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
  key: "AIzaSyAZpd--PTRIENjwVx91jEX2Tk9IjaJtuJE",
  v: "weekly",
});

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


// finds the users current coordinates
async function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        userloc = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        //console.log('userloc', `${userloc}`);
        resolve(userloc);
      });
    } else {
      console.log("Geolocation is not supported by this browser.");
      reject("Geolocation not supported");
    }
  });
}


let marketlistdistance = [];
//let marketLatLng = [];

// calculates the distance between user coordinates and market coordinates
async function calculateDistance(marketList, map) {
  const userLocation = await getCurrentLocation();

  console.log("CurrentPosition", `${userLocation}`);
  console.log("MarketList", marketList);

  marketList = marketList.map(market => {
    const latitude = parseFloat(market.location.latitude);
    const longitude = parseFloat(market.location.longitude);

    const marketLatLng = new google.maps.LatLng(latitude, longitude);

    const distanceMeters = google.maps.geometry.spherical.computeDistanceBetween(userLocation, marketLatLng);
    const distanceMiles = distanceMeters / 1609.344; // converted to miles
    marketlistdistance.push([distanceMiles, market])

    //console.log("distance", distanceMiles)
    console.log("printed distances")

    return { ...market, distance: (distanceMiles).toFixed(2)};

  });
  //console.log("marketlistdistance", marketlistdistance);
  //console.log("Updated Market List", marketList);

  injectHTML(marketList);
  markerPlace(marketList, map);
}

/* Look for where you're assigning the distance to the object containing the names of your farmers markets */ 

// filters based on distance selected in dropdown
function filterDistance() {
  const selectElement = document.querySelector('#market-distance');
    //console.log(selectElement);
  selectElement.addEventListener('change', (event) => {
    const dropdownOptions = parseFloat(selectElement.value);
    console.log("dropdownOptions", dropdownOptions);
  
  // Filter the marketList based on the dropdown option
  const filteredMarketList = marketlistdistance.filter(([distance, market]) => {
    if (dropdownOptions == 1) {
      return distance <= 1;
    } else if (dropdownOptions == 5) {
      return distance <= 5;
    } else if (dropdownOptions == 10) {
      return distance <= 10;
    } else if (dropdownOptions == 25) {
      return distance <= 25;
    } else {
      return true; // return all markets if select 'Select' option
    }
  });

  //const filteredMarkets = filteredMarketList.map(([distance, market]) => market);

  const filteredMarkets = filteredMarketList.map(([distance, market]) => {
    return {...market, distance: (distance).toFixed(2)};
    });
  console.log("filteredMarkets", filteredMarkets);
  injectHTML(filteredMarkets);
  });
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
  const map = L.map('map').setView([38.99, -76.94], 13);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 25,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(map);
  return map;
}



function markerPlace(array, map) {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });

  array.forEach((item) => {
    const latitude = parseFloat(item.location.latitude);
    const longitude = parseFloat(item.location.longitude);
    const coordinates = {latitude, longitude}; 

    console.log('markerPlace', coordinates);

    L.marker([latitude, longitude]).addTo(map).bindPopup(title=item.market_name);
  })
}


async function findMarket() {
  const allMarkets = document.querySelector('.markets');

  let marketList = [];
  //let currentList = []; //scoped to the main event function
  filterDistance();

  const map = initMap();

  allMarkets.addEventListener('click', async (Submit) => {
    Submit.preventDefault();
    console.log('clicked view all');

    const data = await fetch('https://data.princegeorgescountymd.gov/resource/sphi-rwax.json');
    marketList = await data.json();
    localStorage.setItem('marketList', JSON.stringify(marketList));

    const storedMarketList = localStorage.getItem('marketList');
    marketList = JSON.parse(storedMarketList);

    console.log("marketList", marketList);

    getCurrentLocation();
    await calculateDistance(marketList, map);
  });

  const resetButton = document.querySelector('#reset_button');
  resetButton.addEventListener('click', () => {
    console.log('reset page');
    location.reload();
  });
}

document.addEventListener('DOMContentLoaded', async () => findMarket());