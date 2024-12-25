const playful_hour_tens = $id("playful").getElementsByClassName("time")[0]
const playful_hour_ones = $id("playful").getElementsByClassName("time")[1]
const playful_dots = $id("playful").getElementsByClassName("time")[2]
const playful_minutes_tens = $id("playful").getElementsByClassName("time")[3]
const playful_minutes_ones = $id("playful").getElementsByClassName("time")[4]
const modern_hour_tens = $id("modern").getElementsByClassName("time")[0]
const modern_hour_ones = $id("modern").getElementsByClassName("time")[1]
const modern_dots = $id("modern").getElementsByClassName("time")[2]
const modern_minutes_tens = $id("modern").getElementsByClassName("time")[3]
const modern_minutes_ones = $id("modern").getElementsByClassName("time")[4]

const color_palette = [
    ["#cc5803dd", "#e2711ddd", "#ff9505dd", "#ffb627dd", "#ffc971dd"], //orange
    ["#ffd6ffdd", "#e7c6ffdd", "#c8b6ffdd", "#b8c0ffdd", "#bbd0ffdd"], //purple
    ["#f08080dd", "#f4978edd", "#f8ad9ddd", "#fbc4abdd", "#ffdab9dd"], //coral
    ["#d8f3dcdd", "#b7e4c7dd", "#95d5b2dd", "#74c69ddd", "#52b788dd"], //green
    ["#d7e3fcdd", "#ccdbfddd", "#c1d3fedd", "#b6ccfedd", "#abc4ffdd"]  //blue
]

function $className(className){
    return document.getElementsByClassName(className)
}

function $id(id){
    return document.getElementById(id)
}

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function applyRandomRotation(){
    playful_hour_tens.style.transform = `rotate(${getRandomNumber(-10,10)}deg)`
    playful_hour_ones.style.transform = `rotate(${getRandomNumber(-10,10)}deg)`
    playful_dots.style.transform = `rotate(${getRandomNumber(-10,10)}deg), translate(0,-2rem)`
    playful_minutes_tens.style.transform = `rotate(${getRandomNumber(-10,10)}deg)`
    playful_minutes_ones.style.transform = `rotate(${getRandomNumber(-10,10)}deg)`
}

function applyColorPalettePlayful(){
    let id = getRandomNumber(0,color_palette.length-1)
    let palette = color_palette[id]
    playful_hour_tens.style.color = palette[0]
    playful_hour_ones.style.color = palette[1]
    playful_dots.style.color = palette[2]
    playful_minutes_tens.style.color = palette[3]
    playful_minutes_ones.style.color = palette[4]
}
function applyColorPaletteModern(){
    let id = getRandomNumber(0,color_palette.length-1)
    let palette = color_palette[id]
    console.log(palette)
    playful_hour_tens.style.color = palette[0]
    playful_hour_ones.style.color = palette[1]
    playful_dots.style.color = palette[2]
    playful_minutes_tens.style.color = palette[3]
    playful_minutes_ones.style.color = palette[4]
}
function applyColorPaletteClassic(){
    let id = getRandomNumber(0,color_palette.length-1)
    let palette = color_palette[id]
    console.log(palette)
    playful_hour_tens.style.color = palette[0]
    playful_hour_ones.style.color = palette[1]
    playful_dots.style.color = palette[2]
    playful_minutes_tens.style.color = palette[3]
    playful_minutes_ones.style.color = palette[4]
}

function updateTime(){
    let now = new Date();
    const hours = String(now.getHours());
    const minutes = String(now.getMinutes());
    
    if(minutes.length == 1){
        modern_minutes_tens.innerHTML = "0"
        playful_minutes_tens.innerHTML = "0"
        modern_minutes_ones.innerHTML = minutes[0]
        playful_minutes_ones.innerHTML = minutes[0]
    }
    
    if(hours.length == 1){
        playful_hour_tens.innerHTML = "0"
        modern_hour_tens.innerHTML = "0"
        playful_hour_ones.innerHTML = hours[0]
        modern_hour_ones.innerHTML = hours[0]
    }

    if(minutes.length == 2){
        modern_minutes_tens.innerHTML = minutes[0]
        playful_minutes_tens.innerHTML = minutes[0]
        modern_minutes_ones.innerHTML = minutes[1]
        playful_minutes_ones.innerHTML = minutes[1]
    }
    
    if(hours.length == 2){
        playful_hour_tens.innerHTML = hours[0]
        modern_hour_tens.innerHTML = hours[0]
        playful_hour_ones.innerHTML = hours[1]
        modern_hour_ones.innerHTML = hours[1]
    }

    applyRandomRotation()
    applyColorPalettePlayful()
          
}


function startSyncedInterval(interval, callback) {
    const now = new Date();
    const delay = interval - (now.getSeconds() * 1000 + now.getMilliseconds()) % interval;

    setTimeout(() => {
        callback();
        setInterval(callback, interval);
    }, delay);
}

updateTime()
startSyncedInterval(15000, updateTime);


$id("playful").addEventListener("click", function(){
    applyColorPalettePlayful()
    applyRandomRotation()
})
