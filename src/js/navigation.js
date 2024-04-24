function switchPage(pageNum) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });
    const activePage = document.getElementById('page' + pageNum);
    activePage.style.display = 'block';

    if (pageNum === 1) {
        setupPage1();
    }
    if (pageNum === 2) {
        // Hide any game details that might be showing when going back to the game selection page
        hideGameDetails();
    }

    if (pageNum === 3) {
        initMap();  // Initialize the map when Page 3 is shown
    }
    if (pageNum === 5) {
        setupPage5();
    }
}

function setupPage1() {
    const selectedCourseDetailsBox = document.getElementById('selectedCourseDetails');
    if (selectedCourseDetailsBox) {
        const selectedCourse = JSON.parse(localStorage.getItem('selectedCourse')); // Retrieve the selected course from local storage
        selectedCourseDetailsBox.textContent = selectedCourse ? selectedCourse.details : 'No course selected';
    }
}

function setupPage5() {
    // Assuming the 'selectedGameDetails' ID is a typo and it should be 'selectedGameName'.
    const selectedGameElement = document.getElementById('selectedGameName');
    const selectedGame = localStorage.getItem('selectedGame');
    if (selectedGameElement) {
        selectedGameElement.textContent = selectedGame ? `Selected Game: ${selectedGame}` : 'No game selected.';
    } else {
        console.error('Selected game details element not found on page 5');
    }

    const selectedCourseDetailsBox = document.getElementById('selectedCourseDetails');
    // It's necessary to parse the selected course JSON string only if it's not null.
    const storedCourse = localStorage.getItem('selectedCourse');
    const selectedCourse = storedCourse ? JSON.parse(storedCourse) : null;
    if (selectedCourseDetailsBox && selectedCourse) {
        selectedCourseDetailsBox.textContent = selectedCourse.name + ":    " + selectedCourse.details;
    } else if (!selectedCourse) {
        selectedCourseDetailsBox.textContent = 'No course selected';
    } else {
        console.error('Selected course details element not found on page 5');
    }
}


function initializeToggles() {
    const toggles = document.querySelectorAll('.toggle-input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', function() {
            if(this.checked) {
                // Turn off all toggles except the one that triggered the change
                toggles.forEach(tog => tog !== this && (tog.checked = false));
                // Update the selected game name display
                updateSelectedGameName(this.dataset.gameName);
                // Save the selected game
                localStorage.setItem('selectedGame', this.dataset.gameName);
            } else {
                updateSelectedGameName('');
                localStorage.removeItem('selectedGame');
            }
        });
    });

    // Check if there's a stored selected game and update the display accordingly
    const storedGame = localStorage.getItem('selectedGame');
    if(storedGame) {
        const toggle = document.querySelector(`.toggle-input[data-game-name="${storedGame}"]`);
        if(toggle) {
            toggle.checked = true;
            updateSelectedGameName(storedGame);
        }
    }
}

function handleToggleChange(selectedToggle) {
    const toggles = document.querySelectorAll('.toggle-input');
    toggles.forEach(toggle => {
        toggle.checked = toggle === selectedToggle;
    });
    const gameName = selectedToggle.dataset.gameName;
    updateSelectedGameName(gameName); // Update the displayed game name
    localStorage.setItem('selectedGame', gameName); // Store the selected game in local storage
}

document.querySelectorAll('.toggle-input').forEach(toggle => {
    toggle.addEventListener('change', function() {
        handleToggleChange(this);
    });
});


function setupGameNameDisplay() {
    const selectedGameNameBox = document.createElement('div');
    selectedGameNameBox.id = 'selectedGameName'; // This is the ID for the new box
    selectedGameNameBox.className = 'game-name-display'; // Add a class for styling
    const page5 = document.getElementById('page5');
    page5.insertBefore(selectedGameNameBox, page5.firstChild); // Insert this box at the top of page 5
}


