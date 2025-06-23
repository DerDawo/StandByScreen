class TimeoutOverlay {
    constructor(element) {
        this.element = element;
        this.timeout = null;
        this.isVisible = false;
        this.timeoutDuration = 5000; // default duration
        this.enabled = true;

        this.element.addEventListener('click', () => {
            if (!this.isVisible) return;
            this.hide();
        })
    }

    setEnabled(enabled) {
        this.enabled = enabled;
        if (!this.enabled) {
            this.hide();
        } else {
            this.show();
        }
    }

    setDuration(duration) {
        this.timeoutDuration = duration;
    }

    show() {
        if (this.isVisible) return;

        this.timeout = setTimeout(() => {
            this.element.classList.remove("hidden");
            this.element.classList.add("hide");
            setTimeout(() => {
                this.element.classList.remove("hide");
            }
                , 10);
            this.isVisible = true;

        }, this.timeoutDuration);
    }

    hide() {
        clearTimeout(this.timeout);

        this.element.classList.add("hide");

        setTimeout(
            () => { this.element.classList.add("hidden"); },
            500
        );

        this.isVisible = false;

        this.show(this.timeoutDuration)
    }

    reset() {
        this.hide();
    }

}

class PlayfulClock {
    constructor(element) {
        this.element = element;
        this.hourTens = element.getElementsByClassName("time")[0];
        this.hourOnes = element.getElementsByClassName("time")[1];
        this.dots = element.getElementsByClassName("time")[2];
        this.minutesTens = element.getElementsByClassName("time")[3];
        this.minutesOnes = element.getElementsByClassName("time")[4];
    }

