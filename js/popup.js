let mdText = document.getElementById("mdText"); // The Markdown text box
let status = document.getElementById("status"); // The status text
let popup = document.querySelector("html");     // The whole popup bubble itself

mdText.addEventListener("keydown", () => status.innerHTML = "Modified");

// When data is changed in storage. Keep Text box and data in sync
chrome.storage.onChanged.addListener(() => {
  readStored().then(stored => updateMdText(stored.mdText));
});

// Ditched library, made my own 'dirty' checker for smooth resize
// Also saving everything continuously - Huge candidate for optimisation if extension ever seems slow
setInterval(()=> {
  requestAnimationFrame(() => {
    popup.style.width  = `${mdText.clientWidth+35}px`;  // Keep popup bigger than textarea
    saveAll();
  })
}, 1000/60);

// Returns all stored data
const readStored = () => new Promise((resolve, reject) => {
  chrome.storage.local.get(null, function (result) {
    resolve(result);
  });
});

// Send text to textarea
const updateMdText = (text) => mdText.value = text ? text : "";

function saveAll() {
  chrome.storage.local.set(
    {
      'mdText': mdText.value,
      'mdTextWidth': mdText.clientWidth,
      'mdTextHeight': mdText.clientHeight
    }, function() {
    status.innerHTML = "Saved";
  });
}

// Called at startup. Persists popup size.
const doOnetimeResize = (stored) => {
  let width = 200;
  let height = 200;
  if (Number(stored.mdTextWidth)) {
    width = Number(stored.mdTextWidth) < 200 ? 200 : Number(stored.mdTextWidth);
  }
  if (Number(stored.mdTextHeight)) {
    height = Number(stored.mdTextHeight) < 200 ? 200 : Number(stored.mdTextHeight);
  }
  mdText.style.width   = `${width}px`;
  mdText.style.height  = `${height}px`;
}

// Startup
popup.classList.add("fixResize");
mdText.classList.add("fixResize");

readStored()
  .then((stored) => {
    doOnetimeResize(stored)
    updateMdText(stored.mdText);
    mdText.scrollTop = mdText.scrollHeight;
  })