function switchPage(pageNum) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
        page.classList.remove('active'); // Remove active class from all pages
    });

    // Show the requested page
    const activePage = document.getElementById('page' + pageNum);
    activePage.style.display = 'block';
    activePage.classList.add('active'); // Add active class to the requested page

    // Reinitialize the state of Page 1 each time we navigate back to it
    if (pageNum === 1) {
        setupPage1();
    }

    // Initialize the map when Page 3 is shown
    if (pageNum === 3) {
        initMap();
    }
}

// Call this function when you navigate to page 1 to reset its state
function setupPage1() {
    const page1 = document.getElementById('page1');
    page1.style.justifyContent = ''; // Reset any justify-content changes
    page1.style.alignItems = ''; // Reset any align-items changes

    // Reset styles for 'Start Game' button and 'Golf Icon' if needed
    const startButton = document.getElementById('startGameButton');
    const golfIcon = document.getElementById('golfIcon');

    // Set or reset any styles applied directly via JS
    startButton.style = '';
    golfIcon.style = '';

    // Alternatively, if you have specific classes that apply these styles, add them back
    // startButton.classList.add('game-button');
    // golfIcon.classList.add('golf-icon-class'); // Replace with actual class name if exists
}

function startGame(gameId) {
    alert("Starting Game " + gameId);
}

function showSubPage() {
    document.getElementById('startGamePage').style.display = 'block';
    document.getElementById('startGameButton').style.display = 'none';  // Optionally hide the button
}

// Function to hide the new subpage and show the "Start Game" button again
function hideSubPage() {
    document.getElementById('startGamePage').style.display = 'none';
    document.getElementById('startGameButton').style.display = 'block';  // Show the button again
}

function showGameDetails(gameId) {
    var gameInfo = {
        1: "<h2>Classic</h2><p>This is your everyday golf battle...</p>",
        // other game details
    };
    document.getElementById('detailsContent').innerHTML = gameInfo[gameId];
    document.getElementById('gameSelection').style.display = 'none';
    document.getElementById('gameDetails').style.display = 'block';
}

function hideGameDetails() {
    document.getElementById('gameSelection').style.display = 'block';
    document.getElementById('gameDetails').style.display = 'none';
}

let map;
let courseArray = [];
let selectedCourse = null;

async function loadCourses() {
    const response = await fetch('Golf Courses-USA.csv');
    const data = await response.text();
    const lines = data.split('\n').slice(1); // Skip the header line
    
    courseArray = lines.map((line, index) => {
        const columns = line.match(/(?:^|,)(?:"((?:[^"]|"")*)"|([^",]*))/g);
        if (!columns || columns.length < 3) {
            console.error(`Skipping malformed line at index ${index}:`, line);
            return null;
        }
        // Remove the first comma found by the regex match (if present) and trim the quotes
        const nameWithCityState = columns[2].startsWith(',') ? columns[2].substring(1).replace(/"/g, '').trim() : columns[2].replace(/"/g, '').trim();
        const latLngMatch = line.match(/^([^,]+),([^,]+)/); // Extract latitude and longitude from the beginning of the line
        if (!latLngMatch) {
            console.error('Invalid lat/lng format:', line);
            return null;
        }
        const lat = parseFloat(latLngMatch[2]);
        const lng = parseFloat(latLngMatch[1]);
        const details = line.split(',').slice(2).join(',').trim();
        return { nameWithCityState, lat, lng, details };
    }).filter(Boolean); // Filter out any null items
}


function filterCourses() {
    const input = document.getElementById('courseSearchInput').value.toLowerCase();
    const suggestionsDropdown = document.getElementById('suggestionsDropdown');
    suggestionsDropdown.innerHTML = '';

    const filteredCourses = courseArray
        .filter(course => course.nameWithCityState.toLowerCase().includes(input))
        .slice(0, 10); // Limit the results to 10

    filteredCourses.forEach(course => {
        const suggestionDiv = document.createElement('div');
        suggestionDiv.textContent = course.nameWithCityState;
        suggestionDiv.className = 'suggestion-item';
        suggestionDiv.onclick = function() {
            document.getElementById('courseSearchInput').value = course.nameWithCityState;
            selectedCourse = course; // Store the selected course with the name, city, and state
            suggestionsDropdown.style.display = 'none';
        };
        suggestionsDropdown.appendChild(suggestionDiv);
    });

    suggestionsDropdown.style.display = filteredCourses.length ? 'block' : 'none';
}

async function initMap() {
    const centerOfUSA = { lat: 37.0902, lng: -95.7129 };
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 5,
        center: centerOfUSA
    });

    await loadCourses();
    
    // Add markers to the map
    courseArray.forEach(course => {
        new google.maps.Marker({
            position: { lat: course.lat, lng: course.lng },
            map: map,
            title: course.nameWithCityState
        });
    });
}

function clearSearch() {
    document.getElementById('courseSearchInput').value = '';
    document.getElementById('suggestionsDropdown').style.display = 'none';
    filterCourses(); // Re-filter courses which should now show no results
}



document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('startGameButton').addEventListener('click', () => switchPage(5));
    document.getElementById('enterButton').addEventListener('click', function() {
        if (selectedCourse && map) {
            const position = new google.maps.LatLng(selectedCourse.lat, selectedCourse.lng);
            map.setCenter(position);
            map.setZoom(13);
    
            // Display the course details without the latitude and longitude
            const courseDetailsDiv = document.getElementById('courseDetails');
            courseDetailsDiv.textContent = selectedCourse.details; // Use 'details' for display
            courseDetailsDiv.style.display = 'block';
        }
    });
});

window.onload = initMap; // Initialize the map once all content is loaded
