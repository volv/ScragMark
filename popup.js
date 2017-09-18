let mdText = document.getElementById("mdText");
let status = document.getElementById("status");

function readStored() {
  chrome.storage.local.get('mdText', function (result) {
    mdText.value = (result.mdText) ? result.mdText : "";
  });
}

readStored();

mdText.addEventListener("keydown", () => status.innerHTML = "Modified");
document.body.addEventListener("change", saveAll);

chrome.storage.onChanged.addListener(readStored);

function saveAll() {
  chrome.storage.local.set({'mdText': mdText.value}, function() {
    status.innerHTML = "saved";
  });
}