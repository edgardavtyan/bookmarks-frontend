const placeholder = document.querySelector('.search-bar__placeholder');
const input = document.querySelector('.search-bar__input');

input.addEventListener('focus', () => {
	placeholder.classList.add('is-hidden');
});

input.addEventListener('blur', () => {
	if (input.value === '') {
		placeholder.classList.remove('is-hidden');
	}
});
