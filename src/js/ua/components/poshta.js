export const poshta = () => {
    const deliveryRadioButtons = document.querySelectorAll("input[data-delivery]");

    const clearResultList = (dropdown) => {
        const dropdownChildren = dropdown.children;

        if (dropdownChildren.length !== 0) {
            Array.from(dropdownChildren).forEach(el => el.remove());
        }
    };

    if (deliveryRadioButtons.length !== 0) {

        deliveryRadioButtons.forEach(deliveryRadioButton => {
            deliveryRadioButton.addEventListener("change", () => {
                if (deliveryRadioButton.checked) {
                    const inputCity = document.querySelector(".checkout__input--city");
                    const dropdown = document.querySelector(".checkout__result-list");

                    inputCity.addEventListener("input", (e) => {
                        if (e.target.value.length === 0) {
                            dropdown.classList.remove("checkout__result-list--active");
                        } else {
                            dropdown.classList.add("checkout__result-list--active");

                            setTimeout(() => {
                                const query = {
                                    apiKey: "8b1a41ff9051d97d61d607d85eac61bd",
                                    modelName: "Address",
                                    calledMethod: "searchSettlements",
                                    methodProperties: {
                                        CityName: e.target.value,
                                        Limit: 10
                                    }
                                };

                                fetch("https://api.novaposhta.ua/v2.0/json/", {
                                        method: "POST",
                                        body: JSON.stringify(query)
                                    })
                                    .then(response => response.json())
                                    .then(data => {
                                        const settlements = data.data;
                                        clearResultList(dropdown);

                                        if (settlements[0].TotalCount === 0) {
                                            dropdown.insertAdjacentHTML("beforeend", `
                                                <li class="checkout__result-item">Результатів не знайдено</li>
                                            `);
                                        } else {
                                            settlements[0].Addresses.forEach(settlement => {
                                                dropdown.insertAdjacentHTML("beforeend", `
                                                    <li class="checkout__result-item" data-ref="${settlement.DeliveryCity}">${settlement.Present}</li>
                                                `);
                                            });
                                        }
                                    })
                            }, 500);
                        }

                    });

                    dropdown.addEventListener("click", (e) => {
                        if (e.target.classList.contains("checkout__result-item")) {
                            inputCity.value = e.target.textContent;
                            dropdown.classList.remove("checkout__result-list--active");
                            clearResultList(dropdown);
                        }
                    });
                }
            });
        });
    }
};