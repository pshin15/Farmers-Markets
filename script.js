async function fetchData() {

  const mainForm = document.querySelector('.main_form'); 

  //let currentList = [];

  mainForm.addEventListener('Submit', async (SubmitEvent) => {
    submitEvent.preventDefault();
    console.log('submitted form');

  // 1. asynch data request
  const response = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json');
  currentList = await results.json();
  console.table(currentList); 


  });
}

document.addEventListener('DOMContentLoaded', async () => fetchData()); // the async keyword means we can make API requests
