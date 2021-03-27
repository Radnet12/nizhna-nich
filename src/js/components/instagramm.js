import InstagramFeed from "instafeed";
export const instagramm = () => {
    (function () {
        new InstagramFeed({
            'username': 'nizhna_nich',
            'container': document.querySelector(".insta__wrapper"),
            'display_profile': false,
            'display_biography': false,
            'display_gallery': true,
            'display_captions': false,
            'max_tries': 8,
            'callback': null,
            'styling': false,
            'items': 8,
            'items_per_row': 4,
            'margin': 1,
            'host': "https://images" + ~~(Math.random() * 3333) + "-focus-opensocial.googleusercontent.com/gadgets/proxy?container=none&url=https://www.instagram.com/",
            'lazy_load': true,
            'on_error': console.error
        });
    })();
};