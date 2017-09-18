// I'm thinking I might need a background process for context menu reasons mostly
chrome.commands.onCommand.addListener(command => {
  if (command === "ScragMark") {
    addBookmarkToStorage();
  }
});

var url = "";
var title = "";
var mdText = "";

// Bit pyramidy of doom. Look into promisefying?
function addBookmarkToStorage() {
  chrome.storage.local.get('mdText', function (result) {
    mdText = (result.mdText) ? result.mdText : "";

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      if (tabs.length === 0) return;
      url = tabs[0].url;
      title = tabs[0].title;

      mdText += `\n\n[${title}](${url})`;
      console.log(mdText)

      chrome.storage.local.set({'mdText': mdText}, function() {
        status.innerHTML = "saved";
      });
    });
  });
}