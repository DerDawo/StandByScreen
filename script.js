// playful clock DOM elements
const playful_clock = $id("playful");
const playful_hour_tens = $id("playful").getElementsByClassName("time")[0]
const playful_hour_ones = $id("playful").getElementsByClassName("time")[1]
const playful_dots = $id("playful").getElementsByClassName("time")[2]
const playful_minutes_tens = $id("playful").getElementsByClassName("time")[3]
const playful_minutes_ones = $id("playful").getElementsByClassName("time")[4]

// settings DOM elements
const random_color_rotation_checkbox = $id("random-color-rotation-checkbox");
const random_color_rotation_interval_select = $id("random-color-rotation-interval-select");
const palette_checkboxes = document.getElementsByClassName("palette-checkbox");
const random_digit_rotation_checkbox = $id("random-digit-rotation-checkbox");
const random_digit_rotation_interval_select = $id("random-digit-rotation-interval-select");
const reset_color_settings_button = $id("reset-color-settings-button");
const straighten_digits_button = $id("straighten-digits-button");
const reset_rotation_settings_button = $id("reset-rotation-settings-button");

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

const no_palette = "#ffffffdd" // white

// standard settings
const standard_style_interval_time = 60000;
const standard_color_interval_time = 60000;
const standard_rotation_interval_time = 60000;
const standard_random_color_change_enabled = true;
const standard_random_rotation_change_enabled = true;
const standard_active_color_palettes = [1,1,1,1,1,1,1];

// global settings
let color_interval;
let rotation_interval;

let style_interval_time = standard_style_interval_time;
let color_interval_time = standard_color_interval_time;
let rotation_interval_time = standard_rotation_interval_time;

let random_color_change_enabled = standard_random_color_change_enabled;
let random_rotation_change_enabled = standard_random_rotation_change_enabled;

let active_color_palettes = [...standard_active_color_palettes];
let color_palette_id;

let init_settings = false;

// utility functions
function $id(id) { return document.getElementById(id) };
function getRandomNumber(min, max) { return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min) };
function getRandomItem(list) { return list[Math.floor(Math.random() * list.length)] };

// function to start a synced interval
/**
 * Starts a synced interval that executes a callback function at regular intervals.
 * The interval is synchronized to the current time, ensuring that the callback
 * is executed at the same time every minute.
 *
 * @param {number} interval - The interval in milliseconds.
 * @param {function} callback - The function to be executed at each interval.
 * @returns {object} An object with a stop method to stop the interval.
 */
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

function applyRandomRotation() {
    document.documentElement.style.setProperty("--playful-hour-tens-rotation", `${getRandomNumber(-10, 10)}deg`);
    document.documentElement.style.setProperty("--playful-hour-ones-rotation", `${getRandomNumber(-10, 10)}deg`);
    document.documentElement.style.setProperty("--playful-dots-rotation", `${getRandomNumber(-10, 10)}deg`);
    document.documentElement.style.setProperty("--playful-minute-tens-rotation", `${getRandomNumber(-10, 10)}deg`);
    document.documentElement.style.setProperty("--playful-minute-ones-rotation", `${getRandomNumber(-10, 10)}deg`);
}

