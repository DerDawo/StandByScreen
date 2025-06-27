class App {
    constructor() {
        if (App._instance) {
            throw new Error("App can't be instantiated more than once.")
        }
        App._instance = this;
    }

    initialize() {
        settings.applyAllInDOM();

        nunito_clock.updateTime()

        if (settings.randomColorChangeEnabled) {
            app.applyRandomColorPalette();
        }
        if (settings.randomRotationChangeEnabled) {
            nunito_clock.applyRandomRotation()
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
            nunito_clock.applyNoPalette();
            kenia_clock.applyNoPalette();
            sixcaps_clock.applyNoPalette();
            badeen_clock.applyNoPalette();
            return
        }

        settings.colorPaletteId = id;
        nunito_clock.applyColorPalette();
        kenia_clock.applyColorPalette();
        sixcaps_clock.applyColorPalette();
        badeen_clock.applyColorPalette();
    }

}

class Settings {
    #randomColorChangeEnabled = true;
    #randomRotationChangeEnabled = true;
    #timeoutDarkenEnabled = true;
    #colorIntervalTime = 60000; // 1 minute
    #rotationIntervalTime = 60000; // 1 minute
    #timeoutDuration = 900000; // 15 minutes
    #colorPalettes = [
        ["#cc5803dd", "#e2711ddd", "#ff9505dd", "#ffb627dd", "#ffc971dd"], //orange
        ["#ffd6ffdd", "#e7c6ffdd", "#c8b6ffdd", "#b8c0ffdd", "#bbd0ffdd"], //purple
        ["#f08080dd", "#f4978edd", "#f8ad9ddd", "#fbc4abdd", "#ffdab9dd"], //coral
        ["#d8f3dcdd", "#b7e4c7dd", "#95d5b2dd", "#74c69ddd", "#52b788dd"], //green
        ["#d7e3fcdd", "#ccdbfddd", "#c1d3fedd", "#b6ccfedd", "#abc4ffdd"], //blue
        ["#ff0a54dd", "#ff477edd", "#ff5c8add", "#ff7096dd", "#ff85a1dd"], //pink
        ["#ffee70dd", "#ffec5cdd", "#ffe747dd", "#ffe433dd", "#ffdd1fdd"] //yellow
    ]
    #activeColorPalettes = this.#colorPalettes.map(function () { return 1 }); // all palettes active
    #colorPaletteId = 0; // default palette id
    #noPalette = "#ffffffdd";
    #fonts = ["Nunito", "Kenia", "SixCaps", "BadeenDisplay"];

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
        this.colorPalettes = this.#colorPalettes; // predefined color palettes
        this.activeColorPalettes = this.#activeColorPalettes; // all palettes active
        this.colorPaletteId = this.#colorPaletteId; // default palette id
        this.noPalette = this.#noPalette;
        this.fonts = this.#fonts; // predefined fonts
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
        color_sub_menu.colorRotationCheckbox.checked = this.randomColorChangeEnabled;
        color_sub_menu.colorRotationIntervalSelect.value = this.colorIntervalTime;

        for (let i = 0; i < color_sub_menu.paletteCheckboxes.length; i++) {
            color_sub_menu.paletteCheckboxes[i].checked = this.activeColorPalettes[i] === 1;
        }

        rotation_sub_menu.randomDigitRotationCheckbox.checked = this.randomRotationChangeEnabled;
        rotation_sub_menu.randomDigitRotationIntervalSelect.value = this.rotationIntervalTime;

        timeout_sub_menu.timeoutDarkenCheckbox.checked = this.timeoutDarkenEnabled;
        timeout_sub_menu.timeoutIntervalSelect.value = this.timeoutDuration;

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
    constructor() {
        this.element = $id("timeout-overlay");
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

class FontSlider {
    constructor() {
        this.slider = document.getElementsByClassName("slider")[0];
        this.slidesContainer = document.getElementsByClassName("slides")[0];
        this.slides = Array.from(this.slidesContainer.children);
        this.totalSlides = this.slides.length;

        this.currentIndex = 0;
        this.startX = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        this.isDragging = false;
        this.animationID = 0;

        // Bind Events
        this.slidesContainer.addEventListener('touchstart', this.touchStart.bind(this), { passive: true });
        this.slidesContainer.addEventListener('touchmove', this.touchMove.bind(this), { passive: true });
        this.slidesContainer.addEventListener('touchend', this.touchEnd.bind(this));

        this.slidesContainer.addEventListener('mousedown', this.touchStart.bind(this));
        this.slidesContainer.addEventListener('mousemove', this.touchMove.bind(this));
        this.slidesContainer.addEventListener('mouseup', this.touchEnd.bind(this));
        this.slidesContainer.addEventListener('mouseleave', () => this.isDragging && this.touchEnd().bind(this));

        // Handle resize
        window.addEventListener('resize', this.setSlidePositionByIndex.bind(this));

    }

    // Core translate logic
    setSliderPosition() {
        this.slidesContainer.style.transform = `translateX(${this.currentTranslate}px)`;
    }

    animation() {
        this.setSliderPosition();
        if (this.isDragging) requestAnimationFrame(this.animation.bind(this));
    }

    getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }

    // Dragging handlers
    touchStart(e) {
        this.isDragging = true;
        this.startX = this.getPositionX(e);
        this.animationID = requestAnimationFrame(this.animation.bind(this));
        this.slidesContainer.style.transition = 'none';
    }

    touchMove(e) {
        if (!this.isDragging) return;
        const dx = this.getPositionX(e) - this.startX;
        this.currentTranslate = this.prevTranslate + dx;
    }

    touchEnd() {
        cancelAnimationFrame(this.animationID);
        this.isDragging = false;

        const movedBy = this.currentTranslate - this.prevTranslate;

        if (movedBy < -50 && this.currentIndex < this.totalSlides - 1) {
            this.currentIndex++;
            font_snackbar.show(settings.fonts[this.currentIndex])
        }
        else if (movedBy > 50 && this.currentIndex > 0){
            this.currentIndex--;
            font_snackbar.show(settings.fonts[this.currentIndex])
        } 

        this.setSlidePositionByIndex()
    }

    setSlidePositionByIndex() {
        this.currentTranslate = -this.currentIndex * this.slider.offsetWidth;
        this.prevTranslate = this.currentTranslate;
        this.slidesContainer.style.transition = 'transform 0.3s ease';
        this.setSliderPosition();
    }
}

