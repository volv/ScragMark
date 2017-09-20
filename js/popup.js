let mdText = document.getElementById("mdText"); // The Markdown text box
let status = document.getElementById("status"); // The status text
let popup = document.querySelector("html");     // The whole popup bubble itself

mdText.addEventListener("keydown", () => status.innerHTML = "Modified");

// When data is changed in storage. Keep Text box and data in sync
chrome.storage.onChanged.addListener(() => {
  readStored().then(stored => {
    updateMdText(stored.mdText)
    if (stored.bookmarkAdded) {
      mdText.scrollTop = mdText.scrollHeight;
    }
  });
});

// Ditched library, made my own 'dirty' checker for smooth resize
// Also saving everything continuously - Huge candidate for optimisation if extension ever seems slow
let autoSave = setInterval(()=> {
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
  let height = window.getComputedStyle(mdText,null).getPropertyValue("height");
  height = height.slice(0, height.length-2);
  console.log("Height ", height, mdText.style.height)
  chrome.storage.local.set(
    {
      'mdText': mdText.value,
      'mdTextWidth': mdText.style.width,
      'mdTextHeight': mdText.style.height,
      'bookmarkAdded': false
    }, function() {
    status.innerHTML = "Saved";
  });
}

// Called at startup. Persists popup size.
const doOnetimeResize = (stored) => {
  let width = `200px`;  // Some defaults
  let height = `200px`;
  if (stored.mdTextWidth) {
    width = stored.mdTextWidth;
  }
  if (stored.mdTextHeight) {
    height = stored.mdTextHeight;
  }
  // Values from maxes in CSS file. Can sometimes bug over the limit and get stuck.
  width = Number(width.slice(0, width.length-2)) >= 610 ? "608px" : width;
  height = Number(height.slice(0, height.length-2)) >= 465 ? "463px" : height;

  mdText.style.width   = width;
  mdText.style.height  = height;
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