const md = window.markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
               hljs.highlight(lang, str, true).value +
               '</code></pre>';
      } catch (__) {}
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

const output = document.getElementById("output"); 

const getMdText = () => new Promise((resolve, reject) => {
  chrome.storage.local.get('mdText', result => {
    let mdText = (result.mdText) ? result.mdText : "";
    resolve(mdText);
  });
});

getMdText()
  .then(mdText => output.innerHTML = md.render(mdText))
  // Scroll to bottom on page load. Another potential option.
  .then(() => document.body.scrollTop = document.body.scrollHeight) 

chrome.storage.onChanged.addListener(() => {
  getMdText()
    .then(mdText => output.innerHTML = md.render(mdText));
});