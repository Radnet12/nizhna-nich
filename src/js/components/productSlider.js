import SwiperCore, {
    Pagination,
    Thumbs,
    Navigation
} from 'swiper/core';
export const productSlider = () => {
    SwiperCore.use([Pagination, Thumbs, Navigation]);

    const productWrapper = document.querySelector(".product__wrapper");

    const complectsSlider = new SwiperCore(".info-product__other", {
        slidesPerView: "auto",
        spaceBetween: 15,
        wrapperClass: "info-product__other-wrapper",
        slideClass: "info-product__other-slide",
        navigation: {
            nextEl: '.info-product__other-arrow .swiper-button-next',
            prevEl: '.info-product__other-arrow .swiper-button-prev',
        },
    });

    if (productWrapper) {
        const mediaQuery = window.matchMedia('(max-width: 1200px)');

        function handleTabletChange(e) {
            // если срабатывает условие по медиа выражению
            if (e.matches) {
                // инициализируем свайпер
                const productImagesSlider = new SwiperCore(".product__images-container", {
                    slidesPerView: 1,
                    spaceBetween: 50,
                    pagination: {
                        el: '.swiper-pagination',
                        type: 'bullets',
                    },
                    thumbs: {
                        swiper: {
                            el: ".product__images-thumbs",
                            slidesPerView: "auto",
                            spaceBetween: 10
                        }
                    }
                });

                // ищём заголовки, удаляем их и пермещаем
                const productTitle = productWrapper.querySelector(".info-product__title"),
                    productArticle = productWrapper.querySelector(".info-product__article");

                productTitle.remove();
                productArticle.remove();
                productWrapper.insertAdjacentHTML("afterbegin", `
                        <div class="info-product__mobile">
                            <h1 class="info-product__title">
                                ${productTitle.textContent}
                            </h1>
                            <div class="info-product__article">
                                Артикул: <span>${productArticle.querySelector("span").textContent}</span>
                            </div>
                        </div>
                `);
            } else {
                const productMobileTop = productWrapper.querySelector(".info-product__mobile"),
                    infoProductWrapper = productWrapper.querySelector(".info-product"),
                    productTitle = productWrapper.querySelector(".info-product__title").textContent,
                    productArticle = productWrapper.querySelector(".info-product__article span").textContent;

                if (productMobileTop) {
                    productMobileTop.remove();
                    infoProductWrapper.insertAdjacentHTML("afterbegin", `
                    <div class="info-product__article">
                        Артикул: <span>${productArticle}</span>
                    </div>
                    <h1 class="info-product__title">
                        ${productTitle}
                    </h1>
                `);
                }
            }
        }
        mediaQuery.addListener(handleTabletChange);
        handleTabletChange(mediaQuery);
    }
};