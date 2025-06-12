// playful clock DOM elements
const playful_hour_tens = $id("playful").getElementsByClassName("time")[0]
const playful_hour_ones = $id("playful").getElementsByClassName("time")[1]
const playful_dots = $id("playful").getElementsByClassName("time")[2]
const playful_minutes_tens = $id("playful").getElementsByClassName("time")[3]
const playful_minutes_ones = $id("playful").getElementsByClassName("time")[4]

// color palettes
const color_palette_playful = [
    ["#cc5803dd", "#e2711ddd", "#ff9505dd", "#ffb627dd", "#ffc971dd"], //orange
    ["#ffd6ffdd", "#e7c6ffdd", "#c8b6ffdd", "#b8c0ffdd", "#bbd0ffdd"], //purple
    ["#f08080dd", "#f4978edd", "#f8ad9ddd", "#fbc4abdd", "#ffdab9dd"], //coral
    ["#d8f3dcdd", "#b7e4c7dd", "#95d5b2dd", "#74c69ddd", "#52b788dd"], //green
    ["#d7e3fcdd", "#ccdbfddd", "#c1d3fedd", "#b6ccfedd", "#abc4ffdd"], //blue
    ["#ff0a54dd", "#ff477edd", "#ff5c8add", "#ff7096dd", "#ff85a1dd"], //pink
    ["#ffee70dd", "#ffec5cdd", "#ffe747dd", "#ffe433dd", "#ffdd1fdd"] //yellow
]


// global settings
let style_interval;
let color_interval;
let rotation_interval;

let style_interval_time = 60000;
let color_interval_time = 60000;
let rotation_interval_time = 60000;

let random_color_change_enabled = true;
let random_rotation_change_enabled = true;

const active_color_palettes = [1,1,1,1,1,1,1];

function $id(id) { return document.getElementById(id) };
function getRandomNumber(min, max) { return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min) };

function applyRandomRotation() {
    document.documentElement.style.setProperty("--playful-hour-tens-rotation", `${getRandomNumber(-10, 10)}deg`);
    document.documentElement.style.setProperty("--playful-hour-ones-rotation", `${getRandomNumber(-10, 10)}deg`);
    document.documentElement.style.setProperty("--playful-dots-rotation", `${getRandomNumber(-10, 10)}deg`);
    document.documentElement.style.setProperty("--playful-minute-tens-rotation", `${getRandomNumber(-10, 10)}deg`);
    document.documentElement.style.setProperty("--playful-minute-ones-rotation", `${getRandomNumber(-10, 10)}deg`);
}

function applyRandomColorPalette() {
    let id = getRandomNumber(0, color_palette_playful.length - 1)
    let palette = color_palette_playful[id]
    playful_hour_tens.style.color = palette[0]
    playful_hour_ones.style.color = palette[1]
    playful_dots.style.color = palette[2]
    playful_minutes_tens.style.color = palette[3]
    playful_minutes_ones.style.color = palette[4]
}

function applyZeroRotation() {
    document.documentElement.style.setProperty("--playful-hour-tens-rotation", `0deg`);
    document.documentElement.style.setProperty("--playful-hour-ones-rotation", `0deg`);
    document.documentElement.style.setProperty("--playful-dots-rotation", `0deg`);
    document.documentElement.style.setProperty("--playful-minute-tens-rotation", `0deg`);
    document.documentElement.style.setProperty("--playful-minute-ones-rotation", `0deg`);
}

function updatePlayfulTime() {
    const now = new Date();
    const hours = String(now.getHours());
    const minutes = String(now.getMinutes());

    if (minutes.length == 1) {
        document.documentElement.style.setProperty("--playful-minute-tens-translation", 0);
        document.documentElement.style.setProperty("--playful-minute-ones-translation", `-${100 * Number(minutes[0])}dvh`);
    }

    if (minutes.length == 2) {
        document.documentElement.style.setProperty("--playful-minute-tens-translation", `-${100 * Number(minutes[0])}dvh`);
        document.documentElement.style.setProperty("--playful-minute-ones-translation", `-${100 * Number(minutes[1])}dvh`);
    }

    if (hours.length == 1) {
        document.documentElement.style.setProperty("--playful-hour-tens-translation", 0);
        document.documentElement.style.setProperty("--playful-hour-ones-translation", `-${100 * Number(hours[0])}dvh`);
    }

    if (hours.length == 2) {
        document.documentElement.style.setProperty("--playful-hour-tens-translation", `-${100 * Number(hours[0])}dvh`);
        document.documentElement.style.setProperty("--playful-hour-ones-translation", `-${100 * Number(hours[1])}dvh`);
    }
}

function updatePlayfulStyle() {
    applyRandomRotation()
    applyRandomColorPalette()
}

function startSyncedInterval(interval, callback) {
    let timeoutId = null;
    let stopped = false;

    function getNextDelay(interval) {
        const now = new Date();
        return interval - (now.getTime() % interval);
    }

    function scheduleNext() {
        if (stopped) return;
        const delay = getNextDelay(interval);
        timeoutId = setTimeout(() => {
            callback();
            scheduleNext();
        }, delay);
    }

    scheduleNext();

    return {
        stop() {
            stopped = true;
            clearTimeout(timeoutId);
        }
    };
}

