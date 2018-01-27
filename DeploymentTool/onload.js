//create namespace and shared variables

var load = (function() {
    // Function which returns a function: https://davidwalsh.name/javascript-functions
    function _load(tag) {
        return function(url) {
            // This promise will be used by Promise.all to determine success or failure
            return new Promise(function(resolve, reject) {
                var element = document.createElement(tag);
                var parent = 'body';
                var attr = 'src';

                // Important success and error for the promise
                element.onload = function() {
                    resolve(url);
                };
                element.onerror = function() {
                    reject(url);
                };

                // Need to set different attributes depending on tag type
                switch(tag) {
                    case 'script':
                        element.async = true;
                        break;
                    case 'link':
                        element.type = 'text/css';
                        element.rel = 'stylesheet';
                        attr = 'href';
                        parent = 'head';
                }

                // Inject into document to kick off loading
                element[attr] = url;
                document[parent].appendChild(element);
            });
        };
    }

    return {
        css: _load('link'),
        js: _load('script'),
        img: _load('img')
    }
})();

var filesToLoad = [
	{
		url: 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css',
		type: 'css',
	},{
        url:"https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/yeti/bootstrap.min.css",
        type:'css',
    },{
        url:"https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css",
        type:'css',
    },{
        url:"https://cdn.datatables.net/1.10.16/css/dataTables.bootstrap.min.css",
        type:'css',
    },{
        url:"https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.7.1/css/bootstrap-datepicker.min.css",
        type:'css',
    },{
        url:"https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js",
        type:'js',
    },{
        url:"https://cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js",
        type:'js',
    },{
        url:"https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.7.1/js/bootstrap-datepicker.min.js",
        type:'js',
    },{
        url:"https://cdnjs.cloudflare.com/ajax/libs/jsforce/1.7.0/jsforce.min.js",
        type:'js',
    },{
        url:"https://cdn.jsdelivr.net/bluebird/3.5.0/bluebird.min.js",
        type:'js',
    },{
        url:"https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment.min.js",
        type:'js',
    },{
        url:"https://xenotime-india.github.io/force.com-chrome-ext/outsideExtension/build/scripts/vendors/date.js",
        type:'js',
    }];
if(window.location.href.indexOf('/home/home.jsp') < 0) {
    var alertDiv = document.createElement("div");
    alertDiv.style.padding = "20px";
    alertDiv.style.backgroundColor = "#4CAF50";
    alertDiv.style.color = "white";
    alertDiv.innerHTML = "Your Change Set is ready...";

    document.body.appendChild(alertDiv);
} else {
    load.js('https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js')
        .then(function () {
            jQuery("link[rel='stylesheet']").remove();
            jQuery('body').html('');
            return new Promise(function (resolve, reject) {
                jQuery("body").load("https://xenotime-india.github.io/force.com-chrome-ext/DeploymentTool/template.html", function () {
                    resolve();
                });
            });
        })
        .then(function () {
            return Promise.all(filesToLoad.map(function (item) {
                switch (item.type) {
                    case 'js':
                        return load.js(item.url);
                    case 'css':
                        return load.css(item.url);
                }
            }));
        })
        .then(function () {
            return load.js('https://cdn.datatables.net/1.10.16/js/dataTables.bootstrap.min.js');
        })
        .then(function () {
            return load.js('https://xenotime-india.github.io/force.com-chrome-ext/outsideExtension/build/scripts/app.min.js');
        })
        .then(function () {
            if (jQuery('#sfdcConsoleContainer').length > 0) {
                jQuery('#sfdcConsoleContainer').show();
            }
        })
        .catch(function (err) {
            console.error('Error', err);
        });
}