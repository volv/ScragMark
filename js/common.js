console.log('common.js loaded');

class Config {
  constructor() {
    this.defaultOptions = {
      shortenUrl: false,
      doTitle: true,
      popupDimensions: [200,200],
    };
    this.options = {};
  }

  getAllStored() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(null, resolve);
    });
  }

  getOptions() {
    return new Promise((resolve) => {
      chrome.storage.local.get('options', (result) => {
        if (result.options) { // Stored exist
          this.options = result.options;
        } else {
          this.options = this.defaultOptions;
        }
        resolve();
      });
    });
  }

  saveOptions() {
    return new Promise((resolve) => {
      chrome.storage.local.set({'options': this.options}, resolve);
    });
  }
}

const config = new Config(); // config now available in all linked files.

// On change
chrome.storage.onChanged.addListener(changes => {
  if (changes.options) { // Options were changed
    config.getOptions(); // Keep congig.options current.
  }
});