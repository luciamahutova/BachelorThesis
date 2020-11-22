let arrLang = {
    en: {
        'home': 'Home',
        'about': 'About Us',
        'contact': 'Contact US'
    },

    es: {
        'home': 'casa',
        'about': 'sobre nosotros',
        'contact': 'Contáctenos'
    }
}

$(function() {
    let lang = localStorage.getItem('language');
    changeLanguage(lang);

    $('.translate').click(function() {
        lang = $(this).attr('id');
        console.log("lang: " + lang);
        localStorage.setItem('language', lang);
        changeLanguage(lang);
    });

    function changeLanguage(lang) {
        $('.lang').each(function(index, element) {
            $(this).text(arrLang[lang][$(this).attr('key')]);
        });
    }

})