class FontSnackBar {
    constructor() {
        this.container = $id('snackbar-container');
        this.currentSnackbar = null;
        this.fadeTimeout = null;
        this.removeTimeout = null;
    }

    show(message, duration = 3000) {

        // If one exists, fade it out first
        if (this.currentSnackbar) {
            clearTimeout(this.fadeTimeout);
            clearTimeout(this.removeTimeout);

            this.currentSnackbar.classList.remove('show'); // starts fade out

            // After fade-out transition, remove it and show new one
            this.fadeTimeout = setTimeout(() => {
                this.container.removeChild(this.currentSnackbar);
                this.currentSnackbar = null;
                this.#createAndShow(message, duration);
            }, 300); // must match CSS transition duration
        } else {
            this.#createAndShow(message, duration);
        }
    }

    #createAndShow(message, duration) {
        const snackbar = document.createElement('div');
        snackbar.className = 'snackbar';
        snackbar.textContent = message;

        this.container.appendChild(snackbar);

        // Force reflow to ensure the transition starts
        void snackbar.offsetWidth;
        snackbar.classList.add('show');

        this.currentSnackbar = snackbar;
        console.log()
        // Auto-dismiss after `duration`
        this.removeTimeout = setTimeout(() => {
            snackbar.classList.remove('show');
            // Remove from DOM after fade-out
            this.fadeTimeout = setTimeout(() => {
                if (snackbar.parentNode) snackbar.parentNode.removeChild(snackbar);
                this.currentSnackbar = null;
            }, 300);
        }, duration);
    }

}

