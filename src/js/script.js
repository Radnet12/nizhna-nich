'use strict';
import {burger} from "./components/burger";
import { contacts } from "./components/contacts";
import { faq } from "./components/faq";
import { instagramm } from "./components/instagramm";
import { sidebar } from "./components/sidebar";
import { tabs } from "./components/tabs";
import { validateForms } from "./components/validateForms";

window.addEventListener('DOMContentLoaded', () => {
    burger(".header__burger", ".header__nav");
    tabs(".about-main__tabs-head", ".about-main__tabs-head-item", ".about-main__tabs-content-item", ".about-main__tabs-head-item--active");
    instagramm();
    validateForms("input[type='tel']");
    contacts();
    sidebar();
    faq();
});