function stopColorInterval() {
    if (color_interval) {
        color_interval.stop();
        color_interval = null;
    }
}

function stopRotationInterval() {
    if (rotation_interval) {
        rotation_interval.stop();
        rotation_interval = null;
    }
}

function stopStyleInterval() {
    if (style_interval) {
        style_interval.stop();
        style_interval = null;
    }
}

function init() {
    stopColorInterval();
    stopRotationInterval();
    stopStyleInterval();

    updatePlayfulTime();

    if (random_color_change_enabled && random_rotation_change_enabled) {
        updatePlayfulStyle();
    } else if (random_color_change_enabled) {
        applyRandomColorPalette()
    } else if (random_rotation_change_enabled) {
        applyRandomRotation()
    }

    startSyncedInterval(60000, updatePlayfulTime);

    if (random_color_change_enabled && random_rotation_change_enabled) {
        style_interval = startSyncedInterval(style_interval_time, updatePlayfulStyle);
    } else if (random_color_change_enabled) {
        color_interval = startSyncedInterval(color_interval_time, applyRandomColorPalette);
    } else if (random_rotation_change_enabled) {
        rotation_interval = startSyncedInterval(rotation_interval_time, applyRandomRotation);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    init();
});

$id("playful").addEventListener("click", function () {
    if (random_color_change_enabled && random_rotation_change_enabled) {
        updatePlayfulStyle();
    } else if (random_color_change_enabled) {
        applyRandomColorPalette()
    } else if (random_rotation_change_enabled) {
        applyRandomRotation()
    }
    showMenuButton()
})

const menu_button = $id("toggle-menu")
const menu = $id("menu")
let menu_button_clicked = false;

function showMenuButton() {
    menu.classList.add("show")
    setTimeout(() => {
        if (menu_button_clicked) {
            return
        }
        hideMenu()
    }, 10000)
}

function hideMenu() {
    menu.classList.remove("show")
}

menu_button.addEventListener("change", (event) => {
    const menu_opened = event.target.checked
    if (menu_opened) {
        menu_button_clicked = true
    } else {
        menu_button_clicked = false
        if (clicked_sub_menu_button.length > 0){
            back_to_main_menu()
        }
        hideMenu()
    }
})


const sub_menu = document.getElementsByClassName("sub-menu")[0]
const main_menu = document.getElementsByClassName("main-menu")[0]
const main_menu_button = document.getElementsByClassName("main-menu-button")
const color_sub_menu = document.getElementById("color-sub-menu")
const rotation_sub_menu = document.getElementById("rotation-sub-menu")
const credits_sub_menu = document.getElementById("credits-sub-menu")
const back_menu = document.getElementsByClassName("back")[0]

let clicked_sub_menu_button = "";

function main_menu_button_clicked(e) {
    clicked_sub_menu_button = e.target.value
    if (clicked_sub_menu_button == "color" || clicked_sub_menu_button == "rotation" || clicked_sub_menu_button == "credits") {
        hide_main_menu()
        setTimeout(() => {
            show_sub_menu()
        }, 250)
    }
    if (clicked_sub_menu_button == "color") {
        show_color_sub_menu()
    }
    if (clicked_sub_menu_button == "rotation") {
        show_rotation_sub_menu()
    }
    if (clicked_sub_menu_button == "credits") {
        show_credits_sub_menu()
    }
    if (clicked_sub_menu_button == "color" || clicked_sub_menu_button == "rotation" || clicked_sub_menu_button == "credits") {
        show_back_menu_button()
    } else {
        hide_back_menu_button()
    }
}

function show_main_menu() {
    main_menu.classList.remove("hide")
}

function hide_main_menu() {
    main_menu.classList.add("hide")
}

function show_sub_menu() {
    sub_menu.classList.add("show")
}

function hide_sub_menu() {
    sub_menu.classList.remove("show")
}


function show_color_sub_menu() {
    color_sub_menu.classList.add("show")
}

function hide_color_sub_menu() {
    color_sub_menu.classList.remove("show")
}

function show_rotation_sub_menu() {
    rotation_sub_menu.classList.add("show")
}

function hide_rotation_sub_menu() {
    rotation_sub_menu.classList.remove("show")
}

function show_credits_sub_menu() {
    credits_sub_menu.classList.add("show")
}

function hide_credits_sub_menu() {
    credits_sub_menu.classList.remove("show")
}


function show_back_menu_button() {
    back_menu.classList.add("show")
}

function hide_back_menu_button() {
    back_menu.classList.remove("show")
}

back_menu.addEventListener("click", back_to_main_menu)
function back_to_main_menu() {
    clicked_sub_menu_button = ""
    hide_back_menu_button()
    hide_sub_menu()
    setTimeout(() => {
        show_main_menu()
        hide_color_sub_menu()
        hide_rotation_sub_menu()
        hide_credits_sub_menu()
    }, 500)
}

for (const mmb of main_menu_button) {
    mmb.addEventListener("click", main_menu_button_clicked)
}