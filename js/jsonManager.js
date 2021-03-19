class JSONManager {
    constructor() {
        this.allPlanetDataJSON = [];
        this.allMoonDataJSON = [];

        this.addAllPlanetDataJSON();
        this.addAllMoonDataJSON();
    }

    getPlanetData() { return this.allPlanetDataJSON; }
    getMoonData() { return this.allMoonDataJSON; }

    // Data about Planets and Moons
    // ----------------------------------------------------------------
    readDataJSON = async function(string) {
        this.currentValue = await fetch("/numericalData.json")
            .then(response => response.json())
            .then(data => {
                return data[string]
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
            this.allPlanetDataJSON.push(this.readDataJSON("planetData"));
        }
    }

    addAllMoonDataJSON = function() {
        if (this.allMoonDataJSON.length == 0) {
            this.allMoonDataJSON.push(this.readDataJSON("moonData"));
        }
    }
}