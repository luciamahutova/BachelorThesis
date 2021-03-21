class JSONManager {
    constructor() {
        this.allPlanetDataJSON = [];
        this.allMoonDataJSON = [];

        this.planetNames = ["Mercury", "Venus", "Earth", "Mars", "Jupiter", "Saturn", "Uranus", "Neptune"];
        this.moonNames = ["Moon", "Io", "Europa", "Ganymede", "Callisto", "Rhea", "Titan",
            "Ariel", "Umbriel", "Titania", "Oberon", "Triton"
        ];

        this.addAllPlanetDataJSON();
        this.addAllMoonDataJSON();
    }

    getPlanetData() { return this.allPlanetDataJSON; }
    getMoonData() { return this.allMoonDataJSON; }
    getPlanetNames() { return this.planetNames; }
    getMoonNames() { return this.moonNames; }

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

    // Index of clicked planet, used in children classes
    // -------------------------------------------------------------------------
    getIndexOfSelectedPlanet(selectedPlanet) {
        for (var i = 0; i < this.planetNames.length; i++) {
            if (selectedPlanet.name == this.planetNames[i]) {
                return i;
            }
        }
    }
}