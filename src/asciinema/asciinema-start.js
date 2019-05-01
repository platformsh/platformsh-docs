(function() {
    'use strict';

    /*
    This script causes any Asciinema player on a slide to start playing as soon as the slide
    is made active.

    It also sets some reasonable defaults for all players.
     */

    const defaultFontSize = '18px';

//    document.addEventListener('DOMContentLoaded', function() {
//
//        // Set some default values on Asciinema players.
//        let players = document.querySelectorAll('asciinema-player').forEach((player) => {
//            if (!player.hasAttribute('font-size')) {
//                player.setAttribute('font-size', defaultFontSize);
//            }
//            player.setAttribute('preload', 1);
//        });
//
//        // Set players to start automatically when their slide becomes active.
//        Reveal.addEventListener( 'slidechanged', startAsciinema);
//    });

    document.addEventListener('DOMContentLoaded', startAsciinema)

    var startAsciinema = function (event) {
        let players = event.currentSlide.querySelectorAll('asciinema-player');
        players.forEach((player) => player.play());
    };

})();
