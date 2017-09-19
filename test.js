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

var result = md.render(`# markdown-it rulezz!
* [Clean Your System and Free Disk Space | BleachBit](http://bit.ly/2hcurp9)
* [Subnotes](http://bit.ly/2hbIACP)
Syntax highlighting
\`\`\` js
var foo = function (bar) {
  return bar++;
};

console.log(foo(5));
\`\`\`
`);
document.getElementById("output").value = result;
document.getElementById("output2").innerHTML = result;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    var result = md.render(request);
    document.getElementById("output").value = result;
    document.getElementById("output2").innerHTML = result;    
    
    if (request.greeting == "hello")
      sendResponse({farewell: "goodbye"});
  });