function showGameDetails(gameId) {

    const gameInfo = {
        1: '<div class="header-text-container"><h2>Classic</h2></div><p>This is your everyday golf battle...</p>',
        2: '<div class="header-text-container"><h2>Scramble</h2></div><p>Team up for a scramble...</p>',
        3: '<div class="header-text-container"><h2>Best Ball</h2></div><p>Compete in a best ball contest...</p>',
        4: '<div class="header-text-container"><h2>Tee Flip</h2></div><p>Try the tee flip challenge...</p>',
        5: '<div class="header-text-container"><h2>Wheel of Not Ideal</h2></div><p>Spin the wheel, play the deal...</p>',
        6: '<div class="header-text-container"><h2>Wolf</h2></div><p>Play the Wolf game...</p>'
    };

    const gameNames = {
        1: "Classic",
        2: "Scramble",
        3: "Best Ball",
        4: "Tee Flip",
        5: "Wheel of Not Ideal",
        6: "Wolf"
    };

    selectedGame = gameNames[gameId];

    const detailContainer = document.getElementById('detailsContent');
    const backBtnHTML = '<img src="back_icon.png" alt="Back" class="back-button" onclick="switchPage(2)" />';

    detailContainer.innerHTML = backBtnHTML + gameInfo[gameId];
    detailContainer.innerHTML = gameInfo[gameId];
    detailContainer.innerHTML += `
        <div class="toggle-switch">
            <input id="toggleGame${gameId}" class="toggle-input" type="checkbox" data-game-name="${gameNames[gameId]}" />
            <label for="toggleGame${gameId}" class="toggle-label"></label>
        </div>
    `;

    // Re-initialize toggles to ensure new ones are also set up correctly
    initializeToggles();
    document.getElementById('gameSelection').style.display = 'none';
    document.getElementById('gameDetails').style.display = 'block';

    // Update the game name on Page 5 if the toggle is already on
    const toggle = document.getElementById(`toggleGame${gameId}`);
    if(toggle && toggle.checked) {
        updateSelectedGameName(gameNames[gameId]);
    }
}

function updateSelectedGameName(gameName) {
    const selectedGameNameBox = document.getElementById('selectedGameName');
    if (selectedGameNameBox) {
        selectedGameNameBox.textContent = gameName;
    }
}

window.addEventListener('pageshow', initializeToggles); // Ensure toggles are set correctly when navigating back/forward


function hideGameDetails() {
    document.getElementById('gameSelection').style.display = 'block';
    document.getElementById('gameDetails').style.display = 'none';
    document.getElementById('detailsContent').innerHTML = ''; // Clear the details content
}

function setupStartGameButton() {
    const startBtn = document.getElementById('startGameButton');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            switchPage(5); // Ensure this is the correct page number for the "Start Game" page
        });
    }
}

let map;
let courseArray = [];
let selectedCourse = null;

