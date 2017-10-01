// md becomes render function
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

const scrollToBottom = () => document.body.scrollTop = document.body.scrollHeight;

const getMdText = () => new Promise((resolve) => {
  chrome.storage.local.get('mdText', ({mdText=""}) => resolve(mdText));
});

const renderMdText = (mdText) => output.innerHTML = md.render(mdText);

const getAndRenderMdText = async () => renderMdText(await getMdText());

chrome.storage.onChanged.addListener(getAndRenderMdText); // Live Updates

const output = document.getElementById("output");

getAndRenderMdText()           // On page load
  .then(scrollToBottom);       // Another potential option.