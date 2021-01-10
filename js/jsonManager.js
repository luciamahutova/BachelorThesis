class JSONManager {
    constructor() {
        this.allDataJSON = {};
    }

    // PLANÉTY
    // ----------------------------------------------------------------
    // 1.možnosť
    readData = async function() {
        this.currentValue = await fetch("/numericalData.json")
            .then(response => response.json())
            .then(data => {
                return data["planetData"]
            })
            .catch((error) => { console.warn(error); });
        return this.currentValue;
    }

    readPlanetData = async function(planet) {
        this.currentValue = await fetch("/numericalData.json")
            .then(response => response.json())
            .then(data => {
                return data["planetData"][planet]
            })
            .catch((error) => { console.warn(error); });
        return this.currentValue;
    }

    // 2.možnosť 
    getPlanetData = async function(planet) {
        // returns Promise
        const response = await fetch("/numericalData.json");
        this.allDataJSON = await response.json();
        return this.allDataJSON["planetData"][planet];
    }

    // MESIACE
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

    // SYMBOLY  
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