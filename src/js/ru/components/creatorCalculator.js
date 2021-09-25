export const creatorCalculator = () => {
    const typeWrapper = document.querySelector("[data-type]");
    const pricePlace = document.querySelector(".order__price span");

    let isCombinationAdded = false;

    const checkCombination = (value1, value2, prices) => {
        if (
            value1 !== value2 &&
            value1.length > 0 &&
            value2.length > 0 &&
            !isCombinationAdded
        ) {
            console.log("First");

            pricePlace.textContent =
                +pricePlace.textContent + +prices.combination;

            isCombinationAdded = true;
        } else if (isCombinationAdded && value1 === value2) {
            console.log("Second");
            pricePlace.textContent =
                +pricePlace.textContent - +prices.combination;
            isCombinationAdded = false;
        }
    };

    const setClickListenerToSizes = (
        wrapper,
        stretchBtn,
        prices,
        additionalInput,
        isPairWasAdded,
        blanketInput,
        sheetInput
    ) => {
        wrapper.addEventListener("click", (e) => {
            if (e.target.hasAttribute("data-price")) {
                if (e.target.getAttribute("data-price") !== "custom") {
                    pricePlace.textContent =
                        e.target.getAttribute("data-price");

                    if (stretchBtn.querySelector("input").checked) {
                        pricePlace.textContent =
                            +e.target.getAttribute("data-price") +
                            +prices.withStretch;
                    }

                    if (additionalInput.value.length > 0 && !isPairWasAdded) {
                        pricePlace.textContent =
                            +e.target.getAttribute("data-price") +
                            +prices.additionalPair;
                    }

                    if (
                        stretchBtn.querySelector("input").checked &&
                        additionalInput.value.length > 0 &&
                        !isPairWasAdded
                    ) {
                        pricePlace.textContent =
                            +e.target.getAttribute("data-price") +
                            +prices.additionalPair +
                            +prices.withStretch;
                    }

                    console.log("func start");
                    isCombinationAdded = false;
                    checkCombination(
                        blanketInput.value,
                        sheetInput.value,
                        prices
                    );
                } else {
                    pricePlace.textContent = "-";
                }
            }
        });
    };

    if (typeWrapper && pricePlace) {
        fetch("https://nizhna-nich.com/prices.json")
            .then((res) => res.json())
            .then(({ prices }) => {
                const sizesBtns = document.querySelectorAll("[data-price]");
                const sizesWrapper = document.querySelector("[data-size-btn]");
                const stretchBtn = document.querySelector("[data-stretch]");
                const additionalInput =
                    document.querySelector("[data-additional]");

                const blanketInput = document.querySelector(
                    "[data-input-blanket]"
                );
                const sheetInput = document.querySelector("[data-input-sheet]");

                let typeIndex = null;
                let isPairWasAdded = false;
                let isPairWasRemoved = false;
                let isClickListenerSet = false;

                typeWrapper.addEventListener("click", (e) => {
                    if (e.target.hasAttribute("data-type-index")) {
                        if (
                            typeIndex !==
                            e.target.getAttribute("data-type-index")
                        ) {
                            typeIndex =
                                e.target.getAttribute("data-type-index");

                            const checkedSize =
                                sizesWrapper.querySelector("input:checked");

                            for (
                                let i = 0;
                                i < prices[typeIndex].sizesPrices.length;
                                i++
                            ) {
                                sizesBtns[i].setAttribute(
                                    "data-price",
                                    prices[typeIndex].sizesPrices[i]
                                );
                            }

                            isPairWasAdded = false;
                            additionalInput.value = "";
                            isPairWasRemoved = true;

                            blanketInput.value = "";
                            sheetInput.value = "";
                            isCombinationAdded = false;

                            if (checkedSize) {
                                stretchBtn.querySelector(
                                    "input"
                                ).checked = false;
                                checkedSize.click();
                            }
                        }

                        // запустили функцию для клика на размер
                        if (!isClickListenerSet) {
                            setClickListenerToSizes(
                                sizesWrapper,
                                stretchBtn,
                                prices[typeIndex],
                                additionalInput,
                                isPairWasAdded,
                                blanketInput,
                                sheetInput
                            );
                            isClickListenerSet = true;
                        }
                    }
                });

                stretchBtn.addEventListener("click", (e) => {
                    if (e.target.type === "checkbox" && typeIndex) {
                        if (e.target.checked) {
                            pricePlace.textContent =
                                +pricePlace.textContent +
                                +prices[typeIndex].withStretch;
                        } else {
                            pricePlace.textContent =
                                +pricePlace.textContent -
                                +prices[typeIndex].withStretch;
                        }
                    }
                });

                additionalInput.addEventListener("input", (e) => {
                    if (
                        e.target.value.length > 0 &&
                        typeIndex &&
                        !isPairWasAdded
                    ) {
                        isPairWasRemoved = false;
                        pricePlace.textContent =
                            +pricePlace.textContent +
                            +prices[typeIndex].additionalPair;
                        isPairWasAdded = true;
                    } else if (
                        e.target.value.length < 1 &&
                        typeIndex &&
                        !isPairWasRemoved
                    ) {
                        isPairWasAdded = false;
                        pricePlace.textContent =
                            +pricePlace.textContent -
                            +prices[typeIndex].additionalPair;
                        isPairWasRemoved = true;
                    }
                });

                blanketInput.addEventListener("input", () => {
                    checkCombination(
                        blanketInput.value,
                        sheetInput.value,
                        prices[typeIndex]
                    );
                });
                sheetInput.addEventListener("input", () => {
                    checkCombination(
                        blanketInput.value,
                        sheetInput.value,
                        prices[typeIndex]
                    );
                });
            });
    }
};
