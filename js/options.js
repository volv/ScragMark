const defaultOptions = {
  shortenUrl: false,
  doTitle: true,
  popupDimensions: [200,200],
};

let options = {}; // Store of all options

// On load
chrome.storage.local.get('options', (result) => {
  if (result.options) { // Stored exist
    options = result.options;
  } else {
    options = defaultOptions;
  }
  setupOptionsPage();
});

const formOptions = document.getElementById("formOptions");
const shortenUrl = document.getElementById("shortenUrl");
const doTitle = document.getElementById("doTitle");
const popupWidth = document.getElementById("popupWidth");
const popupHeight = document.getElementById("popupHeight");
const popupButton = document.getElementById("popupDimensionsButton");

// Options -> Form
// Basically the reverse of the change event listener. Called at startup
function setupOptionsPage() {
  shortenUrl.checked = options.shortenUrl;
  doTitle.checked = options.doTitle;
  popupWidth.value = options.popupDimensions[0];
  popupHeight.value = options.popupDimensions[1];
}

// Form -> Options
formOptions.addEventListener('change', () => {
  options.shortenUrl = shortenUrl.checked;
  options.doTitle = doTitle.checked;
  saveOptions();
});

const saveOptions = () => new Promise((resolve) => {
  chrome.storage.local.set({'options': options}, resolve);
});

// popupbutton listener
popupButton.addEventListener('click', function(){
  options.popupDimensions = [popupWidth.value, popupHeight.value];
  saveOptions();
})
