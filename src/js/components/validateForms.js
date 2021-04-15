import InputMask from '../vendors/inputmask';
import JustValidate from '../vendors/just-validate';

export const validateForms = (inputSelector) => {
    const input = document.querySelectorAll(inputSelector);

    if (input.length > 0) {
        let im = new InputMask("+38 (999) 999-99-99");
        im.mask(input);
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
                    mailpost: "Будь ласка, введіть номер пошти"
                },
                submitHandler: function (form) {
                    let formData = new FormData(form);
                    let button = form.querySelector("button[type='submit']")
                    button.disabled = "true";

                    if (selector === ".checkout__form") {
                        const finalPrice = document.querySelector(".checkout__final-price span").textContent;
                        formData.append("Разом", finalPrice);
                        formData.append("Товары", localStorage.getItem("cart"));
                    }


                    fetch('mail.php', {
                            method: 'POST',
                            body: formData
                        })
                        .then(response => {
                            const thanksModal = document.querySelector(".thanks");

                            if (response.ok) {
                                thanksModal.classList.add("thanks--active");
                                document.body.classList.add("lock-sidebar");

                                setTimeout(() => {
                                    thanksModal.classList.remove("thanks--active");
                                    document.body.classList.remove("lock-sidebar");
                                }, 2500);
                                form.reset();
                            } else {
                                thanksModal.querySelector("p").textContent = "Щось пішло не так. Спробуйте ще раз!";
                                thanksModal.classList.add("thanks--active");
                                document.body.classList.add("lock-sidebar");

                                setTimeout(() => {
                                    thanksModal.classList.remove("thanks--active");
                                    document.body.classList.remove("lock-sidebar");
                                }, 2500);
                            }
                        })
                    setTimeout(() => {
                        document.querySelectorAll(".answer").forEach(item => item.remove());
                        button.disabled = "";
                    }, 4000);
                }
            });
        }
    }

    validateForms(".contacts__form", {
        name: {
            required: true,
            minLength: 2
        },
        phone: {
            required: true
        },
        email: {
            required: true,
            email: true
        },
        checkbox: {
            required: true
        }
    });
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
};