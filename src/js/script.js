'use strict';
import 'lazysizes';
import 'lazysizes/plugins/parent-fit/ls.parent-fit';
import {burger} from "./components/burger";
import { cart } from "./components/cart";
import { contacts } from "./components/contacts";
import { faq } from "./components/faq";
import { instagramm } from "./components/instagramm";
import { productSlider } from "./components/productSlider";
import { sidebar } from "./components/sidebar";
import { tabs } from "./components/tabs";
import { validateForms } from "./components/validateForms";
import "fslightbox";
import { creatorSlider } from './components/creatorSlider';
import { poshta } from './components/poshta';
import modals from './components/modal';

window.addEventListener('DOMContentLoaded', () => {
    burger(".header__burger", ".header__nav");
    tabs(".about-main__tabs-head", ".about-main__tabs-head-item", ".about-main__tabs-content-item", ".about-main__tabs-head-item--active");
    instagramm();
    poshta();
    validateForms("input[type='tel']");
    contacts();
    sidebar();
    faq();
    modals();
    productSlider();
    cart();
    creatorSlider();
});