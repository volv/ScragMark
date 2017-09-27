// test
console.log('common.js loaded');

const defaultOptions = {
  shortenUrl: false,
  doTitle: true,
  popupDimensions: [200,200],
};

let options = {}; // Store of all options

// On load
const getOptions = () => new Promise((resolve) => {
  chrome.storage.local.get('options', (result) => {
    if (result.options) { // Stored exist
      options = result.options;
    } else {
      options = defaultOptions;
    }
    resolve(options)
  });
});

const saveOptions = () => new Promise((resolve) => {
  chrome.storage.local.set({'options': options}, resolve);
});

// test
// getOptions().then( () => console.log(options));