    updateTime() {
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

    applyRandomRotation() {
        document.documentElement.style.setProperty("--playful-hour-tens-rotation", `${getRandomNumber(-10, 10)}deg`);
        document.documentElement.style.setProperty("--playful-hour-ones-rotation", `${getRandomNumber(-10, 10)}deg`);
        document.documentElement.style.setProperty("--playful-dots-rotation", `${getRandomNumber(-10, 10)}deg`);
        document.documentElement.style.setProperty("--playful-minute-tens-rotation", `${getRandomNumber(-10, 10)}deg`);
        document.documentElement.style.setProperty("--playful-minute-ones-rotation", `${getRandomNumber(-10, 10)}deg`);
    }

    applyRandomColorPalette() {
        // ensures that the selected is always an active on
        let active_color_palette_indexes = active_color_palettes.map((num, index) => num === 1 ? index : -1).filter(index => index !== -1);

        let id = getRandomItem(active_color_palette_indexes)

        // ensures that the selected palette is not the same as the previous one, 
        // when there is more then one active color
        if ((color_palette_id) && (active_color_palettes.filter((num) => { num === 1 }).length > 1)) {
            while ((id === color_palette_id)) {
                id = getRandomItem(active_color_palette_indexes);
            }
        }

        if (id === undefined) {
            this.hourTens.style.color = no_palette
            this.hourOnes.style.color = no_palette
            this.dots.style.color = no_palette
            this.minutesTens.style.color = no_palette
            this.minutesOnes.style.color = no_palette
            return
        }

        color_palette_id = id;
        let palette = color_palette_playful[color_palette_id];
        this.hourTens.style.color = palette[0]
        this.hourOnes.style.color = palette[1]
        this.dots.style.color = palette[2]
        this.minutesTens.style.color = palette[3]
        this.minutesOnes.style.color = palette[4]
    }

    applyZeroRotation() {
        document.documentElement.style.setProperty("--playful-hour-tens-rotation", `0deg`);
        document.documentElement.style.setProperty("--playful-hour-ones-rotation", `0deg`);
        document.documentElement.style.setProperty("--playful-dots-rotation", `0deg`);
        document.documentElement.style.setProperty("--playful-minute-tens-rotation", `0deg`);
        document.documentElement.style.setProperty("--playful-minute-ones-rotation", `0deg`);
    }
}

// main menu DOM elements
const main_menu = document.getElementsByClassName("main-menu")[0]
const menu_button = $id("toggle-menu")
const menu_overlay = $id("menu")

// main menu DOM functions
function showMenuButton() {
    showMenuOverlay()
    setTimeout(() => {
        if (menu_button_clicked) {
            return
        }
        hideMenuOverlay()
    }, 10000)
}

function showMenuOverlay() { menu_overlay.classList.add("show") }
function hideMenuOverlay() { menu_overlay.classList.remove("show") }

// main menu globals
let menu_button_clicked = false;

// sub menu DOM elements
const sub_menu = document.getElementsByClassName("sub-menu")[0]
const color_sub_menu = document.getElementById("color-sub-menu")
const rotation_sub_menu = document.getElementById("rotation-sub-menu")
const timeout_sub_menu = document.getElementById("timeout-sub-menu")
const credits_sub_menu = document.getElementById("credits-sub-menu")
const back_menu = document.getElementsByClassName("back")[0]

// sub menu DOM functions
function show_main_menu() { main_menu.classList.remove("hide") }
function hide_main_menu() { main_menu.classList.add("hide") }
function show_sub_menu() { sub_menu.classList.add("show") }
function hide_sub_menu() { sub_menu.classList.remove("show") }
function show_color_sub_menu() { color_sub_menu.classList.add("show") }
function hide_color_sub_menu() { color_sub_menu.classList.remove("show") }
function show_rotation_sub_menu() { rotation_sub_menu.classList.add("show") }
function hide_rotation_sub_menu() { rotation_sub_menu.classList.remove("show") }
function show_timeout_sub_menu() { timeout_sub_menu.classList.add("show") }
function hide_timeout_sub_menu() { timeout_sub_menu.classList.remove("show") }
function show_credits_sub_menu() { credits_sub_menu.classList.add("show") }
function hide_credits_sub_menu() { credits_sub_menu.classList.remove("show") }
function show_back_menu_button() { back_menu.classList.add("show") }
function hide_back_menu_button() { back_menu.classList.remove("show") }

// sub menu globals
let clicked_sub_menu_button = false;

// settings DOM elements
const color_button = $id("main-menu-color-button");
const rotation_button = $id("main-menu-rotatio-button");
const timeout_button = $id("main-menu-timeout-button");
const credtis_button = $id("main-menu-credits-button");
const random_color_rotation_checkbox = $id("random-color-rotation-checkbox");
const random_color_rotation_interval_select = $id("random-color-rotation-interval-select");
const timeout_darken_checkbox = $id("darken-screen-timeout-checkbox");
const palette_checkboxes = document.getElementsByClassName("palette-checkbox");
const random_digit_rotation_checkbox = $id("random-digit-rotation-checkbox");
const random_digit_rotation_interval_select = $id("random-digit-rotation-interval-select");
const timeout_interval_select = $id("darken-screen-timeout-interval-select");
const reset_color_settings_button = $id("reset-color-settings-button");
const straighten_digits_button = $id("straighten-digits-button");
const reset_rotation_settings_button = $id("reset-rotation-settings-button");
const reset_timeout_settings_button = $id("reset-timeout-settings-button");

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
const standard_rotation_interval_time = 900000;
const standard_timeout_interval_time = 900000;
const standard_random_color_change_enabled = true;
const standard_random_rotation_change_enabled = true;
const standard_active_color_palettes = [1, 1, 1, 1, 1, 1, 1];
const standard_timeout_darken_enabled = true;

// global settings
let color_interval;
let rotation_interval;
let timeout_interval;

let color_interval_time = standard_color_interval_time;
let rotation_interval_time = standard_rotation_interval_time;
let timeoutDuration = standard_timeout_interval_time;

let random_color_change_enabled = standard_random_color_change_enabled;
let random_rotation_change_enabled = standard_random_rotation_change_enabled;
let timeout_darken_enabled = standard_timeout_darken_enabled;

let active_color_palettes = [...standard_active_color_palettes];
let color_palette_id;

let init_settings = false;

// playful clock instance
const playful_clock = new PlayfulClock($id("playful"));

// timeout overlay instance
const timeout_overlay = new TimeoutOverlay($id("timeout-overlay"));
timeout_overlay.setDuration(timeoutDuration)

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

    timeout_darken_checkbox.checked = timeout_darken_enabled;
    timeout_interval_select.value = timeoutDuration;

    init_settings = true;
}

// the reset function need extra work
function resetColorSettings() {
    random_color_rotation_interval_select.value = standard_color_interval_time;
    random_color_rotation_checkbox.checked = standard_random_color_change_enabled;
    for (const pc of palette_checkboxes) {
        pc.checked = true;
    }
}

function resetRotationSettings() {
    random_digit_rotation_interval_select.value = standard_rotation_interval_time;
    random_digit_rotation_checkbox.checked = standard_random_rotation_change_enabled;
    playful_clock.applyZeroRotation();
}

function resetTimeoutSettings() {
    timeout_darken_checkbox.checked = standard_timeout_darken_enabled;
    timeout_interval_select.value = standard_timeout_interval_time;
}


