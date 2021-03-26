'use strict';
import {burger} from "./components/burger";
import { tabs } from "./components/tabs";

window.addEventListener('DOMContentLoaded', () => {
    burger(".header__burger", ".header__nav");
    tabs(".about-main__tabs-head", ".about-main__tabs-head-item", ".about-main__tabs-content-item", ".about-main__tabs-head-item--active");
});