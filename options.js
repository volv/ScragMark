const urlShortCheckbox = document.querySelector('input[name=urlShortCheckbox]');
urlShortCheckbox.addEventListener('change', function (event) {
    chrome.storage.local.set({options: {'shortenUrl': urlShortCheckbox.checked}}, (response) => {
    console.dir(urlShortCheckbox.checked);
    // Can be sure the set function has had time to finish in here
    console.dir(response);
    })
})
