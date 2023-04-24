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

