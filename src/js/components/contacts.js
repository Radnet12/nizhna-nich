export const contacts = () => {
    const inputsWrapper = document.querySelectorAll(".contacts__input-wrapper");


    inputsWrapper.forEach(inputWrapper => {
        const input = inputWrapper.querySelector(".contacts__input"),
            label = inputWrapper.querySelector(".contacts__label");

        if (input && label) {
            input.addEventListener("mouseenter", () => {
                label.classList.add("contacts__label--focus");
            });
            input.addEventListener("mouseleave", (e) => {
                if (!label.classList.contains("label--focused") && e.target.value.length === 0) {
                    label.classList.remove("contacts__label--focus");
                }
            });
            input.addEventListener("focus", (e) => {
                label.classList.add("contacts__label--focus");
                label.classList.add("label--focused");
            });
            input.addEventListener("blur", (e) => {
                if (e.target.value.length === 0) {
                    label.classList.remove("contacts__label--focus");
                    label.classList.remove("label--focused");
                }
            });
        }
    });
};