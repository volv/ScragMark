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

// Up 38, Down 40
mdText.addEventListener("keydown", (e) => {
  if (e.altKey && e.keyCode === 38) {
    e.preventDefault();
    swapLines("Up");
  }
  if (e.altKey && e.keyCode === 40) {
    e.preventDefault();
    swapLines("Down");
  }
  if (e.keyCode === 9) { // Tab Key
    e.preventDefault();
    handleTab(e);
  }
})

function swapLines(dir) {
  let selStart = mdText.selectionStart;
  let lines = mdText.value.split("\n");
  let curLine = mdText.value.slice(0,selStart).split("\n").length - 1;
  let upperLine = curLine > 0 ? curLine - 1 : 0;
  let lowerLine = curLine < lines.length - 1 ? curLine + 1 : lines.length -1;
  
  
  if (dir === "Up") {
    let tmp = lines[curLine];
    lines[curLine] = lines[upperLine];
    lines[upperLine] = tmp;
    mdText.value = lines.join("\n");
    if (curLine >= 0 && curLine < lines.length) {
      let cursorPos = selStart-lines[curLine].length-1;
      cursorPos = cursorPos < 0 ? 0 : cursorPos;
      mdText.setSelectionRange(cursorPos, cursorPos);
    }
  }
  
  if (dir === "Down") {
    let tmp = lines[curLine];
    lines[curLine] = lines[lowerLine];
    lines[lowerLine] = tmp;
    mdText.value = lines.join("\n");
    if (curLine >= 0 && curLine < lines.length) {
      let cursorPos = selStart+lines[curLine].length+1;
      cursorPos = cursorPos < 0 ? 0 : cursorPos;
      mdText.setSelectionRange(cursorPos, cursorPos);
    }
  }
  
  mdText.blur();
  mdText.focus();

}

function handleTab(e) {
  // Should get tab length value from options. I'm going with 2
  const TAB_LENGTH = 2;
  
  let selStart = mdText.selectionStart;
  let selEnd = mdText.selectionEnd;
  let spacesRemoved = 0;
  
  // No selection made
  if (mdText.selectionStart === mdText.selectionEnd && !e.shiftKey) {
    let leftPart = mdText.value.slice(0, selStart);
    let rightPart = mdText.value.slice(selEnd);
    mdText.value = `${leftPart}${" ".repeat(TAB_LENGTH)}${rightPart}`;  
    mdText.setSelectionRange(selStart + TAB_LENGTH, selStart + TAB_LENGTH);
  } else { // Going for codepen like multi line behavior
    // Select letter after last new line. If not found -1 becomes 0. Perfect.
    let previousNewLine = mdText.value.slice(0, selStart).lastIndexOf("\n") + 1;
    let leftPart = mdText.value.slice(0, previousNewLine);
    let rightPart = mdText.value.slice(selEnd);
    
     // Get all lines affected
    let selection = mdText.value.slice(previousNewLine, selEnd).split("\n");
    let lineCount = selection.length;
    
    // How many spaces could possibly be removed from selection Start
    let firstLineSpaces = selection[0].length - selection[0].trimLeft().length;
    if (firstLineSpaces > TAB_LENGTH) {
      firstLineSpaces = TAB_LENGTH; // Only go back in selection up to tab lengths
    }
    
    if (e.shiftKey) { // Remove spaces. Go backwards
      selection = selection.map(each => removeSpacesFromFront(each, TAB_LENGTH)).join("\n"); 
      mdText.value = `${leftPart}${selection}${rightPart}`;
      mdText.setSelectionRange(selStart-firstLineSpaces, selEnd-spacesRemoved);
    } else { // Add spaces to front of each. Forwards!
      selection = selection.map(each => `${" ".repeat(TAB_LENGTH)}${each}`).join("\n"); 
      mdText.value = `${leftPart}${selection}${rightPart}`;
      mdText.setSelectionRange(selStart+TAB_LENGTH, selEnd+(lineCount*TAB_LENGTH));
    }
  }
  
  function removeSpacesFromFront(str, tabLength) {
    let result = str.split("");
    for (let i = 0; i < tabLength; i++) {
      if (result[0] === " ") {
        result.shift();
        spacesRemoved++;
      }
    }
    return result.join("");
  }
   
  mdText.blur();
  mdText.focus();
  
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