class Clock {
    constructor(element) {
        this.element = element;
        this.hourTens = this.element.getElementsByClassName("time")[0];
        this.hourOnes = this.element.getElementsByClassName("time")[1];
        this.dots = this.element.getElementsByClassName("time")[2];
        this.minutesTens = this.element.getElementsByClassName("time")[3];
        this.minutesOnes = this.element.getElementsByClassName("time")[4];

        this.element.addEventListener("click", this.clockClicked.bind(this));
        this.updateTime();
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

    clockClicked() {
        app.applyRandomColorPalette();
        main_menu.showToggleButton();
    }

    cycleThroughColorPalettes() {
        let active_color_palette_indexes = settings.activeColorPalettes.map((num, index) => num === 1 ? index : -1).filter(index => index !== -1);

        if (active_color_palette_indexes.length === 0) {
            this.applyNoPalette();
            return;
        }

        settings.colorPaletteId = (settings.colorPaletteId + 1) % active_color_palette_indexes.length;
        if (settings.colorPaletteId === 0) {
            settings.colorPaletteId = active_color_palette_indexes[0];
        }
        this.applyColorPalette();
    }

    applyColorPalette() {
        let palette = settings.colorPalettes[settings.colorPaletteId];
        this.hourTens.style.color = palette[0]
        this.hourOnes.style.color = palette[1]
        this.dots.style.color = palette[2]
        this.minutesTens.style.color = palette[3]
        this.minutesOnes.style.color = palette[4]
    }

    applyNoPalette() {
        this.hourTens.style.color = settings.noPalette
        this.hourOnes.style.color = settings.noPalette
        this.dots.style.color = settings.noPalette
        this.minutesTens.style.color = settings.noPalette
        this.minutesOnes.style.color = settings.noPalette
    }
}

class KeniaClock extends Clock {
    constructor() {
        super($id("kenia"));
    }
}

class SixCapsClock extends Clock {
    constructor() {
        super($id("sixcaps"));
    }
}

class BadeenClock extends Clock {
    constructor() {
        super($id("badeen"));
    }
}

class NunitoClock extends Clock {
    constructor() {
        super($id("nunito"));
    }

    applyRandomRotation() {
        document.documentElement.style.setProperty("--playful-hour-tens-rotation", `${getRandomNumber(-10, 10)}deg`);
        document.documentElement.style.setProperty("--playful-hour-ones-rotation", `${getRandomNumber(-10, 10)}deg`);
        document.documentElement.style.setProperty("--playful-dots-rotation", `${getRandomNumber(-10, 10)}deg`);
        document.documentElement.style.setProperty("--playful-minute-tens-rotation", `${getRandomNumber(-10, 10)}deg`);
        document.documentElement.style.setProperty("--playful-minute-ones-rotation", `${getRandomNumber(-10, 10)}deg`);
    }

    applyZeroRotation() {
        document.documentElement.style.setProperty("--playful-hour-tens-rotation", `0deg`);
        document.documentElement.style.setProperty("--playful-hour-ones-rotation", `0deg`);
        document.documentElement.style.setProperty("--playful-dots-rotation", `0deg`);
        document.documentElement.style.setProperty("--playful-minute-tens-rotation", `0deg`);
        document.documentElement.style.setProperty("--playful-minute-ones-rotation", `0deg`);
    }

