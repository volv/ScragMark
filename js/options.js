// test load
// console.log(options); // {}

// On load
// setupOptionsPage();
getOptions().then( () => setupOptionsPage());


// On load
// chrome.storage.local.get('options', (result) => {
  //   if (result.options) { // Stored exist
  //     options = result.options;
  //   } else {
    //     options = defaultOptions;
    //   }
    //   setupOptionsPage();
    // });
    
    
// let options = {}; // Store of all options

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

// popupbutton listener
popupButton.addEventListener('click', function(){
  options.popupDimensions = [popupWidth.value, popupHeight.value];
  saveOptions();
})


