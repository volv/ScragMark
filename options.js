const urlShortCheckbox = document.querySelector('input[name=urlShortCheckbox]');
urlShortCheckbox.addEventListener('change', function (event) {
  options = configureOptions({
    shortenUrl: urlShortCheckbox.checked,
  });
})
