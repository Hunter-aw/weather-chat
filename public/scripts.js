const weatherApp = function () {

    const WEATHER_ID = 'user_weather'

    function getWeatherFromStorage () {
        return JSON.parse(localStorage.getItem(WEATHER_ID) || '[]');
    }

    const weatherCards = getWeatherFromStorage()

    const weatherObj = {
        weatherCard: weatherCards
    }

    const saveWeatherToStorage = function () {
        localStorage.setItem(WEATHER_ID, JSON.stringify(weatherCards))
    }

    const _kelvinToCelcius = function (temperature) {
        let temp = (temperature - 273.15)
        return temp.toFixed(1)
    }
    const genId = function () {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
    
    class Comment {
        constructor (text) {
            this.comment = text
            this.comment_id = genId()
        }
    }
    class Weather{
        constructor (jsonData) {
            this.name = jsonData.name,
            this.temperature = _kelvinToCelcius(jsonData.main.temp),
            this.weather = jsonData.weather[0].main,
            this.weatherDescription = jsonData.weather[0].description,
            this.weatherId = jsonData.weather[0].id,
            this.id = genId()
            this.comments = [] 
        }
        addNewComment(text) {
            let comment = new Comment(text);
            this.comments.push(comment)
        }
    }

    function appendNewWeather(jsonData) {
        let newWeather = new Weather(jsonData)
        weatherCards.push(newWeather)
        saveWeatherToStorage()
    }
    
    function updateWeather(jsonData){
        $('.city-section').empty()
        if (jsonData) {
            appendNewWeather(jsonData)
        }
        var source = $('#weather-card-template').html()
        var template = Handlebars.compile(source)
        var newHTML = template(weatherObj)
        $('.city-section').append(newHTML)
    }
    
    const fetchWeather = function (city) {
        $.ajax({
            method: "GET",
            url: 'http://api.openweathermap.org/data/2.5/weather?q='+city+'&APPID=c6320192c1fe5796cee67590a23adc57',
            success: updateWeather,
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus);
            }
        });
    };

    return {
        fetchWeather: fetchWeather,
        updateWeather: updateWeather
    }

}
var app = weatherApp();
app.updateWeather()

//----------------EVENTS----------------------//

$('.add-city').on('click', function () {
    let city = $('#city-text').val()
    app.fetchWeather(city)
})
