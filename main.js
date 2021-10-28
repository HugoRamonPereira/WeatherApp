const wrapper = document.querySelector('.wrapper'),
inputPart = wrapper.querySelector('.input-part'),
infoTxt = inputPart.querySelector('.info-txt'),
inputField = inputPart.querySelector('input'),
locationBtn = inputPart.querySelector('button');

let api

inputField.addEventListener('keyup', e => {
  if (e.key == 'Enter' && inputField.value != '') {
    requestApi(inputField.value)
  }
})

const apiKey = 'b161192fc8daeae1d0cd7f852973da9d';

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
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`
  fetchData()
}

function onError(error) {
  infoTxt.innerText = error.message
  infoTxt.classList.add('error')
  console.log(error)
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
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

    // lets pass the values to the correct HTML element
    wrapper.querySelector('temp, numb').innerText = temp
    wrapper.querySelector('weather').innerText = description
    wrapper.querySelector('.location span').innerText = `${city}, ${country}`
    wrapper.querySelector('.temp .numb-2').innerText = temp
    wrapper.querySelector('temp, numb').innerText = temp

    infoTxt.classList.remove('pending', 'error')
    wrapper.classList.add('active')
    console.log(info)
  }
}