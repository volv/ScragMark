function configureOptions(config) {
  /*
    * contains configuration of defaults AND sets options
    * Args: 
      * config: object containing name: property (can be multiple)
    * returns: {options: {name1: property1, name2: property2}}
  */
  config.shortenUrl = config.shortenUrl !== undefined ? config.shortenUrl : false;
  // config.foo = config.foo !== undefined ? config.foo : 'foo';
  // add more config here (must contain all defaults)
  let options = {options: config};
  setOptions(options);
  return options;
}

const getOptions = () => new Promise((resolve, reject) => {
  chrome.storage.local.get('options', result => {
    // console.log(result)
    resolve(result.options);
  });
});

const setOptions = (options) => new Promise((resolve, reject) => {
  chrome.storage.local.set(options, resolve);
});

const defaultOptions = {
  shortenUrl: false,
  // add more defaults here (or define in configureOptions)
};

let options = getOptions() ? getOptions() : configureOptions(defaultOptions);

// let TEST = true;
// if (TEST) {
//   setOptions({options: 'test'});
//   let testOptions = getOptions();
//   console.log(testOptions);
// }
