import InputMask from '../vendors/inputmask';
import JustValidate from '../vendors/just-validate';
export const validateForms = (inputSelector) => {
    const input = document.querySelectorAll(inputSelector);
    let im = new InputMask("+38 (999) 999-99-99");
    im.mask(input);

    let validateForms = (selector, rules) => {
        new window.JustValidate(selector, {
            rules: rules,
            messages: {
                name: "Будь ласка, введіть ім'я",
                phone: "Будь ласка, введіть номер телефону",
                email: {
                    required: "Будь ласка, введіть пошту",
                    email: "Будь ласка, введіть пошту корректно"
                },
                checkbox: "Поле є обов'язковим"
            },
            submitHandler: function (form) {
                let formData = new FormData(form);

                fetch('mail.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => {
                        if (response.ok) {
                            form.insertAdjacentHTML("beforeend", `
                            <div class="answer">
                                Спасибо! Мы с Вами свяжемся в ближайшее время!
                            </div>`)
                            form.reset();
                        } else {
                            form.insertAdjacentHTML("beforeend", `
                            <div class="answer">
                                К сожалению, что-то пошло не так! Попробуйте ещё раз!
                            </div>`)
                        }
                    })
                // setTimeout(() => {
                //     document.querySelectorAll(".answer").forEach(item => item.remove());
                // }, 4000);
            }
        });
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
};