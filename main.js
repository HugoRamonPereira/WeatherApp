const wrapper = document.querySelector('.wrapper'),
inputPart = wrapper.querySelector('.input-part'),
infoTxt = inputPart.querySelector('.info-txt'),
inputField = inputPart.querySelector('input'),
locationBtn = inputPart.querySelector('button'),
weatherIcon = wrapper.querySelector('.weather-part img'),
returnArrow = wrapper.querySelector('header i'),
timeClock = document.querySelector('.currentTime')

let api;

function getDateTime() {
  const currentTime = new Date(); 
  const hour = currentTime.getHours();
  const minute = currentTime.getMinutes();
  const second = currentTime.getSeconds();

  if(hour.toString().length == 1) {
       hour = '0'+hour;
  }
  if(minute.toString().length == 1) {
       minute = '0'+minute;
  }
  if(second.toString().length == 1) {
       second = '0'+second;
  }   
  const dateTime = hour+':'+minute+':'+second;   
   return dateTime;
}

// example usage: realtime clock
setInterval(function(){
  currentTime = getDateTime();
  document.querySelector('timeClock').innerText = currentTime;
}, 1000);

inputField.addEventListener('keyup', e => {
  if (e.key == 'Enter' && inputField.value != '') {
    requestApi(inputField.value)
  }
})

const apiKey = 'b161192fc8daeae1d0cd7f852973da9d';

returnArrow.addEventListener('click', () => {
  wrapper.classList.remove('active')
  inputField.value = ''
  inputField.focus()
})

locationBtn.addEventListener('click', () => {
  if (navigator.geolocation){
    navigator.geolocation.getCurrentPosition(onSuccess, onError)
  } else {
    alert('Your browser does not support API Geolocation Services!')
  }
})

function onSuccess(position) {
  // getting the latitude and longitude from the object coords
  const {latitude, longitude} = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
  fetchData()
}

function onError(error) {
  infoTxt.innerText = error.message
  infoTxt.classList.add('error')
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchData()
}

function fetchData() {
  infoTxt.innerText = 'Getting weather details...'
  infoTxt.classList.add('pending')
  // I am getting the api response and returning it with parsing into a js object and in 
  // the other function I am calling weatherDetails function and passing the api result as an argument
  fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
  infoTxt.classList.replace('pending', 'error')
  if (info.cod == '404') {
    infoTxt.innerText = `${inputField.value} isn't a valid city!`
  } else {

    // Gathering weather info from the object given us by the API
    const city = info.name 
    const country = info.sys.country
    const {description, id} = info.weather[0]
    const {feels_like, humidity, temp} = info.main

    // Using specific images according to the weather codes provided in https://openweathermap.org/weather-conditions
    if (id == 800) {
      weatherIcon.src = './Assets/Weather Icons/clear.svg'
    } else if (id >= 200 && id <= 232) {
      weatherIcon.src = './Assets/Weather Icons/storm.svg'
    } else if (id >= 600 && id <= 622) {
      weatherIcon.src = './Assets/Weather Icons/snow.svg'
    } else if (id >= 801 && id <= 804) {
      weatherIcon.src = './Assets/Weather Icons/cloud.svg'
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
      weatherIcon.src = './Assets/Weather Icons/rain.svg'
    }

    // lets pass the values to the correct HTML element
    wrapper.querySelector('.temp .numb').innerText = Math.floor(temp) 
    wrapper.querySelector('.weather').innerText = description
    wrapper.querySelector('.location span').innerText = `${city}, ${country}`
    wrapper.querySelector('.temp .numb-2').innerText = Math.floor(feels_like)
    wrapper.querySelector('.humidity span').innerText = `${humidity}%`

    infoTxt.classList.remove('pending', 'error')
    wrapper.classList.add('active')
    console.log(info)
  }
}



