/* Consuming Own API
   Av: Maamoun Okla 
   Datum: 2024-04-08 */

// Variabler
let url = "http://127.0.0.1:3000/api/experiences";

// EventLyssnare 
window.onload = function () {
  // Responsiv nav burger
  document.querySelector('.burger').addEventListener('click', function () {
    document.querySelector('nav ul').classList.toggle('active');

  });

  // Hämta formuläret
  const formEl = document.getElementById("expForm");
  formEl.classList.add("main-form");
  formEl.addEventListener("submit", event => {
    event.preventDefault();
    // Hämta värden från formuläret
    const companyname = document.getElementById("companyname").value;
    const jobtitle = document.getElementById("jobtitle").value;
    const location = document.getElementById("location").value;
    // Skapar datumobjekt för start- och slutdatum
    const startdate = new Date(document.getElementById("startdate").value);
    const enddate = new Date(document.getElementById("enddate").value);
    const description = document.getElementById("description").value;

    // Skapa en arbetslivserfarenhet med de insamlade uppgifterna
    createExperience(companyname, jobtitle, location, startdate, enddate, description);
    // Rensa from-innehållet
    formEl.reset();
  });

}

// Anropa funktionen för att visa alla jobb 
showAllJobs();

// Anropa getData(); för att hämta data från API:et 
getData();

// Funktion getData() för att hämta befintliga jobb från API:et
async function getData() {
  try {
    const response = await fetch(url);
    const data = await response.json();

  } catch (error) {
    console.error('Fel vid hämtning av data:', error); // Skriv ut felmeddelande om något går fel
  }
}

// Funktion för att skapa ett jobb
async function createExperience(companyname, jobtitle, location, startdate, enddate, description) {
  try {
    // Skapa ett objekt med experiences
    let experienceObj = {
      name: companyname,
      title: jobtitle,
      location: location,
      startdate: startdate,
      enddate: enddate,
      description: description
    };
 
    // Skicka till API:et 
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "Application/json",
      },
      body: JSON.stringify(experienceObj)
    });

  } catch (error) {
    console.error('Fel i experienceObj:', error);
  }
}

// Funktion för att visa alla befintliga jobb på index.html
async function showAllJobs() {

  // Hämta alla jobb från API:et
  const response = await fetch(url);
  const jobs = await response.json();
  const jobsListDiv = document.getElementById('jobsList');

  // Loopa igenom varje jobb och skapa HTML-element för varje jobb
  jobs.forEach(job => {

    // Konvertera start- och slutdatum till ISO-sträng i formatet YYYY-MM-DD
    const startDate = new Date(job.startdate).toISOString().slice(0, 10);
    const endDate = new Date(job.enddate).toISOString().slice(0, 10);

    // Skapa artikel-element för varje jobb och fyll det med jobbuppgifter
    const article = document.createElement('article');
    article.innerHTML = `
        <h2>${job.jobtitle} <span>${job.companyname} </span> </h2>
         <h4>  ${startDate}  —  ${endDate} </h4> 
        <p><strong>Plats:</strong> ${job.location}</p>
        
        <p><strong>Beskrivning:</strong> ${job.description}</p>
        
      `;
    //Skapa delete knappen
    const buttonsDiv = document.createElement("div");
    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

    //Lägg till index attribut till knappen
    deleteBtn.setAttribute('data-index', job.id);

    // Radera erfarenhet
    deleteBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      
      //Skapa id
      const id = parseInt(deleteBtn.getAttribute("data-index"));
      console.log(id);
      try {
        const deleteUrl = `${url}/${id}`;

        const response = await fetch(deleteUrl, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        console.log('Resource deleted successfully');

        //Ta bort den närmaste artikel elementet dynamiskt (då vanlig delete kräver att man laddar om sidan.)
        const article = deleteBtn.closest("article");
        jobsListDiv.removeChild(article);
     
      } catch (error) {
        console.error('Error deleting resource:', error);
      }
    
    });
    
    buttonsDiv.appendChild(deleteBtn);
    article.appendChild(buttonsDiv);
    // Lägg till artikel-elementet i listan för jobb
    jobsListDiv.appendChild(article);
 
  })
}

 