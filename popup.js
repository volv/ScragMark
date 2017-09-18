let mdText = document.getElementById("mdText");
let status = document.getElementById("status");

chrome.storage.local.get('mdText', function (result) {
  mdText.value = (result.mdText) ? result.mdText : "";
});

mdText.addEventListener("keydown", () => status.innerHTML = "Modified");
document.body.addEventListener("change", saveAll);

function saveAll() {
  chrome.storage.local.set({'mdText': mdText.value}, function() {
    status.innerHTML = "saved";
  });
}