async function loadCourses() {
    try {
        const response = await fetch('Golf Courses-USA.csv');
        const data = await response.text();
        courseArray = data.split('\n').slice(1).map(line => {
            const tokens = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/); // This regex splits by commas not within quotes
            if (tokens.length < 3) return null; // Discard incomplete lines

            // Combine all details after the second comma
            const details = tokens.slice(3).join(',').replace(/\"/g, '').trim(); 
            const name = tokens[2].replace(/\"/g, '').trim();
            const lat = parseFloat(tokens[1]);
            const lng = parseFloat(tokens[0]);

            return { lat, lng, name, details }; // Store full details
        }).filter(Boolean);

        // Place markers for each course on the map
        courseArray.forEach(course => {
            const marker = new google.maps.Marker({
                position: { lat: course.lat, lng: course.lng },
                map: map,
                title: course.name
            });
            marker.addListener('click', () => {
                map.setCenter(marker.getPosition());
                map.setZoom(13);
                showCourseDetails(course); // Function to display course details
            });
        });
    } catch (error) {
        console.error('Error loading courses:', error);
    }
}

async function initMap() {
    const mapOptions = {
        zoom: 5,
        center: { lat: 37.0902, lng: -95.7129 } // Center on USA
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
    await loadCourses(); // Load courses and add markers to the map

    // Attempt to zoom to the user's current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
            map.setCenter(userLocation);
            map.setZoom(10);
        }, () => {
            console.error("Geolocation is not supported by this browser or access denied.");
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
    await loadCourses();
}

function filterCourses() {
    const input = document.getElementById('courseSearchInput').value.toLowerCase();
    const suggestionsDropdown = document.getElementById('suggestionsDropdown');
    suggestionsDropdown.innerHTML = '';  // Clear existing suggestions
    courseArray.filter(course => course.name.toLowerCase().includes(input)).slice(0, 10).forEach(course => {
        const suggestion = document.createElement('div');
        suggestion.className = 'suggestion-item';
        suggestion.textContent = course.name;
        suggestion.addEventListener('click', () => {
            document.getElementById('courseSearchInput').value = course.name;
            selectedCourse = course;
            suggestionsDropdown.style.display = 'none';
            displayCourseDetails(course);
        });
        suggestionsDropdown.appendChild(suggestion);
    });
    suggestionsDropdown.style.display = 'block';
}

function onCourseSelected(course) {
    if (course && map) {
        map.setCenter(new google.maps.LatLng(course.lat, course.lng));
        map.setZoom(13);
        displayCourseDetails(course);
    }
}

function displayCourseDetails(course) {
    const detailsDiv = document.getElementById('courseDetails');
    if (detailsDiv) {
        detailsDiv.innerHTML = course.name + ": " + course.details;
        detailsDiv.style.display = 'block';
        // Save the selected course in local storage
        localStorage.setItem('selectedCourse', JSON.stringify(course));
    }
}

function clearSearch() {
    document.getElementById('courseSearchInput').value = '';
    document.getElementById('suggestionsDropdown').style.display = 'none';
    selectedCourse = null; // Reset the selected course
    filterCourses(); // Re-filter courses which should now show no results
    
    // Optionally reset the map view to the initial zoom level and position
    if (map) {
        const centerOfUSA = { lat: 37.0902, lng: -95.7129 };
        map.setCenter(centerOfUSA);
        map.setZoom(5);
    }
    
    // Clear the course details from Page 5
    const selectedCourseDetailsBox = document.getElementById('selectedCourseDetails');
    if (selectedCourseDetailsBox) {
        selectedCourseDetailsBox.textContent = ''; // Clear the text
    }
}

document.addEventListener('DOMContentLoaded', function() {
    switchPage(1);
    setupStartGameButton();
    initializeToggles();

    // Ensure all elements are correctly referenced
    let takePictureButton = document.getElementById('takePictureButton');
    let video = document.getElementById('cameraStream');
    let canvas = document.getElementById('snapshotCanvas');
    let context = canvas.getContext('2d');
    let openCameraButton = document.getElementById('openCameraButton');

    const table = document.getElementById('scannedTextTable');
    for (let i = 0; i < 11; i++) {
        const row = table.insertRow();
        for (let j = 0; j < 11; j++) {
            row.insertCell().textContent = '\u00A0'; // Unicode for non-breaking space
        }
    }

    const enterButton = document.getElementById('enterButton');
        if (enterButton) {
            enterButton.addEventListener('click', function() {
            if (selectedCourse && map) {
            const position = new google.maps.LatLng(selectedCourse.lat, selectedCourse.lng);
            map.setCenter(position);
            map.setZoom(13);

            // Display the course details without the latitude and longitude
            displayCourseDetails(selectedCourse);
            }
        });
    }
    initMap();

    if (openCameraButton) {
        openCameraButton.addEventListener('click', async () => {
            try {
                let stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                video.play();
            } catch (error) {
                console.error('Error accessing camera:', error);
            }
        });
    }

    if (takePictureButton) {
        takePictureButton.addEventListener('click', async () => {
            if (video.srcObject) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                video.pause();
                video.srcObject.getTracks().forEach(track => track.stop()); // Stop the camera
                let imageData = canvas.toDataURL('image/png').split(',')[1];

                const visionApiUrl = `https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAPRZ4bppvwEn3IRwa7mABIGOJjZAEVrH0`;
                const response = await fetch(visionApiUrl, {
                    method: 'POST',
                    body: JSON.stringify({
                        "requests": [{
                            "image": { "content": imageData },
                            "features": [{ "type": "TEXT_DETECTION" }]
                        }]
                    }),
                    headers: { 'Content-Type': 'application/json' }
                });

                const result = await response.json();
                if (result.responses[0].fullTextAnnotation) {
                    const detectedText = result.responses[0].fullTextAnnotation.text;
                    displayScannedText(detectedText); // Function to display text in the table
                }
            } else {
                console.error("Camera stream not active.");
            }
        });
    }
});

function displayScannedText(text) {
    const words = text.split(/\s+/);
    let cells = document.querySelectorAll('#scannedTextTable td');
    let index = 0;
    cells.forEach(cell => {
        cell.textContent = index < words.length ? words[index++] : '';
    });
}



