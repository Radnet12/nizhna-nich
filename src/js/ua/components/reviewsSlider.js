import SwiperCore, { Navigation } from "swiper/core";

export const reviewsSlider = () => {
    SwiperCore.use([Navigation]);
    const reviewSlider = new SwiperCore(".reviews .swiper-container", {
        spaceBetween: 20,
        autoHeight: true,
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
        breakpoints: {
            320: {
                slidesPerView: 1
            },
            720: {
                slidesPerView: 2
            },
            992: {
                slidesPerView: 3
            }
        }
    });
};