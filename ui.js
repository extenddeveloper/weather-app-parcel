
import storage from './storage.js';
import weatherDataStore from './data-store.js';

const UI = {
    city: '',
    country: '',
    loadSelectors(){
        const cityElm = document.querySelector('#city')
        const cityInfoElm = document.querySelector('#w-city')
        const iconElm = document.querySelector('#w-icon')
        const temperatureElm = document.querySelector('#w-temp')
        const pressureElm = document.querySelector('#w-pressure')
        const humidityElm = document.querySelector('#w-humidity')
        const feelElm = document.querySelector('#w-feel')
        const formElm = document.querySelector('#form')
        const countryElm = document.querySelector('#country')
        const messageElm = document.querySelector('#messageWrapper')

        return {
            cityElm,
            cityInfoElm,
            iconElm,
            temperatureElm,
            pressureElm,
            humidityElm,
            feelElm,
            formElm,
            countryElm,
            messageElm
        }
    },

    getInputValue(){
        const {cityElm, countryElm} = this.loadSelectors();
        let city = cityElm.value;
        let country = countryElm.value;
        return {
            city,
            country
        }
    },

    validateInput(city, country){
        let isError = false;
        if(city === '' || country === ''){
            isError = true;
        }
        return isError;
    },
    hideMessage(){
        const msgContentElm = document.querySelector('.err-msg');
        if(msgContentElm){
            setTimeout(()=> {
                msgContentElm.remove();
            }, 2000);
        }
    },
    showMessage(msg){
        let { messageElm } = this.loadSelectors();
        const msgContentElm = document.querySelector('.err-msg');
        const elm = `<div class="alert alert-danger err-msg">${msg}</div>`;
        if(!msgContentElm){
            messageElm.insertAdjacentHTML('afterbegin', elm);
        }
        this.hideMessage();
    },
    resetInput(){
        const {cityElm, countryElm} = this.loadSelectors();
        countryElm.value = '';
        cityElm.value = '';
    },
    getIconSrc(iconCode) {
        return 'https://openweathermap.org/img/w/' + iconCode + '.png'
    },
    printWeather(data){
        const {
            cityInfoElm,
            iconElm,
            temperatureElm,
            pressureElm,
            humidityElm,
            feelElm

        } = this.loadSelectors();
        cityInfoElm.textContent = data.name;
        temperatureElm.textContent = `Temperature: ${data.main.temp}°C`;
        pressureElm.textContent = `Pressure: ${data.main.pressure} kpa`;
        humidityElm.textContent = `Humadity: ${data.main.humidity} kpa`;
        feelElm.textContent = data.weather[0].description;
        const src = this.getIconSrc(data.weather[0].icon);
        iconElm.setAttribute('src', src);
    },
    init(){
        const {formElm} = this.loadSelectors();
        formElm.addEventListener('submit', async(e) => {
            e.preventDefault();
            // get input value;
            const {city, country} = this.getInputValue();
            //validate input value;
            const isError = this.validateInput(city, country);
            if(isError){
                this.showMessage('Please Input valid Info');
                return;
            }
            this.city = city;
            this.country = country;

            // set data to weather data storage
            weatherDataStore.city = city;
            weatherDataStore.country = country;

            // set data to localStorage
            storage.city = city;
            storage.country = country;
            storage.saveItem();

            const data = await weatherDataStore.fetchWeatherData();
            if(Number(data.cod) >= 400){
                this.showMessage(data.message);
            }else{
                this.printWeather(data);
            }
            this.resetInput();

        });

        document.addEventListener('DOMContentLoaded', async(e) => {
            //set data to local Storage;
            if(localStorage.getItem('bd-weather-city')){
                let weatherInfo = JSON.parse(localStorage.getItem('bd-weather-city'));
                weatherDataStore.city = weatherInfo.city;
                weatherDataStore.country = weatherInfo.country;
            }else{
                weatherDataStore.country = "BD"
                weatherDataStore.city = 'Dhaka'
            }
            // send request to weather api
            let data = await weatherDataStore.fetchWeatherData();

            // show data to UI
            this.printWeather(data);
             
        })
    }

}

export default UI;