function init() {
    stopColorInterval();
    stopRotationInterval();

    applyGlobalSettingsInDOM();

    playful_clock.updateTime()

    if (random_color_change_enabled) {
        playful_clock.applyRandomColorPalette()
    }
    if (random_rotation_change_enabled) {
        playful_clock.applyRandomRotation()
    }

    startSyncedInterval(60000, playful_clock.updateTime);

    if (random_color_change_enabled) {
        color_interval = startSyncedInterval(
            color_interval_time, 
            playful_clock.applyRandomColorPalette.bind(playful_clock)
        );
    }
    if (random_rotation_change_enabled) {
        rotation_interval = startSyncedInterval(
            rotation_interval_time, 
            playful_clock.applyRandomRotation
        );
    }

    if (timeout_darken_enabled) {
        timeout_overlay.show(timeoutDuration);
    }
}

// EventListeners
document.addEventListener('DOMContentLoaded', function () {
    init();
});

document.body.addEventListener("click", function () {
    timeout_overlay.reset()
});

playful_clock.element.addEventListener("click", function () {
    if (random_color_change_enabled) {
        playful_clock.applyRandomColorPalette();
    }
    if (random_rotation_change_enabled) {
        playful_clock.applyRandomRotation();
    }
    showMenuButton()
})

random_color_rotation_checkbox.addEventListener("change", function () {
    if (!init_settings) return
    random_color_change_enabled = random_color_rotation_checkbox.checked;
    stopColorInterval();
    if (random_color_change_enabled) {
        color_interval = startSyncedInterval(color_interval_time, playful_clock.applyRandomColorPalette.bind(playful_clock));
    }
})

random_color_rotation_interval_select.addEventListener("change", function () {
    if (!init_settings) return
    color_interval_time = Number(random_color_rotation_interval_select.value);
    if (color_interval) {
        stopColorInterval();
    }
    color_interval = startSyncedInterval(color_interval_time, playful_clock.applyRandomColorPalette.bind(playful_clock));
})

random_digit_rotation_checkbox.addEventListener("change", function () {
    if (!init_settings) return
    random_color_change_enabled = random_digit_rotation_checkbox.checked;
    stopRotationInterval();
    if (random_color_change_enabled) {
        rotation_interval = startSyncedInterval(rotation_interval_time, playful_clock.applyRandomRotation);
    }
})

random_digit_rotation_interval_select.addEventListener("change", function () {
    if (!init_settings) return
    rotation_interval_time = Number(random_digit_rotation_interval_select.value);
    if (rotation_interval) {
        stopRotationInterval();
    }
    rotation_interval = startSyncedInterval(rotation_interval_time, playful_clock.applyRandomRotation);
})

timeout_interval_select.addEventListener("change", function () {
    if (!init_settings) return
    timeoutDuration = Number(timeout_interval_select.value);
    timeout_overlay.setDuration(timeoutDuration);
})


menu_button.addEventListener("change", (event) => {
    const menu_opened = event.target.checked
    if (menu_opened) {
        menu_button_clicked = true
    } else {
        menu_button_clicked = false
        if (clicked_sub_menu_button) {
            clicked_sub_menu_button = false
            hide_back_menu_button()
            hide_sub_menu()
            setTimeout(() => {
                show_main_menu()
                hide_color_sub_menu()
                hide_rotation_sub_menu()
                hide_timeout_sub_menu()
                hide_credits_sub_menu()
            }, 500)
        }
        hideMenuOverlay()
    }
})

back_menu.addEventListener("click", function () {
    clicked_sub_menu_button = false
    hide_back_menu_button()
    hide_sub_menu()
    setTimeout(() => {
        show_main_menu()
        hide_color_sub_menu()
        hide_rotation_sub_menu()
        hide_timeout_sub_menu()
        hide_credits_sub_menu()
    }, 500)
})

color_button.addEventListener("click", function () {
    clicked_sub_menu_button = true
    hide_main_menu()
    setTimeout(() => {
        show_sub_menu()
    }, 250)
    show_color_sub_menu()
    show_back_menu_button()
})

rotation_button.addEventListener("click", function () {
    clicked_sub_menu_button = true
    hide_main_menu()
    setTimeout(() => {
        show_sub_menu()
    }, 250)
    show_rotation_sub_menu()
    show_back_menu_button()
})

timeout_button.addEventListener("click", function () {
    clicked_sub_menu_button = true
    hide_main_menu()
    setTimeout(() => {
        show_sub_menu()
    }, 250)
    show_timeout_sub_menu()
    show_back_menu_button()
})

credtis_button.addEventListener("click", function () {
    clicked_sub_menu_button = true
    hide_main_menu()
    setTimeout(() => {
        show_sub_menu()
    }, 250)
    show_credits_sub_menu()
    show_back_menu_button()
})

reset_color_settings_button.addEventListener("click", resetColorSettings)
straighten_digits_button.addEventListener("click", playful_clock.applyZeroRotation)
reset_rotation_settings_button.addEventListener("click", resetRotationSettings)
reset_timeout_settings_button.addEventListener("click", resetTimeoutSettings)

for (const pc of palette_checkboxes) {
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