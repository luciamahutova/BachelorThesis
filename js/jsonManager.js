class JSONManager {
    constructor() {
        this.allDataJSON = {};
        this.allPlanetDataJSON = [];
        this.allMoonDataJSON = [];

        this.addAllPlanetDataJSON();
        this.addAllMoonDataJSON();
    }

    getPlanetData() { return this.allPlanetDataJSON; }
    getMoonData() { return this.allMoonDataJSON; }

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

    // Read data from JSON and save them
    // -------------------------------------------------------------------------
    addAllPlanetDataJSON = function() {
        // Only for empty array, class is inherited by 4 classes,
        // precaution so there are only 2 threads initialized
        if (this.allPlanetDataJSON.length == 0) {
            this.allPlanetDataJSON.push(this.readPlanetsData());
        }
    }

    addAllMoonDataJSON = function() {
        if (this.allMoonDataJSON.length == 0) {
            this.allMoonDataJSON.push(this.readMoonsData());
        }
    }
}