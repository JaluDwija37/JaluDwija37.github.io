const apiUrl = 'https://jaludwija37.pythonanywhere.com/';

function fetchWithRetry(url, options) {
    return fetch(url, options)
        .then(response => response.json())
        .catch(error => {
            // Check if it's a CORS error
            if (error.name === 'TypeError' && error.message.includes('cross-origin')) {
                handleCORSFailure();
            } else {
                // Log other types of errors
                console.error('Fetch error:', error);
            }
        });
}

function fetchAboutData() {
    fetchWithRetry(apiUrl + "api/about/")
        .then(aboutData => {
            displayAboutData(aboutData);
        });
}

function fetchCertificateData() {
    fetchWithRetry(apiUrl + "api/certificate/")
        .then(certificateData => {
            displayCertificatesData(certificateData);
        });
}

function fetchSkillData() {
    fetchWithRetry(apiUrl + "api/skill/")
        .then(skillData => {
            fetchProgramData(skillData);
        });
}

function fetchProgramData(skillData) {
    fetchWithRetry(apiUrl + "api/program/")
        .then(programData => {
            const combinedData = skillData.map(skill => {
                const programDetails = programData.find(program => program.id === skill.program);
                return {
                    id: skill.id,
                    program: programDetails,
                    level: skill.level
                };
            });

            displaySkillsData(combinedData);
        });
}

function fetchEducationData() {
    fetchWithRetry(apiUrl + "api/education/")
        .then(aboutData => {
            displayEducationData(aboutData);
        });
}

