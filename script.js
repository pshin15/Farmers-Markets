async function fetchData() {

  const mainForm = document.querySelector('.main_form'); 

  mainForm.addEventListener('submit', async (Submit) => {
    Submit.preventDefault();
    console.log('submitted form');

  // 1. asynch data request
  const response = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
  currentList = await response.json();
  console.table(currentList); 
  });
}



document.addEventListener('DOMContentLoaded', async () => {
  fetchData();
});


// 2. processing request change your data into the map and list
//function filterList()

// assume data is an array of inspection data objects
/*const filteredData = data.filter((item) => item.inspection_score !== null && item.latitude !== null && item.longitude !== null);

const processedData = filteredData.map((item) => {
return {
latitude: item.latitude,
longitude: item.longitude,
score: item.inspection_score
}
});


*/



/*For the heat map, I will use array methods to filter and process the data from the API. 
Specifically, I will use the filter() method to remove any data that does not have an inspection score, 
and the map() method to extract the necessary information, such as latitude, longitude, and inspection score. 
Then, I will use this filtered and processed data to display the heatmap using the leaflet.js library.
*/


//A quick filter that will return something based on a matching input 
