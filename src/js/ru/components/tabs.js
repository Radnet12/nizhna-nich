import SwiperCore, {
    Navigation,
    Controller
} from 'swiper/core';

export const tabs = (tabsParentSelector, tabsSelector, tabsContentSelector, activeClass) => {
    const tabsParent = document.querySelector(tabsParentSelector);

    if (tabsParent) {
        const mediaQuery = window.matchMedia('(max-width: 1200px)');

        function handleTabletChange(e) {
            if (e.matches) {
                SwiperCore.use([Navigation, Controller]);
                const aboutContentSlider = new SwiperCore(".about-main__slider-content", {
                    slidesPerView: 1,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    }
                });
                const aboutHeadSlider = new SwiperCore(".about-main__slider-head", {
                    slidesPerView: 1,
                });
                aboutContentSlider.controller.control = aboutHeadSlider;
                aboutHeadSlider.controller.control = aboutContentSlider;
            } else {
                const tabs = tabsParent.querySelectorAll(tabsSelector),
                    tabsContent = document.querySelectorAll(tabsContentSelector);

                function hideTabContent() {
                    tabs.forEach((item, i) => {
                        item.classList.remove(activeClass.substring(1));
                    });
                    tabsContent.forEach(item => {
                        item.classList.add("hide");
                    });
                }

                function showTabContent(i = 0) {
                    tabs[i].classList.add(activeClass.substring(1));
                    tabsContent[i].classList.remove("hide");
                }
                hideTabContent();
                showTabContent();

                tabsParent.addEventListener('click', (e) => {
                    if (e.target && e.target.classList.contains(tabsSelector.substring(1))) {
                        tabs.forEach((item, i) => {
                            if (e.target === item) {
                                hideTabContent();
                                showTabContent(i);
                            }
                        });
                    }
                });
            }
        }
        mediaQuery.addListener(handleTabletChange);
        handleTabletChange(mediaQuery);
    }
};