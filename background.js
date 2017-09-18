const bitUrlToken = "de87b3defa9c87bf1bbede1c9e07e415333e781e"
let mdText = "";

chrome.commands.onCommand.addListener(command => {
  if (command === "ScragMark") {
    addBookmarkToStorage();
  }
});

// Bit pyramidy of doom. Look into promisefying?
function addBookmarkToStorage() {
  chrome.storage.local.get('mdText', result => {
    mdText = (result.mdText) ? result.mdText : "";

    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      if (tabs.length === 0) return;
      let url = tabs[0].url;
      let title = tabs[0].title;

      // Shorten URLs
      fetch(`https://api-ssl.bitly.com/v3/shorten?longURL=${encodeURI(url)}&access_token=${bitUrlToken}`, { credentials: 'omit' })
      .then(response => response.json())
      .then(bitUrl => {
        mdText += `\n* [${title}](${bitUrl.data.url})`;

        chrome.storage.local.set({'mdText': mdText}, () => {
          console.log("Saved");
        });
      });
    });
  });
}
