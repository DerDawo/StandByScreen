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
    ["#d7e3fcdd", "#ccdbfddd", "#c1d3fedd", "#b6ccfedd", "#abc4ffdd"]  //blue
]

function $id(id) { return document.getElementById(id) };
function getRandomNumber(min, max) { return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min) };
function startSyncedInterval(interval, callback) {
    const now = new Date();
    const delay = interval - (now.getSeconds() * 1000 + now.getMilliseconds()) % interval;

    setTimeout(() => {
        callback();
        setInterval(callback, interval);
    }, delay);
}

function applyRandomRotationPlayful() {
    document.documentElement.style.setProperty("--playful-hour-tens-rotation", `${getRandomNumber(-10, 10)}deg`);
    document.documentElement.style.setProperty("--playful-hour-ones-rotation", `${getRandomNumber(-10, 10)}deg`);
    document.documentElement.style.setProperty("--playful-dots-rotation", `${getRandomNumber(-10, 10)}deg`);
    document.documentElement.style.setProperty("--playful-minute-tens-rotation", `${getRandomNumber(-10, 10)}deg`);
    document.documentElement.style.setProperty("--playful-minute-ones-rotation", `${getRandomNumber(-10, 10)}deg`);
}

function applyColorPalettePlayful() {
    let id = getRandomNumber(0, color_palette_playful.length - 1)
    let palette = color_palette_playful[id]
    playful_hour_tens.style.color = palette[0]
    playful_hour_ones.style.color = palette[1]
    playful_dots.style.color = palette[2]
    playful_minutes_tens.style.color = palette[3]
    playful_minutes_ones.style.color = palette[4]
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
    applyRandomRotationPlayful()
    applyColorPalettePlayful()
}

function init() {
    updatePlayfulTime();
    updatePlayfulStyle();
    startSyncedInterval(1000, updatePlayfulTime);
    startSyncedInterval(60000, updatePlayfulStyle);
}

document.addEventListener('DOMContentLoaded', function () {
    init();
});

$id("playful").addEventListener("click", function () {
    updatePlayfulStyle()
})
