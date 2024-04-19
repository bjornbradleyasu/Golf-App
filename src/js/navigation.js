function switchPage(pageNum) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';  // Hide all pages
    });

    const activePage = document.getElementById('page' + pageNum);
    activePage.style.display = 'block';  // Show the selected page
}
function startGame(gameId) {
    alert("Starting Game " + gameId);
    // Additional logic to start the game can be added here
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

function filterCourses() {
    var input, filter, ul, li, i, txtValue;
    input = document.getElementById("courseSearchInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("courseList");
    course = div.getElementsByClassName("course-item");
    for (i = 0; i < course.length; i++) {
        txtValue = course[i].textContent || course[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            course[i].style.display = "";
        } else {
            course[i].style.display = "none";
        }
    }
}