function applyRandomColorPalette() {

    // ensures that the selected is always an active on
    let active_color_palette_indexes = active_color_palettes.map((num, index) => num === 1 ? index : -1).filter(index => index !== -1);

    let id = getRandomItem(active_color_palette_indexes)

    // ensures that the selected palette is not the same as the previous one, 
    // when there is more then one active color
    if ((color_palette_id) && (active_color_palettes.filter((num)=>{num===1}).length > 1)){
        while ((id === color_palette_id)) {
            id = getRandomItem(active_color_palette_indexes);
        }
    }

    if (id === undefined){
        playful_hour_tens.style.color = no_palette
        playful_hour_ones.style.color = no_palette
        playful_dots.style.color = no_palette
        playful_minutes_tens.style.color = no_palette
        playful_minutes_ones.style.color = no_palette
        return
    }

    color_palette_id = id;
    let palette = color_palette_playful[color_palette_id];
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

function applyGlobalSettingsInDOM() {
    random_color_rotation_checkbox.checked = random_color_change_enabled;
    random_color_rotation_interval_select.value = color_interval_time;
    
    for (let i = 0; i < palette_checkboxes.length; i++) {
        palette_checkboxes[i].checked = active_color_palettes[i] === 1;
    }
    
    random_digit_rotation_checkbox.checked = random_rotation_change_enabled;
    random_digit_rotation_interval_select.value = rotation_interval_time;
    init_settings = true;
}

// the reset function need extra work
function resetColorSettings(){
    random_color_rotation_interval_select.value = standard_color_interval_time;
    random_color_rotation_checkbox.checked = standard_random_color_change_enabled;
    for (const pc of palette_checkboxes){
        pc.checked = true;
    }
}

function resetRotationSettings(){
    random_digit_rotation_interval_select.value = standard_rotation_interval_time;
    random_digit_rotation_checkbox.checked = standard_random_rotation_change_enabled;
    applyZeroRotation();
}

function playful_clock_clicked(){
    if (random_color_change_enabled) {
        applyRandomColorPalette();
    }
    if (random_rotation_change_enabled) {
        applyRandomRotation();
    }
    showMenuButton();
}

function init() {
    stopColorInterval();
    stopRotationInterval();

    applyGlobalSettingsInDOM();

    updatePlayfulTime();

    if (random_color_change_enabled) {
        applyRandomColorPalette()
    }
    if (random_rotation_change_enabled) {
        applyRandomRotation()
    }

    startSyncedInterval(60000, updatePlayfulTime);

    if (random_color_change_enabled) {
        color_interval = startSyncedInterval(color_interval_time, applyRandomColorPalette);
    }
    if (random_rotation_change_enabled) {
        rotation_interval = startSyncedInterval(rotation_interval_time, applyRandomRotation);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    init();
});

playful_clock.addEventListener("click", function () {
    if (random_color_change_enabled) {
        applyRandomColorPalette()
    }
    if (random_rotation_change_enabled) {
        applyRandomRotation()
    }
    showMenuButton()
})

random_color_rotation_checkbox.addEventListener("change", function () {
    if (!init_settings) return
    random_color_change_enabled = random_color_rotation_checkbox.checked;
    stopColorInterval();
    if (random_color_change_enabled) {
        color_interval = startSyncedInterval(color_interval_time, applyRandomColorPalette);
    }
})

random_color_rotation_interval_select.addEventListener("change", function () {
    if (!init_settings) return
    color_interval_time = Number(random_color_rotation_interval_select.value);
    if (color_interval) {
        stopColorInterval();
    } 
    color_interval = startSyncedInterval(color_interval_time, applyRandomColorPalette);
})

random_digit_rotation_checkbox.addEventListener("change", function () {
    if (!init_settings) return
    random_color_change_enabled = random_digit_rotation_checkbox.checked;
    stopRotationInterval();
    if (random_color_change_enabled) {
        rotation_interval = startSyncedInterval(rotation_interval_time, applyRandomRotation);
    }
})

random_digit_rotation_interval_select.addEventListener("change", function () {
    if (!init_settings) return
    rotation_interval_time = Number(random_digit_rotation_interval_select.value);
    if (rotation_interval) {
        stopRotationInterval();
    }
    rotation_interval = startSyncedInterval(rotation_interval_time, applyRandomRotation);
})

reset_color_settings_button.addEventListener("click",resetColorSettings)
straighten_digits_button.addEventListener("click",applyZeroRotation)
reset_rotation_settings_button.addEventListener("click",resetRotationSettings)

for (const pc of palette_checkboxes){
    pc.addEventListener("change", function (e) {
        if (!init_settings) return
        const inputs = Array.from(e.target.parentElement.children).filter((el) => el.tagName === "INPUT");
        const index = inputs.indexOf(e.target);
        if (e.target.checked) {
            active_color_palettes[index] = 1;
        } else {
            active_color_palettes[index] = 0;
        }
    })
} 

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
        if (clicked_sub_menu_button.length > 0) {
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