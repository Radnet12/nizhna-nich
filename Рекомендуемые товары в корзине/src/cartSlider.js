import SwiperCore from 'swiper/core';

export const cartSlider = () => {

    const cartSlider = new SwiperCore(".cart__additions-slider", {
        slidesPerView: "auto",
        spaceBetween: 15,
        wrapperClass: "cart__additions-list",
        slideClass: "cart__additions-item"
    });
};