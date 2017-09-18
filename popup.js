let mdText = document.getElementById("mdText");
let status = document.getElementById("status");

let resizeWindow = debounce(function(e) {
  let width = window.getComputedStyle(mdText,null).getPropertyValue("width");
  document.querySelector("html").style.width = `${Number(width.slice(0, width.length-2))+20}px`;
  console.log(width.slice(0, width.length-2), e.buttons);
}, 250) 

mdText.addEventListener("keydown", () => status.innerHTML = "Modified");
mdText.addEventListener("mousemove", resizeWindow);

document.body.addEventListener("change", saveAll);
chrome.storage.onChanged.addListener(readStored);
window.onunload = saveAll;

readStored();

function readStored() {
  chrome.storage.local.get('mdText', function (result) {
    mdText.value = (result.mdText) ? result.mdText : "";
  });
}

function saveAll() {
  chrome.storage.local.set({'mdText': mdText.value}, function() {
    status.innerHTML = "Saved";
  });
}

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
function debounce(func, wait, immediate) {
  console.log("HI")
  var timeout;
  return function() {
    console.log("HIHI")
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};