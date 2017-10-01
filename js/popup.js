const mdText = document.getElementById("mdText"); // The Markdown text box
const popup = document.querySelector("html");     // The whole popup bubble itself

// Startup
popup.classList.add("fixResize");
mdText.classList.add("fixResize");

config.getOptions().then(() => {
  config.getAllStored()
    .then(stored => {
      doOnetimeResize(stored)
      updateMdText(stored.mdText);
      mdText.scrollTop = mdText.scrollHeight;
      mdText.focus();
      mdText.setSelectionRange(mdText.value.length, mdText.value.length);
    });
  });

// Send text to textarea
const updateMdText = (text) => mdText.value = text;

// Custom keyboard events found in js/editor.js
mdText.addEventListener("keydown", (event) => {

  const altUp = () => event.altKey && event.keyCode === 38;
  const altDown = () => event.altKey && event.keyCode === 40;
  const tab = () => event.keyCode === 9;

  if (altUp()) {
    event.preventDefault();
    swapLines("Up");
  }
  if (altDown()) {
    event.preventDefault();
    swapLines("Down");
  }
  if (tab()) { 
    event.preventDefault();
    handleTab(event);
  }

})

function saveAll() {
  chrome.storage.local.set({
      'mdText': mdText.value,
      'bookmarkAdded': false,
    });
}

// Also saving everything continuously - Huge candidate for optimisation if extension ever seems slow
// Chrome saves us from ourselves here. onChanged event properly only fires on actual changed values
// Doesn't fire every time I attempt a change at 30 FPS here. Good times.
const autoSave = setInterval(()=> {
  requestAnimationFrame(() => {
    popup.style.width  = `${mdText.clientWidth+35}px`;  // Keep popup bigger than textarea
    saveAll();
  })
}, 1000/30);

// When data is changed in storage. Keep Text box and data in sync
chrome.storage.onChanged.addListener(() => {
  config.getAllStored().then(stored => {
    if (stored.bookmarkAdded) { // Don't replace content in response to typing
      updateMdText(stored.mdText) 
      mdText.scrollTop = mdText.scrollHeight;
    }
  });
});

// Called at startup. Persists popup size.
const doOnetimeResize = (stored) => {
  let width = `200px`;  // Some defaults
  let height = `200px`;
  if (stored.options.popupDimensions) {
    width = `${stored.options.popupDimensions[0]}px`;
    height = `${stored.options.popupDimensions[1]}px`;
  }
  
  // Values from maxes in CSS file. Can sometimes bug over the limit and get stuck.
  width = Number(width.slice(0, width.length-2)) >= 610 ? "608px" : width;
  height = Number(height.slice(0, height.length-2)) >= 465 ? "463px" : height;

  mdText.style.width   = width;
  mdText.style.height  = height;
}