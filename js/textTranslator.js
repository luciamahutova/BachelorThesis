let arrLang = {
    cz: {
        // Menu
        'ssm': 'Model sluneční soustavy',
        'planets': 'Planety',
        'about': 'O aplikaci',
        // Sidebar
        'names': 'Jména',
        'allPlanets': 'Pro všechny planety',
        'singlePlanet': 'Pro planetu',
        'moonOrbit': 'Orbita měsíce',
        'orbit': 'Orbita',
        'velocity': 'Rychlost',
        'newValue': 'Nová hodnota',
        'originalValues': 'Původní hodnoty',
        'cosmicObject': 'Kosmický objekt',
        'addToPlanet': 'Přidat ke planetě',
        'objectOrbit': 'Dráha objektu',
        'changeVelocity': 'Změna rychlosti',
        'changeForce': 'Změna síly',
        'mercury': 'Merkur',
        'venus': 'Venuše',
        'earth': 'Země',
        'uranus': 'Uran',
        'neptune': 'Neptun',
        'confirm': 'Potvrdit'
    },

    en: {
        // Menu
        'ssm': 'Solar system model',
        'planets': 'Planets',
        'about': 'About application',
        // Sidebar
        'names': 'Names',
        'allPlanets': 'For all planets',
        'singlePlanet': 'For single planet',
        'moonOrbit': "Moon's orbit",
        'orbit': 'Orbit',
        'velocity': 'Velocity',
        'newValue': 'New value',
        'originalValues': 'Original values',
        'cosmicObject': 'Cosmis object',
        'addToPlanet': 'Add to planet',
        'objectOrbit': "Show object's orbit",
        'changeVelocity': 'Change velocity',
        'changeForce': 'Change force',
        'mercury': 'Mercury',
        'venus': 'Venus',
        'earth': 'Earth',
        'uranus': 'Uranus',
        'neptune': 'Neptune',
        'confirm': 'Confirm'
    },
    sk: {
        // Menu
        'ssm': 'Model slnečnej sústavy',
        'planets': 'Planéty',
        'about': 'O aplikácii',
        // Sidebar
        'names': 'Mená',
        'allPlanets': 'Pre všetky planéty',
        'singlePlanet': 'Pre planétu',
        'moonOrbit': 'Orbita mesiaca',
        'orbit': 'Orbita',
        'velocity': 'Rýchlosť',
        'newValue': 'Nová hodnota',
        'originalValues': 'Pôvodné hodnoty',
        'cosmicObject': 'Kozmický objekt',
        'addToPlanet': 'Pridať k planéte',
        'objectOrbit': 'Orbita objektu',
        'changeVelocity': 'Zmena rýchlosti',
        'changeForce': 'Zmena sily',
        'mercury': 'Merkúr',
        'venus': 'Venuša',
        'earth': 'Zem',
        'uranus': 'Urán',
        'neptune': 'Neptún',
        'confirm': 'Potvrdiť'
    }
}

$(function() {
    $('.translate').click(function() {
        var lang = $(this).attr('id');
        $('.lang').each(function(index, element) {
            $(this).text(arrLang[lang][$(this).attr('key')]);
        });
    });
})