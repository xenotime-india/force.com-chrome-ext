// Execute the inject.js in a tab and call a method,
// passing the result to a callback function.
chrome.extension.onMessage.addListener(function(req, sender, sendResponse) {
    if (req.loaded === false) {
      chrome.tabs.executeScript(sender.tab.Id, {file: "inject.js"});
    }
});

// When the browser action is clicked, call the
// getBgColors function.
chrome.browserAction.onClicked.addListener(function(tab) {
   
    // execute a content script that immediately sends back a message 
    // that checks for the value of a global variable which is set when
    // the library has been loaded
    chrome.tabs.executeScript(tab.Id, {file: "browserAction.js"});
});