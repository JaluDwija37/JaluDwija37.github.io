const apiUrl = 'https://jaludwija37.pythonanywhere.com/';

function fetchAboutData() {
    fetch(apiUrl + "api/about/")
        .then(response => response.json())
        .then(aboutData => {
            displayAboutData(aboutData);
            // console.log(aboutData);
        });
}
function fetchCertificateData() {
    fetch(apiUrl + "api/certificate/")
        .then(response => response.json())
        .then(certificateData => {
            displayCertificatesData(certificateData);
            // console.log(certificateData);
        });
}

function fetchSkillData() {
    fetch(apiUrl + "api/skill/")
        .then(response => response.json())
        .then(skillData => {
            // Fetch program data after fetching skill data
            fetchProgramData(skillData);
        });
}

function fetchProgramData(skillData) {
    fetch(apiUrl + "api/program/")
        .then(response => response.json())
        .then(programData => {
            // Combine skillData and programData to create a new array with program details
            const combinedData = skillData.map(skill => {
                const programDetails = programData.find(program => program.id === skill.program);
                return {
                    id: skill.id,
                    program: programDetails,
                    level: skill.level
                };
            });

            // Call the function to display the combined data
            displaySkillsData(combinedData);
            // console.log(combinedData);
        });
}

function fetchEducationData() {
    fetch(apiUrl + "api/education/")
        .then(response => response.json())
        .then(aboutData => {
            displayEducationData(aboutData);
            console.log(aboutData);
        });
}


function displayAboutData(data) {
    // Assuming that your HTML structure includes elements with the following IDs
    const nameElement = document.getElementById("my-name");
    const shortDescriptionElement = document.getElementById("short_description");
    // const longDescriptionElement = document.getElementById("long_description");

    // Assuming that the API response contains a single object (not an array)
    const aboutData = data[0];

    // Update the HTML content with the fetched data
    nameElement.textContent = aboutData.name;
    shortDescriptionElement.textContent = aboutData.short_description;
    // longDescriptionElement.textContent = aboutData.long_description;
}

function displayCertificatesData(data) {
    const certificateList = document.getElementById("certificate-list");
    certificateList.innerHTML = "";

    // Loop through the data
    data.forEach(element => {
        // Create a link element
        const link = document.createElement('a');
        link.className = "col"
        link.href = element.image; // Replace 'your_destination_url_here' with the actual URL you want to redirect to
        link.target = '_blank'; // Open the link in a new tab

        // Create card element
        const card = document.createElement('div');
        card.className = 'card mb-3 mx-auto mb-5 mb-lg-0';
        card.style = 'width: 18rem;';

        // Create card body
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        // Add title to the card (assuming 'name' is the title)
        const title = document.createElement('h5');
        title.className = 'card-title text-center';
        title.textContent = element.name;

        // Create an image element for the certificate image
        const certificateImage = document.createElement('img');
        certificateImage.className = 'certificate-image border';
        certificateImage.src = element.image;
        certificateImage.alt = 'Certificate Image';

        // Add text content to the card (assuming 'date' is the text content)
        const cardText = document.createElement('p');
        cardText.className = 'card-text text-center pt-2';
        cardText.textContent = element.intitution + "  •  " + element.date;

        // Append elements to the card body
        cardBody.appendChild(title);
        cardBody.appendChild(certificateImage);
        cardBody.appendChild(cardText);

        // Append card body to the card
        card.appendChild(cardBody);

        // Append the card to the link
        link.appendChild(card);

        // Append the link to the container
        certificateList.appendChild(link);
    });
}




function displaySkillsData(data) {
    const skillsList = document.getElementById("skill-list");
    skillsList.innerHTML = '';

    // Loop through the combined data
    data.forEach(element => {
        // Create a card element
        const card = document.createElement('div');
        card.className = 'card mb-3 mx-auto mb-5 mb-lg-0 border-0';
        card.style = 'width: 18rem;';

        // Create card body
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        // Add title to the card (assuming 'name' is the title)
        const title = document.createElement('h5');
        title.className = 'card-title text-center';
        title.textContent = element.program.name;

        // Create an image element for the program image
        const programImage = document.createElement('img');
        programImage.className = 'program-image mx-auto d-block';
        programImage.src = element.program.image;
        programImage.alt = 'Program Image';

        // Add text content to the card (assuming 'level' is the text content)
        const cardText = document.createElement('div');
        cardText.className = 'card-body text-center pt-2';
        cardText.textContent = "Level: " + element.level;

        // Append elements to the card body
        cardBody.appendChild(title);
        cardBody.appendChild(programImage);
        cardBody.appendChild(cardText);

        // Append card body to the card
        card.appendChild(cardBody);

        // Append the card to the container
        skillsList.appendChild(card);
    });
}

function displayEducationData(data) {
    const educationList = document.getElementById("education-list");
    educationList.innerHTML = "";

    // Loop through the data
    data.forEach(element => {
        // Create list element
        const list = document.createElement('li');
        list.className = 'pt-2';

        // Add title to the card (assuming 'name' is the title)
        const name = document.createElement('h5');
        name.textContent = element.name;

        // Add title to the card (assuming 'name' is the title)
        const major = document.createElement('p');
        major.textContent = element.major + "  •  " + element.grade;

        // Add title to the card (assuming 'name' is the title)
        const date = document.createElement('p');
        const startYear = element.year_start.slice(0, 4);
        const endYear = element.year_end.slice(0, 4);
        date.textContent = startYear + " - " + endYear;

        // Append elements to the card body
        list.appendChild(name);
        list.appendChild(major);
        list.appendChild(date);

        // Append the link to the container
        educationList.appendChild(list);
    });
}

// Call the functions when the page is loaded
fetchAboutData();
fetchCertificateData();
fetchSkillData();
fetchEducationData();
