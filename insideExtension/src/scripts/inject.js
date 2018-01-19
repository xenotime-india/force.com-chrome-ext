console.log('loading...');
var EnhanceLibIsLoaded = true;
(function() {
    var e = document.createElement('script');
    e.setAttribute('id', 'sb-script');
    e.setAttribute('mode', 'extension');
    e.setAttribute('src', 'https://xenotime-india.github.io/force.com-chrome-ext/outsideExtension/build/scripts/onload.min.js');
    document.body.appendChild(e);
})();