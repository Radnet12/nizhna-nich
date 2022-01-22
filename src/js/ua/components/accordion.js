export const accordion = (accordionHeadsSelector, accordionHeadActiveClass, paddingTop) => {
    const accordionHeads = document.querySelectorAll(accordionHeadsSelector);

    if (accordionHeads) {
        accordionHeads.forEach(accordionHead => {
            accordionHead.addEventListener("click", (e) => {
                const accordionBody = e.target.nextElementSibling;
                e.target.classList.toggle(accordionHeadActiveClass);

                if (accordionBody.style.maxHeight) {
                    accordionBody.style.maxHeight = "";
                    accordionBody.style.paddingTop = "";
                } else {
                    accordionBody.style.maxHeight = accordionBody.scrollHeight + paddingTop + "px";
                    accordionBody.style.paddingTop = paddingTop + "px";
                }
            });
        });
    }
};