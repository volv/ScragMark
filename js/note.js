var md = window.markdownit({
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

const getMdText = () => new Promise((resolve, reject) => {
  chrome.storage.local.get('mdText', result => {
    let mdText = (result.mdText) ? result.mdText : "";
    resolve(mdText);
  });
});

getMdText()
  .then(mdText => document.getElementById("output").innerHTML = md.render(mdText));

chrome.storage.onChanged.addListener(() => {
  getMdText()
    .then(mdText => document.getElementById("output").innerHTML = md.render(mdText));
});