const storage = {
    privateCity: '',
    privateCountry: '',
    set city(name){
        this.privateCity = name;
    },
    set country(name){
        this.privateCountry = name;
    },
    saveItem(){
        let dataObj = {
            city: this.privateCity,
            country: this.privateCountry
        }
        localStorage.setItem('bd-weather-city', JSON.stringify(dataObj));
       let weatherInfo = JSON.parse(localStorage.getItem('bd-weather-city'));
       console.log(weatherInfo.country);
       console.log(weatherInfo.city);
    }
};

export default storage;
