class JSONManager {
    constructor() {
        this.planetData = [];
        this.moonData = [];
        this.astronomicalSymbol = [];
        this.currentValue = 0;
    }

    readJsonFile = function(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                this.planetData = data.planetData;
                this.moonData = data.moonData;
                this.astronomicalSymbol = data.astronomicalSymbol;
            });
    }
    readPlanetData = function(planet, property) {
        fetch("/numericalData.json")
            .then(response => response.json())
            .then(data => {
                this.planetData = data.planetData;
                console.log(this.planetData[planet][property]); // DOBRA HODNOTA
                return this.planetData[planet][property];
            });
    }

    readMoonData = function(moon, moonOrder, property) {
        fetch("/numericalData.json")
            .then(response => response.json())
            .then(data => {
                this.moonData = data.moonData;
                return this.moonData[moon][moonOrder][property];
            });
    }

    readAstronomicalSymbol = function(property) {
        fetch("/numericalData.json")
            .then(response => response.json())
            .then(data => {
                this.astronomicalSymbol = data.astronomicalSymbol;
                return this.astronomicalSymbol[property];
            });
    }


    // PRIKLAD POUZITIA - PRISTUPY FUNGUJU
    // var planet, moon, astro = [];
    // fetch("/numericalData.json")
    //     .then(response => response.json())
    //     .then(data => {
    //         planet = data.planetData;
    //         moon = data.moonData;
    //         astro = data.astronomicalSymbol;
    //         console.log(astro['meanRadius']); // zanorenie v {}
    //         console.log(planet['Venus']['e']); // zanorenie v {{}}
    //         console.log(moon['Mars'][1]['mass']); // zanorenie v {[{}]}
    //     });
}