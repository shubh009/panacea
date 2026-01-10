document.addEventListener('DOMContentLoaded', () => {
    const accItems = document.querySelectorAll('.group');

    accItems.forEach((item) => {
        const button = item.querySelector('button');
        // Check if it's an accordion item by seeing if it has a button
        if (!button) return;

        button.addEventListener('click', () => {
            // Close other items
            accItems.forEach((otherItem) => {
                if (otherItem !== item) {
                    const otherIcon = otherItem.querySelector('.icon-plus');
                    const otherContent = otherItem.querySelector('.faq-content');
                    if (otherIcon && otherContent) {
                        // Reset styling for closed state
                        otherItem.classList.remove('active');
                        otherContent.style.maxHeight = '0';
                        otherContent.style.opacity = '0';
                        otherIcon.classList.remove('rotate-45');
                        otherIcon.classList.remove('text-primary');
                        otherIcon.classList.add('text-gray-400');
                    }
                }
            });

            // Toggle current item
            const icon = item.querySelector('.icon-plus');
            const content = item.querySelector('.faq-content');

            const isOpen = item.classList.contains('active');

            if (isOpen) {
                item.classList.remove('active');
                content.style.maxHeight = '0';
                content.style.opacity = '0';
                icon.classList.remove('rotate-45');
                icon.classList.remove('text-primary');
                icon.classList.add('text-gray-400');
            } else {
                item.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
                content.style.opacity = '1';
                icon.classList.add('rotate-45');
                icon.classList.remove('text-gray-400');
                icon.classList.add('text-primary');
            }
        });
    });
});
