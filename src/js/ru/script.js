"use strict";
import "lazysizes";
import "lazysizes/plugins/parent-fit/ls.parent-fit";
import { burger } from "./components/burger";
import { cart } from "./components/cart";
import { faq } from "./components/faq";
import { instagramm } from "./components/instagramm";
import { productSlider } from "./components/productSlider";
import { sidebar } from "./components/sidebar";
import { tabs } from "./components/tabs";
import { validateForms } from "./components/validateForms";
import "fslightbox";
import { creatorSlider } from "./components/creatorSlider";
import { poshta } from "./components/poshta";
import modals from "./components/modal";
import { reviewsSlider } from "./components/reviewsSlider";
import { goTop } from "./components/goTop";
import { creatorCalculator } from "./components/creatorCalculator";
import { accordion } from "./components/accordion";
import { getAllItems } from "./components/getAllItems";

window.addEventListener("DOMContentLoaded", () => {
    burger(".header__burger", ".header__nav");
    tabs(
        ".about-main__tabs-head",
        ".about-main__tabs-head-item",
        ".about-main__tabs-content-item",
        ".about-main__tabs-head-item--active"
    );
    // instagramm();
    poshta();
    reviewsSlider();
    sidebar();
    faq();
    modals();
    productSlider();
    cart();
    creatorSlider();
    goTop();
    creatorCalculator();
    accordion(".info-product__tab-head", "info-product__tab-head--active", 15);
    getAllItems();
    validateForms("input[type='tel']");
});
