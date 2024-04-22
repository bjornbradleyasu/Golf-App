function switchPage(pageNum) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none'; // Hide all pages
    });

    const activePage = document.getElementById('page' + pageNum);
    activePage.style.display = 'block'; // Show the active page

    // If we're switching to Page 4, initialize the map
    if (pageNum === 4) {
        initMap();
    }
}

function startGame(gameId) {
    alert("Starting Game " + gameId);
}

function showGameDetails(gameId) {
    var gameInfo = {
        1: "<h2>Classic</h2><p>This is your everyday golf battle. Select below between match and stroke play. Then get to swinging!</p>",
        2: "<h2>Scramble</h2><p>Pairing up with a buddy to take on another duo? Select your teams below to get started!.</p>",
        3: "<h2>Best Ball</h2><p>Wanting to play your ball, but to also rely on your better friend? Select your teams below to get started</p>",
        4: "<h2>Tee Flip</h2><p>Wanting a risky challenge to do with your friends? Select your teams and whether you want to flip the tee yourself or here on the app to get started!</p>",
        5: "<h2>Wheel of Not Ideal</h2><p>Have you wanted to try the trademarked Good Good Wheel of Not Ideal yourself? While now you can. Enter your clubs here or on the profile page to get started!</p>",
        6: "<h2>Wolf</h2><p>Wanting a different game to try with your friends while playing your own ball? This is the game for you</p>",
        // ... Other game details ...
    };

    document.getElementById('detailsContent').innerHTML = gameInfo[gameId];
    document.getElementById('gameSelection').style.display = 'none';
    document.getElementById('gameDetails').style.display = 'block';
}

function hideGameDetails() {
    document.getElementById('gameSelection').style.display = 'block';
    document.getElementById('gameDetails').style.display = 'none';
}

async function loadCourses() {
    const response = await fetch('Golf Courses-USA.csv');
    const data = await response.text();
    const courses = data.split('\n').slice(1).map(line => line.split(',')[0]); // Assuming course names are in the first column
    return courses;
}

let coursesArray = [];

window.onload = async () => {
    coursesArray = await loadCourses();
    filterCourses(); // Initial display
};

function filterCourses() {
    const input = document.getElementById('courseSearchInput').value.toLowerCase();
    const courseList = document.getElementById('courseList');
    courseList.innerHTML = ''; // Clear previous results

    coursesArray.filter(course => course.toLowerCase().includes(input)).forEach(filteredCourse => {
        const courseElement = document.createElement('div');
        courseElement.textContent = filteredCourse;
        courseElement.className = 'course';
        courseList.appendChild(courseElement);
    });
}

function clearSearch() {
    document.getElementById('courseSearchInput').value = '';
    filterCourses();
}

let map; // Holds the map instance
// Ensure this is called once the Google Maps script is loaded and the DOM is ready
function initMap() {
    // Delay initialization to ensure DOM is fully ready
    window.setTimeout(() => {
        if (!map && document.getElementById('map')) {
            console.log('Map element found, initializing map...');
            const center = { lat: 37.0902, lng: -95.7129 }; // Center of the map (USA)
            map = new google.maps.Map(document.getElementById('map'), {
                zoom: 4,
                center: center
            });
        }
    }, 1000); // Delay by 1 second
}


// Modification in the part where the script is added to check if Google Maps script is already loaded
if (!window.google || !window.google.maps) {
    console.log('Adding Google Maps script to the page');
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyAPRZ4bppvwEn3IRwa7mABIGOJjZAEVrH0&callback=initMap`;
    script.async = true; // Asynchronously load the script to not block the DOM
    script.defer = true; // Defer execution until the DOM is fully parsed
    document.head.appendChild(script);
} else {
    console.log('Google Maps script already loaded');
    initMap(); // If the script is already there, we try to initialize the map directly
}