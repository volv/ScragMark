const md = window.markdownit({
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' +
          hljs.highlight(lang, str, true).value +
          '</code></pre>';
      } catch (__) { }
    }

    return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
  }
});

const scrollToBottom = (element) => element.scrollTop = element.scrollHeight;

const renderMdText = (where) => new Promise((resolve) => {
  chrome.storage.local.get('mdText', result => {
    const mdText = result.mdText ? result.mdText : ""
    where.innerHTML = md.render(mdText);
    resolve(mdText);
  });
});

const output = document.getElementById("output");

chrome.storage.onChanged.addListener(() => renderMdText(output)); // Live Updates

renderMdText(output)                          // On page load
  .then(() => scrollToBottom(document.body)); // Another potential option.