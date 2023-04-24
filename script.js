async function fetchData() {

  const mainForm = document.querySelector('.main_form'); 

  mainForm.addEventListener('submit', async (Submit) => {
    Submit.preventDefault();
    console.log('submitted form'); //First, an asynchronous function called fetchData() is defined, which sets up an event listener on a form element. 

    let currentList = [];

  // 1. asynch data request
    const response = await fetch(
      'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json'); //When the form is submitted, the function sends an asynchronous request to the API endpoint using the fetch() method. 
    currentList = await response.json(); //Once the response is received, the function waits for the JSON data to be parsed using response.json() and assigns the result to a variable called currentList. 
    
    const filteredList = filteredData(currentList);

    console.table(filteredList); //The function also logs the data to the console using console.table().
  });

}

  // 2. TODO: processing request to change my data into the map and list
  /* 
      use array methods to filter and process the data from the API. 
      use the filter() method to remove any data that does not have an inspection score
    */
function filteredData(currentList) {
  return currentList.filter((item) => {
    return (item.inspection_results && 
            item.food_from_approved_source && 
            item.food_protected_from
    );
  });
}

console.log(filteredData);
//fetchData();



  // 3. TODO: create map
  function initMap() {
    var map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);
    return map;
  }

  document.addEventListener('DOMContentLoaded', async () => fetchData());