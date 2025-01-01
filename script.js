// Icons
const weather_icons =
{
    "day": {
        "0": `<i class="wi wi-day-sunny"></i>`,
        "1": `<i class="wi wi-day-cloudy"></i>`,
        "2": `<i class="wi wi-day-cloudy"></i>`,
        "3": `<i class="wi wi-day-sunny-overcast"></i>`,
        "45": `<i class="wi wi-day-fog"></i>`,
        "48": `<i class="wi wi-day-fog"></i>`,
        "51": `<i class="wi wi-day-hail"></i>`,
        "53": `<i class="wi wi-day-hail"></i>`,
        "55": `<i class="wi wi-day-hail"></i>`,
        "56": `<i class="wi wi-day-rain-mix"></i>`,
        "57": `<i class="wi wi-day-rain-mix"></i>`,
        "61": `<i class="wi wi-day-sprinkle"></i>`,
        "63": `<i class="wi wi-day-showers"></i>`,
        "65": `<i class="wi wi-day-rain"></i>`,
        "66": `<i class="wi-day-sleet"></i>`,
        "67": `<i class="wi-day-sleet"></i>`,
        "71": `<i class="wi wi-day-snow"></i>`,
        "73": `<i class="wi wi-day-snow"></i>`,
        "75": `<i class="wi wi-day-snow"></i>`,
        "77": `<i class="wi wi-day-snow"></i>`,
        "80": `<i class="wi wi-day-rain"></i>`,
        "81": `<i class="wi wi-day-rain"></i>`,
        "82": `<i class="wi wi-day-rain"></i>`,
        "85": `<i class="wi wi-day-snow-wind"></i>`,
        "86": `<i class="wi wi-day-snow-wind"></i>`,
        "95": `<i class="wi wi-day-thunderstorm"></i>`,
        "96": `<i class="wi wi-day-thunderstorm"></i>`,
        "99": `<i class="wi wi-day-thunderstorm"></i>`
    },
    "night": {
        "0": `<i class="wi wi-night-clear"></i>`,
        "1": `<i class="wi wi-night-cloudy"></i>`,
        "2": `<i class="wi wi-night-cloudy"></i>`,
        "3": `<i class="wi wi-night-sunny-overcast"></i>`,
        "45": `<i class="wi wi-night-fog"></i>`,
        "48": `<i class="wi wi-night-fog"></i>`,
        "51": `<i class="wi wi-night-hail"></i>`,
        "53": `<i class="wi wi-night-hail"></i>`,
        "55": `<i class="wi wi-night-hail"></i>`,
        "56": `<i class="wi wi-night-rain-mix"></i>`,
        "57": `<i class="wi wi-night-rain-mix"></i>`,
        "61": `<i class="wi wi-night-sprinkle"></i>`,
        "63": `<i class="wi wi-night-showers"></i>`,
        "65": `<i class="wi wi-night-rain"></i>`,
        "66": `<i class="wi-night-sleet"></i>`,
        "67": `<i class="wi-night-sleet"></i>`,
        "71": `<i class="wi wi-night-snow"></i>`,
        "73": `<i class="wi wi-night-snow"></i>`,
        "75": `<i class="wi wi-night-snow"></i>`,
        "77": `<i class="wi wi-night-snow"></i>`,
        "80": `<i class="wi wi-night-rain"></i>`,
        "81": `<i class="wi wi-night-rain"></i>`,
        "82": `<i class="wi wi-night-rain"></i>`,
        "85": `<i class="wi wi-night-snow-wind"></i>`,
        "86": `<i class="wi wi-night-snow-wind"></i>`,
        "95": `<i class="wi wi-night-thunderstorm"></i>`,
        "96": `<i class="wi wi-night-thunderstorm"></i>`,
        "99": `<i class="wi wi-night-thunderstorm"></i>`
    }
}
// Caroussel DOM
const standby_caroussel = $className("stand-by-screen-caroussel")[0]
const standby_caroussel_children = standby_caroussel.children
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
    '#ffffff', //white
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
    cpmid += 1
    if (cpmid > color_palette_modern.length - 1) {
        cpmid = 0
    }
    let palette = color_palette_modern[cpmid]
    document.documentElement.style.setProperty("--palette-modern-color", palette);
}

function applyColorPaletteClassic() {
    cpcid += 1
    if (cpcid > color_palette_classic.length - 1) {
        cpcid = 0
    }
    let palette = color_palette_classic[cpcid]
    document.documentElement.style.setProperty("--palette-color", palette);
}

