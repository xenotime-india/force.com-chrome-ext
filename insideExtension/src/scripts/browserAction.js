if (typeof(EnhanceLibIsLoaded) == 'undefined' || EnhanceLibIsLoaded == false) {
    chrome.extension.sendMessage({
        loaded: false
    });
}