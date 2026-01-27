document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('consultation-form');
    // If form specific to this page exists
    if (!form) return;

    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const serviceInput = document.getElementById('service');
    const toastContainer = document.getElementById('toast-container');

    // Toast Notification System
    const showToast = (message, type = 'error') => {
        if (!toastContainer) return; // Guard clause

        const toast = document.createElement('div');

        // Colors based on type
        const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-500';
        const icon = type === 'success'
            ? '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>'
            : '<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>';

        toast.className = `${bgColor} text-white px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 transform transition-all duration-300 translate-y-10 opacity-0 min-w-[300px]`;
        toast.innerHTML = `
            <span>${icon}</span>
            <span class="font-medium">${message}</span>
        `;

        toastContainer.appendChild(toast);

        // Animate in
        requestAnimationFrame(() => {
            toast.classList.remove('translate-y-10', 'opacity-0');
        });

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.add('translate-y-10', 'opacity-0');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    };

    // Expose globally
    window.showToast = showToast;

    // Validation Functions
    const validateName = () => {
        if (nameInput && nameInput.value.trim().length < 2) {
            return { valid: false, msg: 'Please enter a valid full name' };
        }
        return { valid: true };
    };

    const validatePhone = () => {
        const phoneRegex = /^[0-9]{10}$/; // Simple 10 digit check
        const cleanPhone = phoneInput ? phoneInput.value.replace(/[\s-]/g, '') : '';

        if (phoneInput && !phoneRegex.test(cleanPhone)) {
            return { valid: false, msg: 'Please enter a valid 10-digit phone number' };
        }
        return { valid: true };
    };

    const validateService = () => {
        if (serviceInput && (serviceInput.value === "" || serviceInput.value === null)) {
            return { valid: false, msg: 'Please select a service from the list' };
        }
        return { valid: true };
    };

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const nameCheck = validateName();
        if (!nameCheck.valid) {
            showToast(nameCheck.msg, 'error');
            if (nameInput) nameInput.focus();
            return;
        }

        const phoneCheck = validatePhone();
        if (!phoneCheck.valid) {
            showToast(phoneCheck.msg, 'error');
            if (phoneInput) phoneInput.focus();
            return;
        }

        const serviceCheck = validateService();
        if (!serviceCheck.valid) {
            showToast(serviceCheck.msg, 'error');
            if (serviceInput) serviceInput.focus();
            return;
        }

        // Submit via EmailJS
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Sending...</span>
        `;

        if (window.EmailService) {
            window.EmailService.sendForm(form, { form_name: 'Hero Consultation' })
                .then(() => {
                    showToast('Consultation request sent successfully!', 'success');
                    form.reset();
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalContent;
                    // Optional redirect
                    // window.location.href = '/thank-you.html';
                })
                .catch((err) => {
                    console.error(err);
                    showToast('Failed to send request. Please try again.', 'error');
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalContent;
                });
        } else {
            console.error("EmailService not found");
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
            showToast('Service unavailable. Please call us.', 'error');
        }
    });
});
