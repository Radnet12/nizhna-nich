export const burger = (burgerSelector, navSelector) => {
    const burger = document.querySelector(burgerSelector),
          body = document.body,
          nav = document.querySelector(navSelector);


    burger.addEventListener("click", (e) => {
        if (e.currentTarget) {
            burger.classList.toggle(`${burgerSelector.substring(1, burgerSelector.length)}--active`)
            nav.classList.toggle(`${navSelector.substring(1, navSelector.length)}--active`)
            body.classList.toggle("lock");
        }
    });
};