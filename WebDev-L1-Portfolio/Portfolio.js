document.addEventListener('DOMContentLoaded', () => {
    const checkbox = document.getElementById('checkbox');

    if (checkbox) {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                document.body.setAttribute('data-theme', 'light');
            } else {
                document.body.removeAttribute('data-theme');
            }
        });
    }
});
