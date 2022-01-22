export const faq = () => {
    const faqTitles = document.querySelectorAll(".faq__item-title");

    if (faqTitles) {
        faqTitles.forEach(faqTitle => {
            faqTitle.addEventListener("click", (e) => {
                const faqBody = e.target.nextElementSibling;
                e.target.classList.toggle("faq__item-title--active");

                if (faqBody.style.maxHeight) {
                    faqBody.style.maxHeight = "";
                    faqBody.style.paddingTop = "";
                } else {
                    faqBody.style.maxHeight = faqBody.scrollHeight + 15 + "px";
                    faqBody.style.paddingTop = "15px"
                }
            });
        });
    }
};