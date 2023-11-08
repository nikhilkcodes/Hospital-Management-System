const mobileBreakpoint = window.matchMedia("(max-width: 991px )");

$(document).ready(function () {
    $(".dash-nav-dropdown-toggle").click(function () {
        $(this).closest(".dash-nav-dropdown")
            .toggleClass("show")
            .find(".dash-nav-dropdown")
            .removeClass("show");

        $(this).parent()
            .siblings()
            .removeClass("show");
    });

    $(".menu-toggle").click(function () {
        if (mobileBreakpoint.matches) {
            $(".dash-nav").toggleClass("mobile-show");
        } else {
            $(".dash").toggleClass("dash-compact");
        }
    });

    $(".searchbox-toggle").click(function () {
        $(".searchbox").toggleClass("show");
    });

    // Dev utilities
    // $("header.dash-toolbar .menu-toggle").click();
    // $(".searchbox-toggle").click();
});
const currDate = document.querySelector('.current-date'); // Use querySelector to select the first element with the class 'current-date'
const currTime = document.querySelector('.current-time');
function updateDateAndTime() {
    const options = { timeZone: 'Asia/Kolkata' }; // Set the time zone to India (Asia/Kolkata)
    const date = new Date().toLocaleDateString('en-US', options);
    const time = new Date().toLocaleTimeString('en-US', options);

    currDate.innerHTML = `<i class="fa-solid fa-calendar-days"></i> Date : ${date}`;
    currTime.innerHTML = `<i class="fa-solid fa-clock"></i> Time : ${time}`;
}

// Call the function initially and then set it to update every second
updateDateAndTime();
setInterval(updateDateAndTime, 1000);
