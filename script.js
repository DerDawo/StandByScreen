// playful clock DOM elements
const playful_hour_tens = $id("playful").getElementsByClassName("time")[0]
const playful_hour_ones = $id("playful").getElementsByClassName("time")[1]
const playful_dots = $id("playful").getElementsByClassName("time")[2]
const playful_minutes_tens = $id("playful").getElementsByClassName("time")[3]
const playful_minutes_ones = $id("playful").getElementsByClassName("time")[4]
// modern clock DOM elements
const modern_hour_tens = $id("modern").getElementsByClassName("time")[0]
const modern_hour_ones = $id("modern").getElementsByClassName("time")[1]
const modern_dots = $id("modern").getElementsByClassName("time")[2]
const modern_minutes_tens = $id("modern").getElementsByClassName("time")[3]
const modern_minutes_ones = $id("modern").getElementsByClassName("time")[4]
// classic clock DOM elements
const time = document.querySelector(".hours");
const secHand = document.querySelector(".second");
const minHand = document.querySelector(".minute");
const hourHand = document.querySelector(".hour");
for (let i = 1; i <= 60; i++) {
    if (i % 5 == 0) {
        time.innerHTML += "<div class='hour-number'><div>" + (i / 5) + "</div></div>";
        let hours = document.getElementsByClassName("hour-number");
        hours[hours.length - 1].style.transform = `translateX(-50%) rotate(${i * 6}deg)`;
        hours[hours.length - 1].firstChild.style.transform = `rotate(${i * -6}deg)`;
    } else {
        time.innerHTML += "<div class='minute-bar'></div>";
        let bars = document.getElementsByClassName("minute-bar");
        bars[bars.length - 1].style.transform = `translateX(-50%) rotate(${i * 6}deg)`;
    }
}
// color palettes
const color_palette_playful = [
    ["#cc5803dd", "#e2711ddd", "#ff9505dd", "#ffb627dd", "#ffc971dd"], //orange
    ["#ffd6ffdd", "#e7c6ffdd", "#c8b6ffdd", "#b8c0ffdd", "#bbd0ffdd"], //purple
    ["#f08080dd", "#f4978edd", "#f8ad9ddd", "#fbc4abdd", "#ffdab9dd"], //coral
    ["#d8f3dcdd", "#b7e4c7dd", "#95d5b2dd", "#74c69ddd", "#52b788dd"], //green
    ["#d7e3fcdd", "#ccdbfddd", "#c1d3fedd", "#b6ccfedd", "#abc4ffdd"]  //blue
]
let cppid = 0
const color_palette_classic = [
    "#ffbe0bdd", //yellow
    "#fb5607dd", //orange
    "#ff006edd", //pink
    "#8338ecdd", //purple
    "#3a86ffdd", //blue
    "#ffffff", //white
    "#06d6a0dd"  //green
]
let cpcid = 0
const color_palette_modern = [
    "#ffb627dd", //yellow
    "#e2711ddd", //orange
    "#ff006edd", //pink
    "#bbd0ffdd", //purple
    "#3a86ffdd", //blue
    "#f08080dd", //coral
    "#52b788dd"  //green
]
let cpmid = 0

function $className(className) { return document.getElementsByClassName(className) };
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
    playful_hour_tens.style.transform = `rotate(${getRandomNumber(-10, 10)}deg)`;
    playful_hour_ones.style.transform = `rotate(${getRandomNumber(-10, 10)}deg)`;
    playful_dots.style.transform = `rotate(${getRandomNumber(-10, 10)}deg), translate(0,-2rem)`;
    playful_minutes_tens.style.transform = `rotate(${getRandomNumber(-10, 10)}deg)`;
    playful_minutes_ones.style.transform = `rotate(${getRandomNumber(-10, 10)}deg)`;
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

function applyColorPaletteModern() {
    let id = getRandomNumber(0, color_palette_playful.length - 1)
    let palette = color_palette_playful[id]
    playful_hour_tens.style.color = palette[0]
    playful_hour_ones.style.color = palette[1]
    playful_dots.style.color = palette[2]
    playful_minutes_tens.style.color = palette[3]
    playful_minutes_ones.style.color = palette[4]
}

function applyColorPaletteClassic() {
    cpcid += 1
    if (cpcid > color_palette_classic.length - 1) {
        cpcid = 0
    }
    let palette = color_palette_classic[cpcid]
    document.documentElement.style.setProperty("--palette-color", palette);
}

function updatePlayfulClock() {
    const now = new Date();
    const hours = String(now.getHours());
    const minutes = String(now.getMinutes());

    if (minutes.length == 1) {
        modern_minutes_tens.innerHTML = "0"
        playful_minutes_tens.innerHTML = "0"
        modern_minutes_ones.innerHTML = minutes[0]
        playful_minutes_ones.innerHTML = minutes[0]
    }

    if (hours.length == 1) {
        playful_hour_tens.innerHTML = "0"
        modern_hour_tens.innerHTML = "0"
        playful_hour_ones.innerHTML = hours[0]
        modern_hour_ones.innerHTML = hours[0]
    }

    if (minutes.length == 2) {
        modern_minutes_tens.innerHTML = minutes[0]
        playful_minutes_tens.innerHTML = minutes[0]
        modern_minutes_ones.innerHTML = minutes[1]
        playful_minutes_ones.innerHTML = minutes[1]
    }

    if (hours.length == 2) {
        playful_hour_tens.innerHTML = hours[0]
        modern_hour_tens.innerHTML = hours[0]
        playful_hour_ones.innerHTML = hours[1]
        modern_hour_ones.innerHTML = hours[1]
    }
}

function updatePlayfulClockStyle() {
    applyRandomRotationPlayful()
    applyColorPalettePlayful()
}

function updateClassicClock() {
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours();

    let secDeg = seconds * (360 / 60) + minutes * 360;
    let minDeg = minutes * (360 / 60) + seconds / 12;
    let hourDeg = hours * (360 / 12) + (minutes / 12) * (360 / 60);
    secHand.style.transform = `translateX(-50%) rotate(${secDeg}deg)`;
    minHand.style.transform = `translateX(-50%) rotate(${minDeg}deg)`;
    hourHand.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`;
}

function init(){
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        document.body.classList.add('ios');
    }
    updatePlayfulClock();
    updateClassicClock();
    updatePlayfulClockStyle();
    startSyncedInterval(1000, updateClassicClock);
    startSyncedInterval(1000, updatePlayfulClock);
    startSyncedInterval(60000, updatePlayfulClockStyle);
}



document.addEventListener('DOMContentLoaded', function () {
    init();	
});

$id("playful").addEventListener("click", function () {
    applyColorPalettePlayful()
    applyRandomRotationPlayful()
})


$id("classic-clock").addEventListener("click", function () {
    applyColorPaletteClassic()
})
