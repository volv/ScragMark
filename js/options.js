// On load
config.getOptions().then(setupOptionsPage);

// Cache DOM
const formOptions = document.getElementById("formOptions");
const shortenUrl = document.getElementById("shortenUrl");
const doTitle = document.getElementById("doTitle");
const popupWidth = document.getElementById("popupWidth");
const popupHeight = document.getElementById("popupHeight");
const popupButton = document.getElementById("popupDimensionsButton");

// Options -> Form
// Basically the reverse of the change event listener. Called at startup
function setupOptionsPage() {
  let options = config.options;
  shortenUrl.checked = options.shortenUrl;
  doTitle.checked = options.doTitle;
  popupWidth.value = options.popupDimensions[0];
  popupHeight.value = options.popupDimensions[1];
}

// Form -> Options
formOptions.addEventListener('change', () => {
  let options = config.options;
  options.shortenUrl = shortenUrl.checked;
  options.doTitle = doTitle.checked;
  config.saveOptions();
});

// popupbutton listener
popupButton.addEventListener('click', function(){
  let options = config.options;
  options.popupDimensions = [popupWidth.value, popupHeight.value];
  config.saveOptions();
})