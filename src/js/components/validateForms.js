import InputMask from '../vendors/inputmask';
import JustValidate from '../vendors/just-validate';
import CryptoJS from 'crypto-js';

export const validateForms = (inputSelector) => {
    const input = document.querySelectorAll(inputSelector);
    const cardPay = document.querySelector("[data-card]");
    const thanksModal = document.querySelector(".thanks");


    if (input.length > 0) {
        let im = new InputMask("+38 (999) 999-99-99");
        im.mask(input);
    }

    const createDataForPay = () => {
        const orderReference = `DH${Math.floor(Math.random() * 10000000000)}`;
        const timeForNow = Date.now();
        const secretKey = "e39fdd05c458a7a73dcec288888adbe8aa823c64";

        const getArray = (type) => {
            const cart = JSON.parse(localStorage.getItem("cart"));

            let array = [];

            if (type === "names") {
                cart.forEach(obj => {
                    const name = obj.title.trim();
                    array.push(name);
                });
            } else if (type === "price") {
                cart.forEach(obj => {
                    const price = obj.price.trim();
                    array.push(price);
                });
            } else if (type === "count") {
                cart.forEach(obj => {
                    if (obj.quantity) {
                        array.push(obj.quantity);
                    } else {
                        array.push("1");
                    }
                });
            }

            return array;
        };

        const hashMd5 = CryptoJS.HmacMD5(`nizhna_nich_com;https://nizhna-nich.com/;${orderReference};${timeForNow};${document.querySelector(".checkout__final-price span").textContent};UAH;${getArray("names").join(";")};${getArray("count").join(";")};${getArray("price").join(";")}`, secretKey);

        return {
            merchantAccount: "nizhna_nich_com",
            merchantDomainName: "https://nizhna-nich.com/",
            authorizationType: "SimpleSignature",
            merchantSignature: hashMd5.toString(),
            orderReference: orderReference,
            orderDate: timeForNow,
            amount: document.querySelector(".checkout__final-price span").textContent,
            currency: "UAH",
            productName: getArray("names"),
            productPrice: getArray("price"),
            productCount: getArray("count"),
            clientFirstName: document.querySelector(".checkout__input--name").value,
            clientLastName: document.querySelector(".checkout__input--surname").value,
            clientEmail: document.querySelector(".checkout__input--mail").value,
            clientPhone: document.querySelector(".checkout__input--phone").value,
            language: "UA"
        }
    };

    let wayforpay = new Wayforpay();
    let pay = function (data) {
        wayforpay.run(data,
            function () {
                form.reset();
                localStorage.removeItem("cart");
                window.location.href = '/thankyou';
            },
            function () {
                thanksModal.querySelector("p").textContent = "Щось пішло не так. Спробуйте ще раз!";
                thanksModal.classList.add("thanks--active");
                document.body.classList.add("lock-sidebar");

                setTimeout(() => {
                    thanksModal.classList.remove("thanks--active");
                    document.body.classList.remove("lock-sidebar");
                }, 2500);
            },
            function () {
                thanksModal.querySelector("p").textContent = "Йде обробка. Зачекайте, будь ласка!";
                thanksModal.classList.add("thanks--active");
                document.body.classList.add("lock-sidebar");

                setTimeout(() => {
                    thanksModal.classList.remove("thanks--active");
                    document.body.classList.remove("lock-sidebar");
                }, 2500);
            }
        );
    }

    let validateForms = (selector, rules) => {
        if (document.querySelector(selector)) {
            new window.JustValidate(selector, {
                rules: rules,
                messages: {
                    name: "Будь ласка, введіть ім'я",
                    phone: "Будь ласка, введіть номер телефону",
                    email: {
                        required: "Будь ласка, введіть пошту",
                        email: "Будь ласка, введіть пошту корректно"
                    },
                    checkbox: "Поле є обов'язковим",
                    surname: "Будь ласка, введіть прізвище",
                    delivery: "Будь ласка, оберіть спосіб доставки",
                    payment: "Будь ласка, оберіть спосіб оплати",
                    district: "Будь ласка, введіть область",
                    city: "Будь ласка, введіть місто",
                    adress: "Будь ласка, введіть адресу",
                    mailpost: "Будь ласка, введіть номер пошти",
                    type: "Будь ласка, оберіть тип тканини",
                    size: "Будь ласка, оберіть розмір",
                    oneOne: "Введіть №",
                    twoOne: "Введіть №",
                    threeOne: "Оберіть розмір"
                },
                submitHandler: function (form) {
                    let formData = new FormData(form);
                    let button = form.querySelector("button[type='submit']")
                    button.disabled = "true";
                    if (selector === ".checkout__form") {
                        let tk;

                        grecaptcha.ready(function () {
                            grecaptcha.execute('6LcCB5UbAAAAAKW3tRg1zoVxjULSLs8myo-nPIfd', {
                                action: 'homepage'
                            }).then(function (token) {
                                tk = token;
                                document.getElementById("token").value = token;


                                const data = new URLSearchParams();

                                for (const pair of new FormData(document.querySelector(selector))) {
                                    data.append(pair[0], pair[1]);
                                }

                                fetch("captcha.php", {
                                        method: "POST",
                                        body: data
                                    })
                                    .then(response => response.json())
                                    .then(result => {
                                        if (result["om_score"] >= 0.5) {
                                            const finalPrice = document.querySelector(".checkout__final-price span").textContent;
                                            formData.append("Разом", finalPrice);
                                            formData.append("Товары", localStorage.getItem("cart"));


                                            fetch('mail.php', {
                                                    method: 'POST',
                                                    body: formData
                                                })
                                                .then(response => {

                                                    if (!cardPay.checked) {
                                                        if (response.ok) {
                                                            form.reset();
                                                            localStorage.removeItem("cart");
                                                            window.location.href = '/thankyou';
                                                        } else {
                                                            thanksModal.querySelector("p").textContent = "Щось пішло не так. Спробуйте ще раз!";
                                                            thanksModal.classList.add("thanks--active");
                                                            document.body.classList.add("lock-sidebar");

                                                            setTimeout(() => {
                                                                thanksModal.classList.remove("thanks--active");
                                                                document.body.classList.remove("lock-sidebar");
                                                            }, 2500);
                                                        }
                                                    }
                                                })


                                            if (cardPay && cardPay.checked) {
                                                const paymentData = createDataForPay();
                                                pay(paymentData);
                                            }
                                        } else {
                                            thanksModal.querySelector("p").textContent = "Щось пішло не так. Спробуйте ще раз!";
                                            thanksModal.classList.add("thanks--active");
                                            document.body.classList.add("lock-sidebar");

                                            setTimeout(() => {
                                                thanksModal.classList.remove("thanks--active");
                                                document.body.classList.remove("lock-sidebar");
                                            }, 2500);
                                        }
                                        setTimeout(() => {
                                            document.querySelectorAll(".answer").forEach(item => item.remove());
                                            button.disabled = "";
                                        }, 4000);
                                    })
                            });
                        });
                    } else {
                        fetch('mail.php', {
                                method: 'POST',
                                body: formData
                            })
                            .then(response => {

                                if (!cardPay.checked) {
                                    if (response.ok) {
                                        form.reset();
                                        localStorage.removeItem("cart");
                                        thanksModal.querySelector("p").textContent = "Дякуємо за підписку на новини!";
                                        thanksModal.classList.add("thanks--active");
                                        document.body.classList.add("lock-sidebar");

                                        setTimeout(() => {
                                            thanksModal.classList.remove("thanks--active");
                                            document.body.classList.remove("lock-sidebar");
                                        }, 2500);
                                    } else {
                                        thanksModal.querySelector("p").textContent = "Щось пішло не так. Спробуйте ще раз!";
                                        thanksModal.classList.add("thanks--active");
                                        document.body.classList.add("lock-sidebar");

                                        setTimeout(() => {
                                            thanksModal.classList.remove("thanks--active");
                                            document.body.classList.remove("lock-sidebar");
                                        }, 2500);
                                    }
                                }
                            })
                    }
                }
            });
        }
    }

    validateForms(".footer__mail-form", {
        email: {
            required: true,
            email: true
        }
    });
    validateForms(".checkout__form", {
        name: {
            required: true
        },
        surname: {
            required: true
        },
        phone: {
            required: true
        },
        email: {
            required: true,
            email: true
        },
        delivery: {
            required: true,
        },
        district: {
            required: true,
        },
        city: {
            required: true,
        },
        adress: {
            required: true,
        },
        mailpost: {
            required: true,
        },
        payment: {
            required: true,
        }
    });
    validateForms(".order__form", {
        name: {
            required: true
        },
        surname: {
            required: true
        },
        phone: {
            required: true
        },
        type: {
            required: true
        },
        size: {
            required: true
        },
        oneOne: {
            required: true
        },
        oneTwo: {
            required: true
        },
        twoOne: {
            required: true
        },
        twoTwo: {
            required: true
        },
        threeOne: {
            required: true
        },
    });
};