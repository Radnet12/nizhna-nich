export const getAllItems = () => {
    const getAllBtn = document.querySelector(".category__show-all");
    const productList = document.querySelector(".category__list");
    const productPagination = document.querySelector(".pagination");

    if (getAllBtn) {
        getAllBtn.addEventListener("click", () => {
            getItems()
        });
    }

    function getLabel(item) {
        if (item.label) {
            return `
                <div class="card-item__labels">
                    <span class="card-item__label ${
                        item.labelType === "red"
                            ? "card-item__label--red"
                            : "card-item__label--green"
                    }">${
                item.label
            }</span>
                </div>
            `;
        } else {
            return "";
        }
    }

    function getItems() {
        let params = window.location.search
            .replace("?", "")
            .split("&")
            .reduce(function (p, e) {
                let a = e.split("=");
                p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
                return p;
            }, {});

        let formData = new FormData();

        formData.append("category", params.category);
        formData.append("subcategory", params.subcategory);

        fetch("getGoods.php", {
            method: "POST",
            body: formData,
        })
            .then((data) => data.json())
            .then((result) => {
                productPagination.remove();
                getAllBtn.remove();

                Array.from(productList.children).forEach((item) =>
                    item.remove()
                );

                productList.insertAdjacentHTML("beforeend", result.map((item) => {
                    return `
                        <li class="category__list-item">
                            <article class="card-item">
                                <a href="./product?category=${
                                    item.category
                                }&productid=${item.id_product}">
                                    ${getLabel(item)}
                                    <div class="card-item__image">
                                        <img class="lazyload" src="img/ui/pattern.png" data-src="/${
                                            item.image
                                        }" alt="${item.title}">
                                    </div>
                                    <h2 class="card-item__title">
                                        ${item.title}
                                    </h2>
                                    <div class="card-item__info-price card-item__info-price--mobile">
                                        <span>${item.price}</span> грн
                                    </div>
                                    <div class="card-item__info">
                                        <div class="card-item__wrap">
                                            <div class="card-item__info-title">
                                                ${item.title}
                                            </div>
                                            <div class="card-item__info-price">
                                                <span>${item.price}</span> грн
                                            </div>
                                        </div>
                                        <button class="card-item__btn btn-primary">
                                            Посмотреть товар
                                        </button>
                                    </div>
                                </a>
                            </article>
                        </li>
                    `;
                }).join(""))
            });
    };
};