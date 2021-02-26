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

    // Not used, too many threads
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
    readMoonsData = async function() {
        this.currentValue = await fetch("/numericalData.json")
            .then(response => response.json())
            .then(data => {
                return data["moonData"]
            })
            .catch((error) => { console.warn(error); });
        return this.currentValue;
    }

    getMoonData = async function(planetOrder, moonOrder) {
        const response = await fetch("/numericalData.json");
        this.allDataJSON = await response.json();
        return this.allDataJSON["moonData"][planetOrder][moonOrder];
    }
}