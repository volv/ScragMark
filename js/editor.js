// Contains custom editor methods that affect the text area. Capturing tabs etc

// TODO - Add multiline support for swapLines
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
  // Option should determine TAB_LENGTH
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