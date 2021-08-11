const modals = () => {
    function actionsWithModal(modal, isAdd) {
        const windows = document.querySelectorAll('[data-modal]'),
            body = document.body;
        let paddingScroll = window.innerWidth - document.documentElement.clientWidth;

        windows.forEach(window => {
            window.classList.add('hide');
        });

        if (isAdd === 'yes') {
            modal.classList.add('show');
            body.classList.add('lock');
            body.style.marginRight = `${paddingScroll}px`;
        } else {
            modal.classList.remove('show');
            body.classList.remove('lock');
            body.style.marginRight = ``;
        }
    }

    function bindModal(triggerSelector, modalSelector, closeSelector, closeOverOverlay = true, closeOverOverlaySelector) {
        const triggers = document.querySelectorAll(triggerSelector),
            modal = document.querySelector(modalSelector),
            close = document.querySelector(closeSelector),
            overlay = document.querySelector(closeOverOverlaySelector);

        if (modal && overlay) {
            triggers.forEach(trigger => {
                trigger.addEventListener('click', (e) => {
                    if (e.target) {
                        e.preventDefault();
                    }
                    actionsWithModal(modal, 'yes');
                });
            });

            close.addEventListener('click', () => {
                actionsWithModal(modal, 'no');
            });

            overlay.addEventListener('click', (e) => {
                if (e.target.classList.contains("sizes__overlay") && closeOverOverlay) {
                    actionsWithModal(modal, 'no');
                }
            });
        }
    }

    bindModal(".order__prices", ".prices-modal", ".prices-modal__close", true, ".prices-modal .sizes__overlay");
};
export default modals;