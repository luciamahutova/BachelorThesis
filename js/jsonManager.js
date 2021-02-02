class JSONManager {
    constructor() {
        this.allDataJSON = {};
    }

    // Planets
    // ----------------------------------------------------------------
    // 1.possibile solution
    readPlanetsData = async function() {
        this.currentValue = await fetch("/numericalData.json")
            .then(response => response.json())
            .then(data => {
                return data["planetData"]
            })
            .catch((error) => { console.warn(error); });
        return this.currentValue;
    }

    readSinglePlanetData = async function(planet) {
        this.currentValue = await fetch("/numericalData.json")
            .then(response => response.json())
            .then(data => {
                return data["planetData"][planet]
            })
            .catch((error) => { console.warn(error); });
        return this.currentValue;
    }

    // 2.possible solution
    getPlanetData = async function(planet) {
        // returns Promise
        const response = await fetch("/numericalData.json");
        this.allDataJSON = await response.json();
        return this.allDataJSON["planetData"][planet];
    }

    // Moons
    // ----------------------------------------------------------------
    readMoonData = function(planetOrder, moonOrder) {
        fetch("/numericalData.json")
            .then(response => response.json())
            .then(data => {
                return data.moonData[planetOrder][moonOrder];
            })
            .catch((error) => { console.warn(error); });
    }

    getMoonData = async function(planetOrder, moonOrder) {
        const response = await fetch("/numericalData.json");
        this.allDataJSON = await response.json();
        return this.allDataJSON["moonData"][planetOrder][moonOrder];
    }

    // Symbols
    // ----------------------------------------------------------------
    readAstronomicalSymbol = function(property) {
        fetch("/numericalData.json")
            .then(response => response.json())
            .then(data => {
                return data.astronomicalSymbol[property];
            })
            .catch((error) => { console.warn(error); });
    }

    getAstronomicalSymbol = async function(property) {
        const response = await fetch("/numericalData.json");
        this.allDataJSON = await response.json();
        return this.allDataJSON["astronomicalSymbol"][property];
    }
}