const bitUrlToken = "de87b3defa9c87bf1bbede1c9e07e415333e781e" // Should move this somewhere we can .gitignore it

chrome.commands.onCommand.addListener(command => {
  if (command === "ScragMark") {
    addBookmarkToStorage()
      .then(()=> {
        chrome.tabs.create({url: "test.html"}, function(tab) {
        chrome.tabs.getZoom(null, function(zoomFactor) {
          //chrome.tabs.setZoom(tab.id, zoomFactor);
        })
        
        chrome.storage.local.get('mdText', result => {
          setTimeout(()=>chrome.tabs.sendMessage(tab.id, result.mdText), 1000);
        })
      })
    });
  }
});

// Bit pyramidy of doom. Look into promisefying?
var addBookmarkToStorage = () => {
 
  return new Promise((resolve, reject) => {

  chrome.storage.local.get('mdText', result => {
    let mdText = (result.mdText) ? result.mdText : "";

    chrome.tabs.query({active: true, currentWindow: true}, tabs => {
      if (tabs.length === 0) {
        return;
      }
      let url = tabs[0].url;
      let title = tabs[0].title;

      // Shorten URLs
      fetch(`https://api-ssl.bitly.com/v3/shorten?longURL=${encodeURI(url)}&access_token=${bitUrlToken}`, { credentials: 'omit' })
        .then(response => response.json())
        .then(bitUrl => {
          mdText += `\n* [${title}](${bitUrl.data.url})`;

          chrome.storage.local.set({'mdText': mdText}, () => {
            chrome.browserAction.setBadgeBackgroundColor({color:[0,0,255,255]});
            chrome.browserAction.setBadgeText({text:"Saved"}); 
            resolve("Success"); 
            setTimeout(() => {
              chrome.browserAction.setBadgeText({text:""});  
            }, 2000);
          });
        });
      });
    });
  })

}
