class Settings {
    #randomColorChangeEnabled = true;
    #randomRotationChangeEnabled = true;
    #timeoutDarkenEnabled = true;
    #colorIntervalTime = 60000; // 1 minute
    #rotationIntervalTime = 60000; // 1 minute
    #timeoutDuration = 900000; // 15 minutes
    #activeColorPalettes = [1, 1, 1, 1, 1, 1, 1]; // all palettes active
    #colorPaletteId = 0; // default palette id

    constructor() {

        if (Settings._instance) {
            throw new Error("Settings can't be instantiated more than once.")
        }
        Settings._instance = this;

        this.randomColorChangeEnabled = this.#randomColorChangeEnabled;
        this.randomRotationChangeEnabled = this.#randomRotationChangeEnabled;
        this.timeoutDarkenEnabled = this.#timeoutDarkenEnabled;
        this.colorIntervalTime = this.#colorIntervalTime; // 1 minute
        this.rotationIntervalTime = this.#rotationIntervalTime; // 1 minute
        this.timeoutDuration = this.#timeoutDuration; // 15 minutes
        this.activeColorPalettes = this.#activeColorPalettes; // all palettes active
        this.colorPaletteId = this.#colorPaletteId; // default palette id
        this.appliedInDOM = false;
    }

    setRandomColorChangeEnabled(value) {
        this.randomColorChangeEnabled = value;
    }

    setRandomRotationChangeEnabled(value) {
        this.randomRotationChangeEnabled = value;
    }

    setTimeoutDarkenEnabled(value) {
        this.timeoutDarkenEnabled = value;
    }

    setColorIntervalTime(value) {
        this.colorIntervalTime = value;
    }

    setRotationIntervalTime(value) {
        this.rotationIntervalTime = value;
    }

    setTimeoutDuration(value) {
        this.timeoutDuration = value;
    }

    setActiveColorPalettes(value) {
        if (Array.isArray(value) && value.length === 7) {
            this.activeColorPalettes = value;
        } else {
            console.error("Invalid color palettes array");
        }
    }

    setColorPaletteId(value) {
        this.colorPaletteId = value;
    }

    log() {
        console.log("Settings:");
        console.log("Random Color Change Enabled:", this.randomColorChangeEnabled);
        console.log("Random Rotation Change Enabled:", this.randomRotationChangeEnabled);
        console.log("Timeout Darken Enabled:", this.timeoutDarkenEnabled);
        console.log("Color Interval Time:", this.colorIntervalTime);
        console.log("Rotation Interval Time:", this.rotationIntervalTime);
        console.log("Timeout Duration:", this.timeoutDuration);
        console.log("Active Color Palettes:", this.activeColorPalettes);
        console.log("Color Palette ID:", this.colorPaletteId);
    }

    applyAllInDOM() {
        random_color_rotation_checkbox.checked = this.randomColorChangeEnabled;
        random_color_rotation_interval_select.value = this.colorIntervalTime;

        for (let i = 0; i < palette_checkboxes.length; i++) {
            palette_checkboxes[i].checked = this.activeColorPalettes[i] === 1;
        }

        random_digit_rotation_checkbox.checked = this.randomRotationChangeEnabled;
        random_digit_rotation_interval_select.value = this.rotationIntervalTime;

        timeout_darken_checkbox.checked = this.timeoutDarkenEnabled;
        timeout_interval_select.value = this.timeoutDuration;

        this.appliedInDOM = true;
    }

