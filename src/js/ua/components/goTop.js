export const goTop = () => {
    const goTopBtn = document.querySelector(".go-top");

    if (goTopBtn) {
        const bodyHeight = document.body.offsetHeight;
        const footerHeight = document.querySelector(".footer").offsetHeight;
        const wrapper = document.querySelector(".wrapper").offsetHeight;

        window.addEventListener("scroll", () => {
            if (
                window.pageYOffset > bodyHeight / 2 &&
                window.pageYOffset + document.body.offsetHeight <
                    wrapper - footerHeight
            ) {
                goTopBtn.style.display = "flex";
            } else {
                goTopBtn.style.display = "";
            }
        });

        goTopBtn.addEventListener("click", () => {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        });
    }
};
