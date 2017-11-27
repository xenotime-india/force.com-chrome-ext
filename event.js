// Execute the inject.js in a tab and call a method,
// passing the result to a callback function.
chrome.extension.onMessage.addListener(function(req, sender, sendResponse) {
    if (req.loaded === false) {
      chrome.tabs.executeScript(sender.tab.Id,
      {
        code: "console.log('loading...');var EnhanceLibIsLoaded = true;(function(){ var e = document.createElement('script'); e.setAttribute('id', 'sb-script'); e.setAttribute('mode', 'extension');   e.setAttribute('src','https://xenotime-india.github.io/force.com-chrome-ext/DeploymentTool/onload.js');  document.body.appendChild(e); })()"
      });
    }
});

// When the browser action is clicked, call the
// getBgColors function.
chrome.browserAction.onClicked.addListener(function(tab) {
   
    // execute a content script that immediately sends back a message 
    // that checks for the value of a global variable which is set when
    // the library has been loaded
    chrome.tabs.executeScript(tab.Id, {
        code: "var check; if(typeof(EnhanceLibIsLoaded)== 'undefined' || EnhanceLibIsLoaded == false) { check = false;} else {check = true;}console.log(check);chrome.extension.sendMessage({ loaded: check});"
    });
});