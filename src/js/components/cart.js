export const cart = () => {
    const cartWrapper = document.querySelector(".cart__wrapper"),
        checkoutWrapper = document.querySelector(".checkout__cart"),
        thanksModal = document.querySelector(".thanks");

    let cartArray = [];

    const countQuantityOfProducts = () => {
        if (JSON.parse(localStorage.getItem("cart")) !== null) {
            const counter = document.querySelector(".header__cart-counter");
            counter.textContent = JSON.parse(localStorage.getItem("cart")).length;
        }
    };
    const checkTheAvailabilityOfProducts = () => {
        if (JSON.parse(localStorage.getItem("cart")) !== null && JSON.parse(localStorage.getItem("cart")).length !== 0) {
            const addToCartBtn = document.querySelector("[data-add-to-cart]"),
                addAdditionToCart = document.querySelector("[data-add-addition]"),
                addExtraBtn = document.querySelector("[data-add-extra]");

            if (addToCartBtn || addAdditionToCart || addExtraBtn) {
                const cartArray = JSON.parse(localStorage.getItem("cart"));

                cartArray.forEach(item => {
                    if (item.type === "goods") {
                        if (addToCartBtn) {
                            const isInCart = document.querySelector(`[data-id="${item.id}"]`);

                            if (isInCart) {
                                addToCartBtn.textContent = "Товар у кошику";
                            }
                        }
                    } else if (item.type === "adds") {
                        if (addAdditionToCart) {
                            const isInCart = document.querySelector(`[data-id="${item.id}"]`);

                            if (isInCart) {
                                addAdditionToCart.textContent = "Товар у кошику";
                                isInCart.checked = true;
                                isInCart.disabled = true;
                            };
                        }
                    } else if (item.type === "extra") {
                        if (addExtraBtn) {
                            const isInCart = document.querySelector(`[data-id="${item.id}"]`);

                            if (isInCart) {
                                addExtraBtn.textContent = "Товар у кошику";
                                isInCart.checked = true;
                                isInCart.disabled = true;
                            }
                        }
                    }
                });
            }
        }
    };
    const initializeInput = () => {
        const calcInputs = document.querySelectorAll("input[data-input]");

        if (calcInputs) {
            calcInputs.forEach(input => {
                const itemId = input.closest(".cart__item") || input.closest(".cart-checkout__item");

                input.addEventListener("input", (e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/, "");

                    if (e.target.value.length < 1) {
                        e.target.value = 1;
                    }

                    if (itemId) {
                        const cartArray = JSON.parse(localStorage.getItem("cart"));

                        cartArray.forEach((item, index) => {
                            if (item.id === itemId.getAttribute("data-id")) {
                                cartArray[index].quantity = +e.target.value;
                            }
                        });

                        localStorage.setItem("cart", JSON.stringify(cartArray));
                        countTotalPrice();
                    }
                });
            });
        }
    };
    const intializePromocode = () => {
        fetch("promocode.json")
            .then(response => response.json())
            .then(({
                promocodes
            }) => {
                const input = document.querySelector(".checkout__promocode input");

                const searchPromocode = (value) => {
                    for (let i = 0; i < promocodes.length; i++) {
                        if (promocodes[i].promocode === value) {
                            countTotalPrice(promocodes[i].discount);
                            break;
                        } else {
                            countTotalPrice();
                        }
                    }
                };

                input.addEventListener("input", (e) => {
                    searchPromocode(e.target.value);
                });
            });
    };
    const countTotalPrice = (discount = null) => {
        if (JSON.parse(localStorage.getItem("cart")) !== null && JSON.parse(localStorage.getItem("cart")).length !== 0) {
            const cartArray = JSON.parse(localStorage.getItem("cart"));
            let placeOfPrice = document.querySelector(".cart__final-price span");

            if (!placeOfPrice) {
                placeOfPrice = document.querySelector(".checkout__final-price span");
            }

            if (placeOfPrice) {
                let result = cartArray.reduce((sum, current) => {
                    return sum + (+current.price * current.quantity);
                }, 0);

                if (discount) {
                    result = result * ((100 - discount) / 100);
                }

                placeOfPrice.textContent = result.toFixed(0);
            }
        }
    };
    const locateExtraInTheCorrectPlace = (id, title, price, additionalText, forWhatProduct) => {
        const placeForItemsParent = document.querySelector(".cart-checkout__additions");

        if (placeForItemsParent) {
            const placeForItems = placeForItemsParent.querySelector(".info-product__extras");

            placeForItemsParent.style.display = "";

            if (additionalText) {
                placeForItems.insertAdjacentHTML("afterbegin", `
                    <li class="info-product__extra">
                        <label>
                            <input type="checkbox" name="Додатково" checked data-id="${id}">
                            <span class="info-product__extra-name">
                                ${title} (для ${forWhatProduct})
                            </span>
                            <span class="info-product__extra-price"> ${price}</span> грн
                            <span class="info-product__extra-text">${additionalText}</span>
                        </label>
                    </li>
                `);
                return;
            }

            placeForItems.insertAdjacentHTML("afterbegin", `
                    <li class="info-product__extra">
                        <label>
                            <input type="checkbox" name="Додатково" checked data-id="${id}">
                            <span class="info-product__extra-name">
                                ${title} (для ${forWhatProduct})
                            </span>
                            <span class="info-product__extra-price"> ${price}</span> грн
                        </label>
                    </li>
                `);
        }
    };
    const showCorrectCard = () => {
        if (cartWrapper) {
            const placeOfItems = cartWrapper.querySelector(".cart__list"),
                placeForPrice = cartWrapper.querySelector(".cart__final");


            if (JSON.parse(localStorage.getItem("cart")) !== null && JSON.parse(localStorage.getItem("cart")).length !== 0) {

                cartArray = JSON.parse(localStorage.getItem("cart"));
                placeForPrice.style.display = "";
                Array.from(placeOfItems.children).forEach(item => item.remove());

                placeOfItems.insertAdjacentHTML("beforeend", cartArray.map(({
                    id,
                    img,
                    title,
                    price,
                    size,
                    quantity,
                    type,
                    href,
                    color,
                    additionalText,
                    forWhatProduct
                }) => {
                    if (type === "goods") {
                        const cartImg = img.split("/"),
                            indexOfName = cartImg.findIndex(item => item === "products");

                        cartImg[indexOfName] = "cart";
                        return `
                                    <li class="cart__item" data-id="${id}">
                                        <article class="card-cart">
                                            <div class="card-cart__image">
                                                <a href="${href}">
                                                    <img src="${cartImg.join("/")}" alt="${title}">
                                                </a>
                                            </div>
                                            <div class="card-cart__info">
                                                <h2 class="card-cart__title">
                                                    <a href="${href}">
                                                        ${title} (${size})
                                                    </a>
                                                </h2>
                                                <div class="card-cart__price">
                                                    <span>${price}</span> грн
                                                </div>
                                                <div class="card-cart__calc">
                                                    <button class="card-cart__calc-btn"
                                                        aria-label="Зменшити кількість товару на одну единицю" data-control="minus">
                                                        -
                                                    </button>
                                                    <input class="card-cart__calc-input" type="text" value="${quantity}"
                                                        aria-label="Поле для запису кількості товару" data-input>
                                                    <button class="card-cart__calc-btn"
                                                        aria-label="Збільшити кількість товару на одну единицю" data-control="plus">
                                                        +
                                                    </button>
                                                </div>
                                                <button class="card-cart__close" data-remove aria-label="Видалити товар з корзини"></button>
                                            </div>
                                        </article>
                                    </li>
                                `
                    } else if (type === "adds") {
                        const cartImg = img.split("/"),
                            indexOfName = cartImg.findIndex(item => item === "products");

                        cartImg[indexOfName] = "cart";
                        return `
                                <li class="cart__item" data-id="${id}">
                                    <article class="card-cart">
                                        <div class="card-cart__image">
                                            <a href="product-page.html">
                                                <img src="${cartImg.join("/")}" alt="${title}">
                                            </a>
                                        </div>
                                        <div class="card-cart__info">
                                            <h2 class="card-cart__title">
                                                <a href="product-page.html">
                                                    ${title}
                                                </a>
                                            </h2>
                                            <div class="card-cart__descr">
                                                Колір "${color}"
                                            </div>
                                            <div class="card-cart__price">
                                                <span>${price}</span> грн
                                            </div>
                                            <div class="card-cart__calc">
                                                <button class="card-cart__calc-btn"
                                                    aria-label="Зменшити кількість товару на одну единицю" data-control="minus">
                                                    -
                                                </button>
                                                <input class="card-cart__calc-input" type="text" value="${quantity}"
                                                    aria-label="Поле для запису кількості товару" data-input>
                                                <button class="card-cart__calc-btn"
                                                    aria-label="Збільшити кількість товару на одну единицю" data-control="plus">
                                                    +
                                                </button>
                                            </div>
                                            <button class="card-cart__close" data-remove aria-label="Видалити товар з корзини"></button>
                                        </div>
                                    </article>
                                </li>
                            `
                    } else if (type === "extra") {
                        locateExtraInTheCorrectPlace(id, title, price, additionalText, forWhatProduct);
                    }
                }).join(""));
                initializeInput();
            } else {
                placeForPrice.style.display = "none";
                placeOfItems.insertAdjacentHTML("beforeend", `
                        <li class="cart__empty">
                            <h2 class="section__title">Ваша корзина порожня</h2>
                            <div class="cart__empty-subtitle">
                                Ви маєте можливість повернутися за покупками
                            </div>
                            <a href="catalog.html" class="btn-primary">
                                Повернутися за покупками
                            </a>
                        </li>
                    `);
            }
        }

        if (checkoutWrapper) {
            const placeOfItems = checkoutWrapper.querySelector(".cart-checkout");

            if (JSON.parse(localStorage.getItem("cart")) !== null && JSON.parse(localStorage.getItem("cart")).length !== 0) {

                cartArray = JSON.parse(localStorage.getItem("cart"));

                placeOfItems.insertAdjacentHTML("beforeend", cartArray.map(({
                    id,
                    img,
                    title,
                    price,
                    size,
                    quantity,
                    type,
                    color,
                    additionalText,
                    forWhatProduct
                }) => {
                    if (type === "goods") {
                        const cartImg = img.split("/"),
                            indexOfName = cartImg.findIndex(item => item === "products");

                        cartImg[indexOfName] = "cart";
                        return `
                                <li class="cart-checkout__item" data-id="${id}">
                                    <div class="cart-checkout__image">
                                        <img src="${cartImg.join("/")} alt="${title}">
                                    </div>
                                    <div class="cart-checkout__info">
                                        <div class="cart-checkout__title">
                                            ${title} (${size})
                                        </div>
                                        <div class="cart-checkout__price">
                                            ${price} грн
                                        </div>
                                        <div class="cart-checkout__calc">
                                            <button class="cart-checkout__calc-btn"
                                                aria-label="Зменшити кількість товару на одну єдиницю" data-control="minus">
                                                -
                                            </button>
                                            <input type="text" class="cart-checkout__calc-input" value="${quantity}" data-input>
                                            <button class="cart-checkout__calc-btn"
                                                aria-labe="Збільшити кількість товару на одну єдиницю" data-control="plus">
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <button class="cart-checkout__close" data-remove aria-label="Видалити товар з корзини"></button>
                                </li>
                            `
                    } else if (type === "adds") {
                        const cartImg = img.split("/"),
                            indexOfName = cartImg.findIndex(item => item === "products");

                        cartImg[indexOfName] = "cart";
                        return `
                                <li class="cart-checkout__item" data-id="${id}">
                                    <div class="cart-checkout__image">
                                        <img src="${cartImg.join("/")} alt="${title}">
                                    </div>
                                    <div class="cart-checkout__info">
                                        <div class="cart-checkout__title">
                                            ${title}
                                        </div>
                                        <div class="cart-checkout__subtitle">
                                            ${color}
                                        </div>
                                        <div class="cart-checkout__price">
                                            ${price} грн
                                        </div>
                                        <div class="cart-checkout__calc">
                                            <button class="cart-checkout__calc-btn"
                                                aria-label="Зменшити кількість товару на одну єдиницю" data-control="minus">
                                                -
                                            </button>
                                            <input type="text" class="cart-checkout__calc-input" value="${quantity}" data-input>
                                            <button class="cart-checkout__calc-btn"
                                                aria-labe="Збільшити кількість товару на одну єдиницю" data-control="plus">
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <button class="cart-checkout__close" data-remove aria-label="Видалити товар з корзини"></button>
                                </li>
                            `
                    } else if (type === "extra") {
                        locateExtraInTheCorrectPlace(id, title, price, additionalText, forWhatProduct);
                    }
                }).join(""));
                initializeInput();
                intializePromocode();
            } else {
                window.location.href = 'catalog.html';
            }
        };
    };

    window.addEventListener("click", (e) => {
        // Логика счетчика
        if (e.target && e.target.hasAttribute("data-control")) {
            const btn = e.target.getAttribute("data-control"),
                itemId = e.target.closest(".cart__item") || e.target.closest(".cart-checkout__item");


            if (btn === "minus") {
                const input = e.target.nextElementSibling;

                if (+input.value > 1) {
                    input.value -= 1;

                    if (itemId) {
                        const cartArray = JSON.parse(localStorage.getItem("cart"));

                        cartArray.forEach((item, index) => {
                            if (item.id === itemId.getAttribute("data-id")) {
                                cartArray[index].quantity -= 1;
                            }
                        });

                        localStorage.setItem("cart", JSON.stringify(cartArray));
                        countTotalPrice();
                    }
                }

            } else if (btn === "plus") {
                const input = e.target.previousElementSibling;

                input.value = 1 + +input.value;

                if (itemId) {
                    const cartArray = JSON.parse(localStorage.getItem("cart"));

                    cartArray.forEach((item, index) => {
                        if (item.id === itemId.getAttribute("data-id")) {
                            cartArray[index].quantity += 1;
                        }
                    });

                    localStorage.setItem("cart", JSON.stringify(cartArray));
                    countTotalPrice();
                }
            }
        }
        // Логика изменения цены при изменении размера постельного
        if (e.target && e.target.classList.contains("info-product__size-item--label")) {
            const price = e.target.querySelector(".info-product__size-item--price").textContent,
                pricePlace = document.querySelector(".info-product__final-price span");

            pricePlace.textContent = price;
        }
        // Логика добавления товара в корзину
        if (e.target && e.target.hasAttribute("data-add-to-cart")) {
            const checkedInput = document.querySelector(".info-product__size-item--label input:checked");

            const cardInfo = {
                id: checkedInput.getAttribute("data-id"),
                img: document.querySelector(".product__images-item--main img").src,
                href: window.location.href,
                title: document.querySelector(".info-product__title").textContent,
                price: document.querySelector(".info-product__final-price span").textContent,
                size: checkedInput.closest(".info-product__size-item--label").querySelector(".info-product__size-item--name").textContent,
                quantity: +document.querySelector(".info-product__final-calc--input").value,
                type: "goods"
            };

            if (JSON.parse(localStorage.getItem("cart")) !== null && JSON.parse(localStorage.getItem("cart")).length > 0) {
                cartArray = JSON.parse(localStorage.getItem("cart"));

                let isAdded = cartArray.findIndex(({
                    id
                }) => id === cardInfo.id);

                if (isAdded !== -1) {
                    cartArray[isAdded].quantity = cartArray[isAdded].quantity + cardInfo.quantity;
                } else {
                    cartArray.push(cardInfo);
                }
            } else {
                cartArray.push(cardInfo);
            }

            e.target.textContent = "Додати ще";
            thanksModal.classList.add("thanks--active");
            document.body.classList.add("lock-sidebar");

            setTimeout(() => {
                thanksModal.classList.remove("thanks--active");
                document.body.classList.remove("lock-sidebar");
            }, 1500);

            localStorage.setItem("cart", JSON.stringify(cartArray));
            countQuantityOfProducts();
        }

        // Логика добавления наволочки в корзину
        if (e.target && e.target.hasAttribute("data-add-addition")) {
            let checkedInputs = document.querySelector(".info-product__addition");

            if (checkedInputs) {
                checkedInputs = document.querySelectorAll(".info-product__addition input:checked:not(:disabled)");
            } else {
                checkedInputs = document.querySelectorAll(".cart__additions-item input:checked:not(:disabled");
            }


            if (checkedInputs.length > 0) {
                let cartArray = [];
                checkedInputs.forEach(item => {
                    const parent = item.closest(".info-product__addition") || item.closest(".cart__additions-item");

                    let cardInfo = {};

                    if (parent.classList.contains("info-product__addition")) {
                        cardInfo = {
                            id: item.getAttribute("data-id"),
                            img: parent.querySelector(".info-product__addition-image img").src,
                            title: "Акцента пара наволочок",
                            price: parent.querySelector(".info-product__addition-info--price span").textContent,
                            color: parent.querySelector(".info-product__addition-name").textContent,
                            quantity: 1,
                            type: "adds"
                        };
                    } else {
                        cardInfo = {
                            id: item.getAttribute("data-id"),
                            img: parent.querySelector(".cart__additions-image img").src,
                            title: "Акцента пара наволочок",
                            price: parent.querySelector(".cart__additions-price span").textContent,
                            color: parent.querySelector(".cart__additions-name").textContent,
                            quantity: 1,
                            type: "adds"
                        };
                    }

                    if (JSON.parse(localStorage.getItem("cart")) !== null && JSON.parse(localStorage.getItem("cart")).length > 0) {
                        cartArray = JSON.parse(localStorage.getItem("cart"));

                        let isAdded = cartArray.findIndex(({
                            id
                        }) => id === cardInfo.id);

                        if (isAdded === -1) {
                            cartArray.push(cardInfo);
                            localStorage.setItem("cart", JSON.stringify(cartArray));
                        }
                    } else {
                        cartArray.push(cardInfo);
                        localStorage.setItem("cart", JSON.stringify(cartArray));
                    }
                    item.checked = true;
                    item.disabled = true;
                });

                e.target.textContent = "Додати ще";
                thanksModal.classList.add("thanks--active");
                document.body.classList.add("lock-sidebar");

                setTimeout(() => {
                    thanksModal.classList.remove("thanks--active");
                    document.body.classList.remove("lock-sidebar");
                }, 1500);

                countQuantityOfProducts();
                showCorrectCard();
                initializeInput();
                countTotalPrice();
            }
        }
        // Логика удаления товара из корзину
        if (e.target && e.target.hasAttribute("data-remove")) {
            const item = e.target.closest(".cart__item") || e.target.closest(".cart-checkout__item"),
                itemId = item.getAttribute("data-id");

            const cartArray = JSON.parse(localStorage.getItem("cart"));
            const index = cartArray.findIndex(obj => obj.id === itemId);
            cartArray.splice(index, 1);
            item.remove();

            const inputDisabledFalse = document.querySelector(`[data-id="${itemId}"]`);

            if (inputDisabledFalse) {
                inputDisabledFalse.checked = false;
                inputDisabledFalse.disabled = false;
            }

            localStorage.setItem("cart", JSON.stringify(cartArray));

            if (cartArray.length === 0) {
                showCorrectCard();
            }
            countTotalPrice();
            countQuantityOfProducts();
            checkTheAvailabilityOfProducts();
        }

        // Логика добавления дополнительных в коризну
        if (e.target && e.target.hasAttribute("data-add-extra")) {
            let checkedInputs = document.querySelectorAll(".info-product__extra input:checked:not(:disabled)");

            if (checkedInputs) {
                let cartArray = [];

                checkedInputs.forEach(item => {
                    const parent = item.closest(".info-product__extra");
                    let additionalText = parent.querySelector(".info-product__extra-text");

                    if (additionalText) {
                        additionalText = additionalText.textContent;
                    } else {
                        additionalText = null;
                    }

                    const cardInfo = {
                        id: item.getAttribute("data-id"),
                        title: parent.querySelector(".info-product__extra-name").textContent,
                        price: parent.querySelector(".info-product__extra-price").textContent,
                        additionalText: additionalText,
                        forWhatProduct: document.querySelector(".info-product__title").textContent,
                        quantity: 1,
                        type: "extra"
                    };

                    if (JSON.parse(localStorage.getItem("cart")) !== null && JSON.parse(localStorage.getItem("cart")).length > 0) {
                        cartArray = JSON.parse(localStorage.getItem("cart"));

                        let isAdded = cartArray.findIndex(({
                            id
                        }) => id === cardInfo.id);

                        if (isAdded === -1) {
                            cartArray.push(cardInfo);
                            localStorage.setItem("cart", JSON.stringify(cartArray));
                        }
                    } else {
                        cartArray.push(cardInfo);
                        localStorage.setItem("cart", JSON.stringify(cartArray));
                    }
                });

                e.target.textContent = "Додати ще";
                thanksModal.classList.add("thanks--active");
                document.body.classList.add("lock-sidebar");

                setTimeout(() => {
                    thanksModal.classList.remove("thanks--active");
                    document.body.classList.remove("lock-sidebar");
                }, 1500);

                countQuantityOfProducts();
                countTotalPrice();
                checkTheAvailabilityOfProducts();
            }
        }

        if (e.target && e.target.closest(".cart-checkout__additions")) {
            const itemParent = e.target.closest(".info-product__extra"),
                id = itemParent.querySelector("input:checked").getAttribute("data-id");


            if (id) {
                let cartArray = JSON.parse(localStorage.getItem("cart"));
                const parentMain = e.target.closest(".cart-checkout__additions");

                const resultIndex = cartArray.findIndex(item => item.id === id);
                cartArray.splice(resultIndex, 1);
                localStorage.setItem("cart", JSON.stringify(cartArray));
                itemParent.remove();

                if (cartArray.length === 0) {
                    showCorrectCard();
                }

                const items = parentMain.querySelectorAll(".info-product__extra");
                if (items.length === 0) {
                    parentMain.style.display = "none";
                }

                countTotalPrice();
                countQuantityOfProducts();
            }
        }

        if (e.target && e.target.hasAttribute("data-delivery")) {
            const deliveryType = e.target.getAttribute("data-delivery"),
                parent = e.target.closest(".checkout__item");

            if (+deliveryType === 1) {
                if (parent.lastElementChild.classList.contains("checkout__delivery")) {
                    parent.lastElementChild.remove();
                }
                parent.insertAdjacentHTML("beforeend", `
                        <div class="checkout__delivery">
                            <div class="checkout__inputs-row">
                                <div class="checkout__input-wrapper">
                                    <input name="Область" placeholder="Оберіть область"
                                        class="checkout__input" data-validate-field="district">
                                </div>
                                <div class="checkout__input-wrapper">
                                    <input name="Місто" placeholder="Оберіть місто" class="checkout__input"
                                        data-validate-field="city">
                                </div>
                            </div>
                            <div class="checkout__inputs-row">
                                <div class="checkout__input-wrapper">
                                    <input name="Номер пошти" placeholder="Вкажіть номер пошти"
                                        class="checkout__input" data-validate-field="mailpost">
                                </div>
                            </div>
                        </div>
                `);
            } else if (+deliveryType === 2) {
                if (parent.lastElementChild.classList.contains("checkout__delivery")) {
                    parent.lastElementChild.remove();
                }
                parent.insertAdjacentHTML("beforeend", `
                        <div class="checkout__delivery">
                            <div class="checkout__inputs-row">
                                <div class="checkout__input-wrapper">
                                    <input name="Область" placeholder="Оберіть область"
                                        class="checkout__input" data-validate-field="district">
                                </div>
                                <div class="checkout__input-wrapper">
                                    <input name="Місто" placeholder="Оберіть місто" class="checkout__input"
                                        data-validate-field="city">
                                </div>
                            </div>
                            <div class="checkout__inputs-row">
                                <div class="checkout__input-wrapper">
                                    <input name="Адреса" placeholder="Вкажіть адресу" class="checkout__input"
                                        data-validate-field="adress">
                                </div>
                            </div>
                        </div>
                `);
            }
        }

        if (e.target && e.target.classList.contains("wrapper")) {
            thanksModal.classList.remove("thanks--active");
            document.body.classList.remove("lock-sidebar");
        }
    });

    checkTheAvailabilityOfProducts();
    showCorrectCard();
    initializeInput();
    countQuantityOfProducts();
    countTotalPrice();
}