function updatePlayfulAndModernClock() {
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

    document.querySelector(".month").innerHTML = now.toLocaleString('default', { month: 'short' }).toUpperCase();
    document.querySelector(".day").innerHTML = now.getDate();
    document.querySelector(".year").innerHTML = now.getFullYear();
    document.querySelector(".day-name").innerHTML = now.toLocaleString('default', { weekday: 'short' }).toUpperCase();
}

function updateWaetherModernClock() {
    // 0 	Clear sky
    // 1, 2, 3 	Mainly clear, partly cloudy, and overcast
    // 45, 48 	Fog and depositing rime fog
    // 51, 53, 55 	Drizzle: Light, moderate, and dense intensity
    // 56, 57 	Freezing Drizzle: Light and dense intensity
    // 61, 63, 65 	Rain: Slight, moderate and heavy intensity
    // 66, 67 	Freezing Rain: Light and heavy intensity
    // 71, 73, 75 	Snow fall: Slight, moderate, and heavy intensity
    // 77 	Snow grains
    // 80, 81, 82 	Rain showers: Slight, moderate, and violent
    // 85, 86 	Snow showers slight and heavy
    // 95 * 	Thunderstorm: Slight or moderate
    // 96, 99 * 	Thunderstorm with slight and heavy hail

    if (!navigator.geolocation) {
        console.log("Geolocation is not available")
        document.querySelector(".weather-icon").innerHTML = ""
        document.querySelector(".temperature").innerHTML = ""
        return
    }

    let lat, lon = navigator.geolocation.getCurrentPosition((position) => {

        lat = position.coords.latitude
        lon = position.coords.longitude

        fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,is_day,weather_code&forecast_days=1`)
            .then(response => response.json())
            .then(data => {
                console.log(data)
                let weather_code = data.current.weather_code
                let temperature = data.current.temperature_2m
                let is_day = data.current.is_day === 1 ? "day" : "night"
                let icon = weather_icons[is_day][weather_code]
                document.querySelector(".weather-icon").innerHTML = icon
                document.querySelector(".temperature").innerHTML = `${temperature} °C`

            })
            .catch(error => {
                document.querySelector(".weather-icon").innerHTML = ""
                document.querySelector(".temperature").innerHTML = ""
                console.error(error)
            })
    })
}

function updatePlayfulAndModernClockStyle() {
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

function animateCarousselSwipe() {
    standby_caroussel.style.transition = "transform 0.5s"
    setTimeout(() => {
        standby_caroussel.style.transition = "none"
    }, 500)
}

function applyColorStylePlayful() {
    applyColorPalettePlayful()
    applyRandomRotationPlayful()
}

// a function, which gets an element and searches in it's parents a specific element by id
// if non found return false
function findParentById(element, id) {

    while (element.id !== id) {
        element = element.parentElement;
        if (element === null) {
            return false;
        }
    }

    return element;
}

function init() {
    if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        document.body.classList.add('ios');
    }
    updatePlayfulAndModernClock();
    updateClassicClock();
    updatePlayfulAndModernClockStyle();
    updateWaetherModernClock();
    startSyncedInterval(1000, updateClassicClock);
    startSyncedInterval(1000, updatePlayfulAndModernClock);
    startSyncedInterval(1000, updatePlayfulAndModernClock);
    startSyncedInterval(60000, updatePlayfulAndModernClockStyle);
    initSwipeFunctions();
    initCalendar();
}

function initCalendar() {
    const calendar = document.querySelector('.calendar');

    function updateCalendar() {
        const now = new Date();
        const day = now.getDay();
        const date = now.getDate();
        const year = now.getFullYear();

        // get the length of the month in days
        const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
        calendar.innerHTML = `
        <div class="calendar-header">
            <div class="calendar-month">${now.toLocaleString('default', { month: 'long' })}</div>
            <div class="calendar-year">${year}</div>
        </div>
            <div class="calendar-weekdays">
                <span class="calendar-weekday-monday">M</span>
                <span class="calendar-weekday-tuesday">D</span>
                <span class="calendar-weekday-wednesday">M</span>
                <span class="calendar-weekday-thursday">D</span>
                <span class="calendar-weekday-friday">F</span>
                <span class="calendar-weekday-saturday">S</span>
                <span class="calendar-weekday-sunday">S</span>
            </div>
            <div class="calendar-dates">
                ${Array.from({ length: lastDay + day }).map((_, i) => {
                    const d = new Date(now);
                    d.setDate(date - day + i);
                    if (i<day){
                        return `<div class="calendar-date calendar-date-empty"></div>`;
                    }
                    return `
                            <div class="calendar-date ${i === day ? 'calendar-date-today' : ''}">
                                <span class="calendar-date-number">${d.getDate()}</span>
                            </div>
                        `;
                }   ).join('')}          
            </div>
        `;
    }

    updateCalendar();
    startSyncedInterval(60000, updateCalendar);
}


document.addEventListener('DOMContentLoaded', function () {
    init();
});

$id("playful").addEventListener("click", function () {
    applyColorStylePlayful()
})

$id("classic-clock").addEventListener("click", function () {
    applyColorPaletteClassic()
})

// vars for caroussel and tocuh
let startY = 0;
let swipedY = 0;
let endY = 0;
let translateY = 0;
let touchstart = false;
const threshold = 0.10;
const threshold_screen_height = window.innerHeight * threshold;
const max_screen_height = window.innerHeight * (standby_caroussel_children.length - 1)
let swipe_direction = 0;
let swipingY = 0;
let swipe_start = 0;
let swipe_end = 0;
let touch_target = null;

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
function initSwipeFunctions() {
    if (isMobile) {

        document.addEventListener('touchstart', function (e) {
            startY = e.touches[0].pageY
            touchstart = true
            swipe_start = new Date().getTime()
            touch_target = e.touches[0].target
        }, false)

        document.addEventListener('touchmove', function (e) {
            e.preventDefault()
            if (!touchstart) return
            swipingY = e.touches[0].pageY - startY
            standby_caroussel.style.transform = `translateY(${translateY + swipingY}px)`
        }, false)

        document.addEventListener('touchend', function (e) {
            e.preventDefault()
            swipe_end = new Date().getTime()

            if (swipe_end - swipe_start < 100) {
                standby_caroussel.style.transform = `translateY(${translateY}px)`
                if (findParentById(touch_target, "playful")) {
                    applyColorStylePlayful()
                }
                if (findParentById(touch_target, "modern")) {
                    applyColorPaletteModern()
                }
                if (findParentById(touch_target, "classic")) {
                    applyColorPaletteClassic()
                }
                animateCarousselSwipe()
                return
            }

            touchstart = false
            swipedY = Math.abs(swipingY)

            if (!(swipedY > threshold_screen_height)) {
                standby_caroussel.style.transform = `translateY(${translateY}px)`
                animateCarousselSwipe()
                return
            }

            if (swipingY < 0) {
                swipe_direction = -1 // swipe up
            } else if (swipingY > 0) {
                swipe_direction = 1 // swipe down
            } else {
                swipe_direction = 0
            }

            if (swipe_direction == 0) return

            let new_translate_y = translateY + (swipe_direction * window.innerHeight)

            if (-new_translate_y < window.innerHeight) {
                translateY = 0
                standby_caroussel.style.transform = `translateY(${translateY}px)`
                animateCarousselSwipe()
                return
            }

            if (Math.abs(new_translate_y) > max_screen_height) {
                standby_caroussel.style.transform = `translateY(${translateY}px)`
                animateCarousselSwipe()
                return
            }

            translateY = new_translate_y
            standby_caroussel.style.transform = `translateY(${translateY}px)`
            animateCarousselSwipe()

        }, false)

    } else {
        standby_caroussel.addEventListener('mousedown', function (e) {
            e.preventDefault()
            startY = e.clientY
            touchstart = true
        }, false)

        standby_caroussel.addEventListener('mousemove', function (e) {
            e.preventDefault()
            if (!touchstart) return
            let swipingY = e.clientY - startY
            standby_caroussel.style.transform = `translateY(${translateY + swipingY}px)`
        }, false)

        standby_caroussel.addEventListener('mouseup', function (e) {
            e.preventDefault()
            touchstart = false
            swipedY = Math.abs(e.clientY - startY)

            if (!(swipedY > threshold_screen_height)) {
                standby_caroussel.style.transform = `translateY(${translateY}px)`
                return
            }

            if (e.clientY - startY < 0) {
                swipe_direction = -1 // swipe up
            } else if (e.clientY - startY > 0) {
                swipe_direction = 1 // swipe down
            } else {
                swipe_direction = 0
            }

            if (swipe_direction == 0) return

            let new_translate_y = translateY + (swipe_direction * window.innerHeight)

            if (-new_translate_y < window.innerHeight) {
                translateY = 0
                standby_caroussel.style.transform = `translateY(${translateY}px)`
                animateCarousselSwipe()
                return
            }

            if (Math.abs(new_translate_y) > max_screen_height) {
                standby_caroussel.style.transform = `translateY(${translateY}px)`
                animateCarousselSwipe()
                return
            }

            translateY = new_translate_y
            standby_caroussel.style.transform = `translateY(${translateY}px)`
            animateCarousselSwipe()

        }, false)
    }

}