function fetchProjectData() {
    fetchWithRetry(apiUrl + "api/project/")
        .then(projectData => {
            const sortedProjectData = projectData.sort((a, b) => b.id - a.id);
            fetchProgramDataForProjects(sortedProjectData);
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
        link.className = "link-certi card certificate-card mb-2 mx-auto border-0 "
        link.href = element.image; // Replace 'your_destination_url_here' with the actual URL you want to redirect to
        link.target = '_blank'; // Open the link in a new tab

        // Create card element
        // const card = document.createElement('div');
        // card.className = 'card certificate-card mb-2 mx-auto';
        // card.style = 'width: 18rem;';

        // Create card body
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        // Add title to the card (assuming 'name' is the title)
        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = element.name;

        // Create an image element for the certificate image
        const certificateImage = document.createElement('img');
        certificateImage.className = 'certificate-image border img-fluid mx-auto d-block';
        certificateImage.src = element.image;
        certificateImage.alt = 'Certificate Image';

        // Add text content to the card (assuming 'date' is the text content)
        const cardText = document.createElement('p');
        cardText.className = '';
        cardText.textContent = element.intitution + "  •  " + element.date;

        // Append elements to the card body
        cardBody.appendChild(certificateImage);
        cardBody.appendChild(title);

        cardBody.appendChild(cardText);

        // Append card body to the card
        link.appendChild(cardBody);

        // Append the card to the link
        // link.appendChild(card);

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
        card.className = 'card skill-card mb-2 mx-auto border-0';
        card.style = 'width: 18rem;';

        // Create card body
        const cardBody = document.createElement('div');
        cardBody.className = 'card-body text-center';

        // Add title to the card (assuming 'name' is the title)
        const title = document.createElement('h5');
        title.className = 'card-title text-center';
        title.textContent = element.program.name;

        // Create an image element for the program image
        const programImage = document.createElement('img');
        programImage.className = 'program-image img-fluid mx-auto d-block';
        programImage.src = element.program.image;
        programImage.alt = 'Program Image';

        // Add text content to the card (assuming 'level' is the text content)
        const cardText = document.createElement('div');
        cardText.className = 'text-center';
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

function fetchProgramDataForProjects(projectData) {
    // Extract all unique program IDs from the project data
    const programIds = [...new Set(projectData.flatMap(project => project.program))];

    // Fetch program data for the extracted program IDs
    fetch(apiUrl + "api/program/")
        .then(response => response.json())
        .then(programData => {
            // Map program IDs to their corresponding program details
            const programDetailsMap = {};
            programData.forEach(program => {
                programDetailsMap[program.id] = program;
            });

            // Combine projectData with programDetails to create a new array with project details
            const combinedProjectData = projectData.map(project => {
                return {
                    id: project.id,
                    name: project.name,
                    programs: project.program.map(programId => programDetailsMap[programId]),
                    description: project.description,
                    linkSrc: project.link_src,
                    image: project.image
                };
            });

            // Call the function to display the combined project data
            displayProjectData(combinedProjectData);
        });
}

function fetchProjectData() {
    fetch(apiUrl + "api/project/")
        .then(response => response.json())
        .then(projectData => {
            // Fetch program data after fetching project data
            fetchProgramDataForProjects(projectData);
        });
}

function fetchProgramDataForProjects(projectData) {

    // Extract all unique program IDs from the project data
    const programIds = [...new Set(projectData.flatMap(project => project.program))];

    // Fetch program data for the extracted program IDs
    fetch(apiUrl + "api/program/")
        .then(response => response.json())
        .then(programData => {
            // Map program IDs to their corresponding program details
            const programDetailsMap = {};
            programData.forEach(program => {
                programDetailsMap[program.id] = program;
            });

            // Combine projectData with programDetails to create a new array with project details
            const combinedProjectData = projectData.map(project => {
                const programImages = project.program.map(programId => programDetailsMap[programId].image);
                return {
                    id: project.id,
                    name: project.name,
                    programs: programImages,
                    description: project.description,
                    linkSrc: project.link_src,
                    image: project.image
                };
            });

            // Call the function to display the combined project data
            displayProjectData(combinedProjectData);
        });
}

function displayProjectData(data) {
    const carousel = document.getElementById("carouselExample");
    const carouselInner = carousel.querySelector(".carousel-inner");

    // Clear existing carousel items
    carouselInner.innerHTML = "";

    // Loop through the combined project data
    data.forEach((element, index) => {

        // Create a div with class "carousel-item"
        const carouselItem = document.createElement('div');
        carouselItem.className = 'carousel-item' + (index === 0 ? ' active' : '');

        const link = document.createElement('a');
        link.className = ""
        link.href = element.linkSrc; // Replace 'your_destination_url_here' with the actual URL you want to redirect to
        link.target = '_blank';

        // Create a div with class "card"
        const cardDiv = document.createElement('div');
        cardDiv.className = 'card';

        // Create an image element for the project image
        const projectImage = document.createElement('img');
        projectImage.className = 'card-img-top project-image';
        projectImage.src = element.image;
        projectImage.alt = 'Project Image';

        // Create a div with class "card-body"
        const cardBodyDiv = document.createElement('div');
        cardBodyDiv.className = 'card-body';

        // Add title to the card (assuming 'name' is the title)
        const title = document.createElement('h5');
        title.className = 'card-title';
        title.textContent = element.name;

        const prog = document.createElement('h4');

        // Add text content to the card (assuming 'description' is the text content)
        const cardText = document.createElement('p');
        cardText.className = 'card-text';
        cardText.textContent = element.description;

        // Append elements to the card body
        cardBodyDiv.appendChild(title);
        cardBodyDiv.appendChild(prog);
        cardBodyDiv.appendChild(cardText);

        // Append project image and card body to the card
        cardDiv.appendChild(projectImage);
        cardDiv.appendChild(cardBodyDiv);

        // Append program images
        element.programs.forEach(programImage => {
            const programImageElement = document.createElement('img');
            programImageElement.src = programImage;
            programImageElement.alt = 'Program Image';
            programImageElement.className = "project-prog-image";
            prog.appendChild(programImageElement);
        });

        link.appendChild(cardDiv)
        // Append the card to the carousel item
        carouselItem.appendChild(link);

        // Append the carousel item to the carousel inner container
        carouselInner.appendChild(carouselItem);
    });
}

// function showAlert() {
//     alert("Selamat Datang di Website Portofolioku. Jika beberapa bagian halaman tidak muncul silahkan Refresh halaman ini. Dikarenakan Website Portofolio ini menggunakan API");
// }

// Call the functions when the page is loaded
// showAlert();
fetchAboutData();
fetchCertificateData();
fetchSkillData();
fetchEducationData();
fetchProjectData();

ScrollReveal({
    reset: true,
    distance: "100px",
    duration: 2000,
    delay: 200
});



// ScrollReveal().reveal('.judul-tentang, .judul-keahlian , .judul-serti, .pendidikan', { origin: "top", cleanup: true });
// ScrollReveal().reveal('.socials, .about-image', { origin: "left", cleanup: true });
// ScrollReveal().reveal('.profile-image', { origin: "right", cleanup: true });
// ScrollReveal().reveal('.contact-section, .short_description, .btn-cv, .isi-keahlian, .isi-serti', { origin: "bottom", cleanup: true });