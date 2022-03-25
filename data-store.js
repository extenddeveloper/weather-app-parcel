const weatherDataStore = {
    privateCity: '',
    privateCountry: '',
    api: '48c7994cf0f143a27cbae7caf6ebaa78',
    set city(name){
        this.privateCity = name;
    },
    set country(name){
        this.privateCountry = name;
    },
    async fetchWeatherData(){
        try{
            const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.privateCity},${this.privateCountry}&unit=metric&appid=${this.api}`)
            return await res.json();
        }catch(err){
            UI.showMessage(err.message)
        }
    }
};

export default weatherDataStore;