    clockClicked() {
        if (settings.randomColorChangeEnabled) {
            app.applyRandomColorPalette();
        }
        if (settings.randomRotationChangeEnabled) {
            this.applyRandomRotation();
        }
        main_menu.showToggleButton();
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

class ColorSubMenu extends SubMenu {
    constructor(element) {
        super(element);
        this.element = element;
        this.colorRotationCheckbox = $id("random-color-rotation-checkbox");
        this.colorRotationIntervalSelect = $id("random-color-rotation-interval-select");
        this.paletteCheckboxes = document.getElementsByClassName("palette-checkbox");
        this.resetColorSettingsButton = $id("reset-color-settings-button");

        this.colorRotationCheckbox.addEventListener("change", this.toggleColorRotation.bind(this));
        this.colorRotationIntervalSelect.addEventListener("change", this.setColorRotationInterval.bind(this));
        for (const checkbox of this.paletteCheckboxes) {
            checkbox.addEventListener("change", this.togglePalette.bind(this));
        }
    }

    toggleColorRotation() {
        if (!settings.appliedInDOM) return;
        settings.setRandomColorChangeEnabled(this.colorRotationCheckbox.checked);
        colorInterval.stop();
        if (settings.randomColorChangeEnabled) {
            colorInterval.start();
        }
    }

    setColorRotationInterval() {
        if (!settings.appliedInDOM) return;
        settings.setColorIntervalTime(Number(this.colorRotationIntervalSelect.value));
        colorInterval.setInterval(settings.colorIntervalTime);
    }

    resetColorSettings() {
        settings.resetColorSettings();
        app.applyRandomColorPalette();
    }

    togglePalette(e) {
        if (!settings.appliedInDOM) return;
        const inputs = Array.from(e.target.parentElement.children).filter((el) => el.tagName === "INPUT");
        const index = inputs.indexOf(e.target);
        if (e.target.checked) {
            settings.activeColorPalettes[index] = 1;
        } else {
            settings.activeColorPalettes[index] = 0;
        }
    }
}

class RotationSubMenu extends SubMenu {
    constructor(element) {
        super(element);
        this.element = element;
        this.randomDigitRotationCheckbox = $id("random-digit-rotation-checkbox");
        this.randomDigitRotationIntervalSelect = $id("random-digit-rotation-interval-select");
        this.straightenDigitsButton = $id("straighten-digits-button");
        this.resetRotationSettingsButton = $id("reset-rotation-settings-button");

        this.randomDigitRotationCheckbox.addEventListener("change", this.toggleRandomRotation.bind(this));
        this.randomDigitRotationIntervalSelect.addEventListener("change", this.setRandomRotationInterval.bind(this));
    }

    toggleRandomRotation() {
        if (!settings.appliedInDOM) return;
        settings.setRandomRotationChangeEnabled(this.randomDigitRotationCheckbox.checked);
        rotationInterval.stop();
        if (settings.randomRotationChangeEnabled) {
            rotationInterval.start();
        }
    }

    setRandomRotationInterval() {
        if (!settings.appliedInDOM) return;
        settings.setRotationIntervalTime(Number(this.randomDigitRotationIntervalSelect.value));
        rotationInterval.setInterval(settings.rotationIntervalTime);
    }

    straightenDigits() {
        nunito_clock.applyZeroRotation();
    }

    resetRotationSettings() {
        settings.resetRotationSettings();
        nunito_clock.applyZeroRotation();
    }

}

class TimeoutSubMenu extends SubMenu {
    constructor(element) {
        super(element);
        this.element = element;
        this.timeoutDarkenCheckbox = $id("darken-screen-timeout-checkbox");
        this.timeoutIntervalSelect = $id("darken-screen-timeout-interval-select");
        this.resetTimeoutSettingsButton = $id("reset-timeout-settings-button");

        this.timeoutDarkenCheckbox.addEventListener("change", this.toggleTimeoutDarken.bind(this));
        this.timeoutIntervalSelect.addEventListener("change", this.setTimeoutDuration.bind(this));
    }

    toggleTimeoutDarken() {
        if (!settings.appliedInDOM) return;
        settings.setTimeoutDarkenEnabled(this.timeoutDarkenCheckbox.checked);
        timeout_overlay.setEnabled(settings.timeoutDarkenEnabled);
    }

    setTimeoutDuration() {
        if (!settings.appliedInDOM) return;
        settings.setTimeoutDuration(Number(this.timeoutIntervalSelect.value));
        timeout_overlay.setDuration(settings.timeoutDuration);
    }

    resetTimeoutSettings() {
        settings.resetTimeoutSettings();
        timeout_overlay.setDuration(settings.timeoutDuration);
    }
}



// settings instance
const settings = new Settings();

// font_slider instance
const font_slider = new FontSlider();

// font_snackbar instance
const font_snackbar = new FontSnackBar();

// playful clock instance
const nunito_clock = new NunitoClock();
const kenia_clock = new KeniaClock();
const sixcaps_clock = new SixCapsClock();
const badeen_clock = new BadeenClock();

// timeout overlay instance
const timeout_overlay = new TimeoutOverlay();
timeout_overlay.setDuration(settings.timeoutDuration);

// main menu instance
const main_menu = new MainMenu(document.getElementsByClassName("main-menu")[0]);

// sub menu instances
const color_sub_menu = new ColorSubMenu($id("color-sub-menu"));
const rotation_sub_menu = new RotationSubMenu($id("rotation-sub-menu"));
const timeout_sub_menu = new TimeoutSubMenu($id("timeout-sub-menu"));
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

// Application instance
const app = new App();

// intervals
const timeInterval = new SyncedInterval(
    60000,
    nunito_clock.updateTime.bind(nunito_clock),
    "Time"
);
const colorInterval = new SyncedInterval(
    settings.colorIntervalTime,
    app.applyRandomColorPalette,
    "Color"
);
const rotationInterval = new SyncedInterval(
    settings.rotationIntervalTime,
    nunito_clock.applyRandomRotation.bind(nunito_clock),
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

// EventListeners
document.addEventListener('DOMContentLoaded', function () {
    app.initialize();
});

document.body.addEventListener("click", function () {
    timeout_overlay.reset()
});
