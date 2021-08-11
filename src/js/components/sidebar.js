export const sidebar = () => {
    const sidebar = document.querySelector(".category__sidebar");

    if (sidebar) {
        const triggerBtns = sidebar.querySelectorAll(".category__sidebar-arrow"),
            activeSidebar = sidebar.querySelector(".category__sidebar-item--active");

        triggerBtns.forEach(triggerBtn => {
            triggerBtn.addEventListener("click", (e) => {
                const parent = e.target.closest(".category__sidebar-item"),
                    body = parent.querySelector(".category__sidebar-body");

                parent.classList.toggle("category__sidebar-item--active");

                if (body.style.maxHeight) {
                    body.style.maxHeight = null;
                    body.style.marginTop = "";
                } else {
                    body.style.maxHeight = body.scrollHeight + "px";
                    body.style.marginTop = "15px";
                }
            });
        });

        if (activeSidebar) {
            const body = activeSidebar.querySelector(".category__sidebar-body");

            body.style.maxHeight = body.scrollHeight + "px";
            body.style.marginTop = "15px";
        }

        const mediaQuery = window.matchMedia('(max-width: 1150px)');

        function handleTabletChange(e) {
            if (e.matches) {
                const content = document.querySelector(".category__content"),
                    catalogBtn = document.querySelector(".category__catalog-btn"),
                    topOffset = catalogBtn.offsetTop;

                window.addEventListener("click", (e) => {
                    if (e.target.classList.contains("category__catalog-btn")) {
                        sidebar.classList.add("category__sidebar--active");
                        document.body.classList.add("lock");
                        document.body.classList.add("lock-sidebar");
                    } else if (e.target.classList.contains("wrapper")) {
                        sidebar.classList.remove("category__sidebar--active");
                        document.body.classList.remove("lock");
                        document.body.classList.remove("lock-sidebar");
                    } else if (e.target.classList.contains("category__sidebar-btn")) {
                        sidebar.classList.remove("category__sidebar--active");
                        document.body.classList.remove("lock");
                        document.body.classList.remove("lock-sidebar");
                    }
                });

                window.addEventListener("scroll", () => {
                    if (topOffset + window.pageYOffset >= content.scrollHeight - 70) {
                        catalogBtn.style.position = "absolute";
                        catalogBtn.style.top = content.scrollHeight - 70 + "px";
                    } else {
                        catalogBtn.style.position = "fixed";
                        catalogBtn.style.top = "";
                    }
                });
            }
        }
        mediaQuery.addListener(handleTabletChange);
        handleTabletChange(mediaQuery);
    };
}