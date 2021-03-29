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

    // Get()
    getPlanetData() { return this.allPlanetDataJSON }
    getMoonData() { return this.allMoonDataJSON }
    getPlanetNames() { return this.planetNames }
    getMoonNames() { return this.moonNames }

    // Data about Planets and Moons
    // ----------------------------------------------------------------
    readDataJSON = async function(string) {
        var currentValue = await fetch("/numericalData.json")
            .then(response => response.json())
            .then(data => {
                return data[string]
            })
            .catch((error) => { console.warn(error); });
        return currentValue;
    }

    // Read data from JSON and save them
    // -------------------------------------------------------------------------
    addAllPlanetDataJSON = function() {
        // Only for empty array, class is inherited by 4 classes,
        // precaution so there are only 2 threads initialized: planet+moon data
        if ((this.getPlanetData()).length == 0) {
            (this.getPlanetData()).push(this.readDataJSON("planetData"));
        }
    }

    addAllMoonDataJSON = function() {
        if ((this.getMoonData()).length == 0) {
            (this.getMoonData()).push(this.readDataJSON("moonData"));
        }
    }

    // Index of clicked planet, used in children classes
    // -------------------------------------------------------------------------
    getIndexOfSelectedPlanet(selectedPlanet) {
        var planets = this.getPlanetNames();
        for (var i = 0; i < planets.length; i++) {
            if (selectedPlanet.name == planets[i]) {
                return i;
            }
        }
    }
}