    resetColorSettings() {
        this.setRandomColorChangeEnabled(this.#randomColorChangeEnabled);
        this.setColorIntervalTime(this.#colorIntervalTime);
        this.setActiveColorPalettes([...this.#activeColorPalettes]);
        this.applySettingsInDOM();
    }

    resetRotationSettings() {
        this.setRandomRotationChangeEnabled(this.#randomRotationChangeEnabled);
        this.setRotationIntervalTime(this.#rotationIntervalTime);
        this.applySettingsInDOM();
    }

    resetTimeoutSettings() {
        this.setTimeoutDarkenEnabled(this.#timeoutDarkenEnabled);
        this.setTimeoutDuration(this.#timeoutDuration);
        this.applySettingsInDOM();
    }

    applySettingsInDOM() {
        this.applyAllInDOM()
    }

}

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
        let active_color_palette_indexes = settings.activeColorPalettes.map((num, index) => num === 1 ? index : -1).filter(index => index !== -1);

        let id = getRandomItem(active_color_palette_indexes)

        // ensures that the selected palette is not the same as the previous one, 
        // when there is more then one active color
        if ((settings.colorPaletteId) && (settings.activeColorPalettes.filter((num) => { num === 1 }).length > 1)) {
            while ((id === settings.colorPaletteId)) {
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

        settings.colorPaletteId = id;
        let palette = color_palette_playful[settings.colorPaletteId];
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

class MainMenu {
    constructor(element) {
        this.element = element;
        this.toggleButton = $id("toggle-menu");
        this.overlay = $id("menu");
        this.toggleButtonClicked = false;
        this.backButton = document.getElementsByClassName("back")[0];
        this.subMenuWrapper = document.getElementsByClassName("sub-menu")[0];
        this.subMenuButtonClicked = false;
        this.subMenuButtons = [];
        this.subMenus = [];

        this.toggleButton.addEventListener("change", (event) => {
            if (event.target.checked) {
                this.toggleButtonClicked = true
            } else {
                this.toggleButtonClicked = false
                if (this.subMenuButtonClicked) {
                    this.backToMainMenu()
                }
                this.hideOverlay()
            }
        })
        this.backButton.addEventListener("click", this.backToMainMenu.bind(this));

    }

    setSubMenus(subMenus) {
        this.subMenus = subMenus;
    }

    setSubMenuButtons(subMenuButtons) {
        this.subMenuButtons = subMenuButtons;
    }

    showToggleButton() {
        this.showOverlay()
        setTimeout(() => {
            if (this.toggleButtonClicked) {
                return
            }
            this.hideOverlay()
        }, 10000)
    }

    show() {
        this.element.classList.remove("hide")
    }

    hide() {
        this.element.classList.add("hide")
    }

    showOverlay() {
        this.overlay.classList.add("show")
    }

    hideOverlay() {
        this.overlay.classList.remove("show")
    }

    showSubMenuWrapper() {
        this.subMenuWrapper.classList.add("show")
    }

    hideSubMenuWrapper() {
        this.subMenuWrapper.classList.remove("show")
    }

    showBackButton() {
        this.backButton.classList.add("show")
    }

    hideBackButton() {
        this.backButton.classList.remove("show")
    }

    backToMainMenu() {
        this.subMenuButtonClicked = false
        this.hideBackButton()
        this.hideSubMenuWrapper()
        setTimeout(() => {
            main_menu.show()
            for (const subMenu of this.subMenus) {
                subMenu.hide();
            }
        }, 500)
    }

    openSubMenu(subMenu) {
        this.subMenuButtonClicked = true;
        this.hide();
        setTimeout(() => {
            this.showSubMenuWrapper();
        }, 250);
        subMenu.show();
        this.showBackButton();
    }

}

class SubMenu {
    constructor(element) {
        this.element = element;
    }

    show() {
        this.element.classList.add("show");
    }

    hide() {
        this.element.classList.remove("show");
    }
}

class SubMenuButton {
    constructor(element, mainMenu, subMenu) {
        this.element = element;
        this.mainMenu = mainMenu;
        this.subMenu = subMenu;

        this.element.addEventListener("click", this.openSubMenu.bind(this));
    }

    openSubMenu() {
        this.mainMenu.openSubMenu(this.subMenu);
    }
}

class SyncedInterval {
    constructor(interval, callback, name) {
        this.interval = interval;
        this.callback = callback;
        this.timeoutId = null;
        this.stopped = false;
        this.name = name;
    }

    setInterval(interval) {
        this.interval = interval;
        if (this.stopped) return;
        this.restart();
    }

    start() {
        this.stopped = false;
        this.scheduleNext();
    }

    getNextDelay() {
        const now = new Date();
        return this.interval - (now.getTime() % this.interval);
    }

    scheduleNext() {
        if (this.stopped) return;
        const delay = this.getNextDelay();
        this.timeoutId = setTimeout(() => {
            this.callback();
            this.scheduleNext();
        }, delay);
    }

    stop() {
        this.stopped = true;
        clearTimeout(this.timeoutId);
    }

    restart() {
        this.stop();
        this.start();
    }
}

// settings DOM elements
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

// settings instance
const settings = new Settings();

// playful clock instance
const playful_clock = new PlayfulClock($id("playful"));

// timeout overlay instance
const timeout_overlay = new TimeoutOverlay($id("timeout-overlay"));
timeout_overlay.setDuration(settings.timeoutDuration);

// main menu instance
const main_menu = new MainMenu(document.getElementsByClassName("main-menu")[0]);

// sub menu instances
const color_sub_menu = new SubMenu($id("color-sub-menu"));
const rotation_sub_menu = new SubMenu($id("rotation-sub-menu"));
const timeout_sub_menu = new SubMenu($id("timeout-sub-menu"));
const credits_sub_menu = new SubMenu($id("credits-sub-menu"));

// sub menu button instances
const color_sub_menu_button = new SubMenuButton(
    $id("main-menu-color-button"),
    main_menu,
    color_sub_menu
);
const rotation_sub_menu_button = new SubMenuButton(
    $id("main-menu-rotatio-button"),
    main_menu,
    rotation_sub_menu
);
const timeout_sub_menu_button = new SubMenuButton(
    $id("main-menu-timeout-button"),
    main_menu,
    timeout_sub_menu
);
const credits_sub_menu_button = new SubMenuButton(
    $id("main-menu-credits-button"),
    main_menu,
    credits_sub_menu
);

// intervals
const timeInterval = new SyncedInterval(
    60000,
    playful_clock.updateTime.bind(playful_clock),
    "Time"
);
const colorInterval = new SyncedInterval(
    settings.colorIntervalTime,
    playful_clock.applyRandomColorPalette.bind(playful_clock),
    "Color"
);
const rotationInterval = new SyncedInterval(
    settings.rotationIntervalTime,
    playful_clock.applyRandomRotation.bind(playful_clock),
    "Rotation"
);

main_menu.setSubMenus([
    color_sub_menu,
    rotation_sub_menu,
    timeout_sub_menu,
    credits_sub_menu]);

main_menu.setSubMenuButtons([
    color_sub_menu_button,
    rotation_sub_menu_button,
    timeout_sub_menu_button,
    credits_sub_menu_button
]);

// utility functions
function $id(id) { return document.getElementById(id) };
function getRandomNumber(min, max) { return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min) };
function getRandomItem(list) { return list[Math.floor(Math.random() * list.length)] };

// Initialize the application
function init() {
    settings.applyAllInDOM();

    playful_clock.updateTime()

    if (settings.randomColorChangeEnabled) {
        playful_clock.applyRandomColorPalette(settings.activeColorPalettes);
    }
    if (settings.randomRotationChangeEnabled) {
        playful_clock.applyRandomRotation()
    }

    timeInterval.start();

    if (settings.randomColorChangeEnabled) {
        colorInterval.start()
    }

    if (settings.randomRotationChangeEnabled) {
        rotationInterval.start()
    }

    if (settings.timeoutDarkenEnabled) {
        timeout_overlay.show(settings.timeoutDuration);
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
    if (settings.randomColorChangeEnabled) {
        playful_clock.applyRandomColorPalette(settings.activeColorPalettes);
    }
    if (settings.randomRotationChangeEnabled) {
        playful_clock.applyRandomRotation();
    }
    main_menu.showToggleButton()
})

random_color_rotation_checkbox.addEventListener("change", function () {
    if (!settings.appliedInDOM) return
    settings.setRandomColorChangeEnabled(random_color_rotation_checkbox.checked);
    colorInterval.stop();
    if (settings.randomColorChangeEnabled) {
        colorInterval.start();
    }
})

random_color_rotation_interval_select.addEventListener("change", function () {
    if (!settings.appliedInDOM) return
    settings.setColorIntervalTime(Number(random_color_rotation_interval_select.value));
    colorInterval.setInterval(settings.colorIntervalTime);
})

random_digit_rotation_checkbox.addEventListener("change", function () {
    if (!settings.appliedInDOM) return
    settings.setRandomRotationChangeEnabled(random_digit_rotation_checkbox.checked);
    rotationInterval.stop();
    if (settings.randomRotationChangeEnabled) {
        rotationInterval.start();
    }
})

random_digit_rotation_interval_select.addEventListener("change", function () {
    if (!settings.appliedInDOM) return
    settings.setRotationIntervalTime(Number(random_digit_rotation_interval_select.value));
    rotationInterval.setInterval(settings);
})

timeout_interval_select.addEventListener("change", function () {
    if (!settings.appliedInDOM) return
    settings.setTimeoutDuration(Number(timeout_interval_select.value));
    timeout_overlay.setDuration(settings.timeoutDuration);
})

reset_color_settings_button.addEventListener("click", settings.resetColorSettings.bind(settings))
straighten_digits_button.addEventListener("click", playful_clock.applyZeroRotation)
reset_rotation_settings_button.addEventListener("click", settings.resetRotationSettings.bind(settings))
reset_timeout_settings_button.addEventListener("click", settings.resetTimeoutSettings.bind(settings))

for (const pc of palette_checkboxes) {
    pc.addEventListener("change", function (e) {
        if (!settings.appliedInDOM) return
        const inputs = Array.from(e.target.parentElement.children).filter((el) => el.tagName === "INPUT");
        const index = inputs.indexOf(e.target);
        if (e.target.checked) {
            settings.activeColorPalettes[index] = 1;
        } else {
            settings.activeColorPalettes[index] = 0;
        }
    })
}