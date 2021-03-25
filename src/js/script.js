'use strict';
import {burger} from "./components/burger";

window.addEventListener('DOMContentLoaded', () => {
    burger(".header__burger", ".header__nav", ".header__nav-item");
});