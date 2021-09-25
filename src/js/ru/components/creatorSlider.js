import SwiperCore, {
    Navigation
} from 'swiper/core';
export const creatorSlider = () => {
    const productWrapper = document.querySelectorAll(".mix__wrapper");
    const sizesInputs = document.querySelectorAll("[data-size-input]");
    const sizesBtn = document.querySelector("[data-size-btn]");

    if (productWrapper && sizesBtn) {
        const mediaQuery = window.matchMedia('(max-width: 1200px)');

        function handleTabletChange(e) {
            // если срабатывает условие по медиа выражению
            if (e.matches) {
                // инициализируем свайпер
                SwiperCore.use([Navigation]);
                productWrapper.forEach(el => {
                    const productSlider = new SwiperCore(el, {
                        // slidesPerView: "auto",
                        spaceBetween: 10,
                        breakpoints: {
                            320: {
                                slidesPerView: 2
                            },
                            576: {
                                slidesPerView: 2
                            },
                            768: {
                                slidesPerView: 5
                            },
                            992: {
                                slidesPerView: 6
                            }
                        }
                    });
                });
            }
        }
        mediaQuery.addListener(handleTabletChange);
        handleTabletChange(mediaQuery);

        sizesInputs.forEach(el => el.style.display = "none");

        sizesBtn.addEventListener("change", (e) => {
            if (e.target.hasAttribute("data-size-custom")) {
                sizesInputs.forEach(el => el.style.display = "");
            } else {
                sizesInputs.forEach(el => el.style.display = "none");
            }
        });
    }
};