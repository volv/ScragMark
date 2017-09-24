const checkbox = document.querySelector('input[name=urlShortCheckbox]');
checkbox.addEventListener('change', function (event) {
  if (checkbox.checked) {
    chrome.storage.sync.set({ 'shortenUrl': true });
  } else {
    chrome.storage.sync.set({ 'shortenUrl': false });
  } 
});