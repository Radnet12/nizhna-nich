export const tabs = (tabsParentSelector, tabsSelector, tabsContentSelector, activeClass) => {
    const tabsParent = document.querySelector(tabsParentSelector),
        tabs = tabsParent.querySelectorAll(tabsSelector),
        tabsContent = document.querySelectorAll(tabsContentSelector);

    function hideTabContent() {
        tabs.forEach((item, i) => {
            item.classList.remove(activeClass.substring(1));
        });
        tabsContent.forEach(item => {
            item.classList.add("hide");
        });
    }

    function showTabContent(i = 0) {
        tabs[i].classList.add(activeClass.substring(1));
        tabsContent[i].classList.remove("hide");
    }
    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (e) => {
        if (e.target && e.target.classList.contains(tabsSelector.substring(1))) {
            tabs.forEach((item, i) => {
                if (e.target === item) {
                    hideTabContent();
                    showTabContent(i);
                }
            });
        }
    });
};