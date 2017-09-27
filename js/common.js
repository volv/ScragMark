// test
console.log('common.js loaded');

class Config {
  constructor() {
    this.defaultOptions = {
      shortenUrl: false,
      doTitle: true,
      popupDimensions: [200,200],
    };
    this.options = {};
    this.allStored = {};
  }

  getAllStored() {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(null, function (result) {
        resolve(result);
        // resolve(this.allStored);
      });
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
        resolve(this.options)
      });
    });
  }

  saveOptions() {
    return new Promise((resolve) => {
      chrome.storage.local.set({'options': this.options}, resolve);
    });
  }
}


// const defaultOptions = {
//   shortenUrl: false,
//   doTitle: true,
//   popupDimensions: [200,200],
// };

// let options = {}; // Store of all options

// // On load
// const getOptions = () => new Promise((resolve) => {
//   chrome.storage.local.get('options', (result) => {
//     if (result.options) { // Stored exist
//       options = result.options;
//     } else {
//       options = defaultOptions;
//     }
//     resolve(options)
//   });
// });

// const saveOptions = () => new Promise((resolve) => {
//   chrome.storage.local.set({'options': options}, resolve);
// });

// // test
// // getOptions().then( () => console.log(options));

