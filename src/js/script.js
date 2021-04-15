'use strict';
import {burger} from "./components/burger";
import { cart } from "./components/cart";
import { cartSlider } from "./components/cartSlider";
import { contacts } from "./components/contacts";
import { faq } from "./components/faq";
import { instagramm } from "./components/instagramm";
import { productSlider } from "./components/productSlider";
import { sidebar } from "./components/sidebar";
import { tabs } from "./components/tabs";
import { validateForms } from "./components/validateForms";
import "fslightbox";

window.addEventListener('DOMContentLoaded', () => {
    burger(".header__burger", ".header__nav");
    tabs(".about-main__tabs-head", ".about-main__tabs-head-item", ".about-main__tabs-content-item", ".about-main__tabs-head-item--active");
    instagramm();
    validateForms("input[type='tel']");
    contacts();
    sidebar();
    faq();
    productSlider();
    cartSlider();
    cart();
});