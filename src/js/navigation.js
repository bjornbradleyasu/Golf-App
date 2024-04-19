function switchPage(pageNum) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });

    const activePage = document.getElementById('page' + pageNum);
    activePage.style.display = 'block';
}
function startGame(gameId) {
    alert("Starting Game " + gameId);
}
function showGameDetails(gameId) {
    var gameInfo = {
        1: "<h2>Game 1 Details</h2><p>Details about Game 1...</p>",
        2: "<h2>Game 2 Details</h2><p>Details about Game 2...</p>",
        3: "<h2>Game 3 Details</h2><p>Details about Game 3...</p>",
        4: "<h2>Game 4 Details</h2><p>Details about Game 4...</p>",
        5: "<h2>Game 5 Details</h2><p>Details about Game 5...</p>"
    };

    document.getElementById('detailsContent').innerHTML = gameInfo[gameId];
    document.getElementById('gameSelection').style.display = 'none';
    document.getElementById('gameDetails').style.display = 'block';
}

function hideGameDetails() {
    document.getElementById('gameSelection').style.display = 'block';
    document.getElementById('gameDetails').style.display = 'none';
}

const courses = [
    {name: "Fireweed Meadows Golf Course", location: "Anchor Point, AK", lat: 59.773222, lon: -151.820102},
    {name: "Anchorage Golf Course", location: "Anchorage, AK", lat: 61.127089, lon: -149.814495},
    {name: "Russian Jack Springs Golf Course", location: "Anchorage, AK", lat: 61.206435, lon: -149.788303},
    {name: "Tanglewood Lakes Golf Club", location: "Anchorage, AK", lat: 61.113415, lon: -149.853757},
    {name: "Eagleglen Golf Course", location: "Elmendorf Afb, AK", lat: 61.233041, lon: -149.824373},
    {name: "Fairbanks Golf and Country Club", location: "Fairbanks, AK", lat: 64.877632, lon: -147.816536}
    // Add more courses as needed
];

window.onload = function() {
    displayCourses(courses);
};

function displayCourses(courseArray) {
    const courseList = document.getElementById("courseList");
    courseList.innerHTML = '';
    courseArray.forEach(course => {
        const courseDiv = document.createElement('div');
        courseDiv.className = 'course-item';
        courseDiv.textContent = `${course.name} - ${course.location}`;
        courseList.appendChild(courseDiv);
    });
}

function filterCourses() {
    const input = document.getElementById("courseSearchInput");
    const filter = input.value.toUpperCase();
    const filteredCourses = courses.filter(course => course.name.toUpperCase().includes(filter));
    displayCourses(filteredCourses);
}

