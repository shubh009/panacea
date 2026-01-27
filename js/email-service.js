(function () {
    // Initialize EmailJS
    // REPLACE THESE VALUES WITH YOUR ACTUAL EMAILJS KEYS
    const EMAILJS_PUBLIC_KEY = "U5Of98ZdRy7tPJsvc"; // e.g. "user_..."
    const EMAILJS_SERVICE_ID = "service_l13wmlm"; // e.g. "service_..."
    const EMAILJS_TEMPLATE_ID = "template_0itve2w"; // e.g. "template_..."

    let isInitialized = false;

    function init() {
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_PUBLIC_KEY);
            isInitialized = true;
            console.log("EmailJS initialized");
        } else {
            console.error("EmailJS SDK not loaded");
        }
    }

    /**
     * Sends a form using EmailJS
     * @param {HTMLFormElement} formElement - The form element to send
     * @param {Object} additionalParams - Additional parameters to include (optional)
     * @returns {Promise} - Resolves on success, rejects on error
     */
    function sendForm(formElement, additionalParams = {}) {
        if (!isInitialized) init();

        const formData = new FormData(formElement);
        const params = Object.fromEntries(formData.entries());

        // Merge additional params
        const templateParams = { ...params, ...additionalParams };

        // Add standard metadata if not present
        if (!templateParams.page_source) {
            templateParams.page_source = window.location.pathname;
        }

        return emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams);
    }

    // Expose to window
    window.EmailService = {
        init,
        sendForm
    };

    // Auto-init specific forms if they match standard IDs
    document.addEventListener('DOMContentLoaded', () => {
        // We defer init until needed or explicit call, but good to check SDK availability
        if (typeof emailjs !== 'undefined') {
            init();
        }
    });

})();
