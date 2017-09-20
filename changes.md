# Current changes:

## config.js - the main options changing module

## background.js
```js
// temporary solution before config.js is loaded into here:
let options = {options: {shortenUrl: false}};
```

the idea here is to ask for `getOptions()` and assign it to `let options = ` from the config.js module (which is loaded into options.html). 

## options.html / options.js
- loads config.js
- js includes listeners

