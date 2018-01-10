//create namespace and shared variables
var sfdcConsole = sfdcConsole || {};

sfdcConsole.setup = function(){
	
	//only run most of the setup if it hasn't been run on this page before. Prevent freakouts 
	//from multiple invocations hopefully.
	if(jQuery('#sfdcConsoleContainer').length == 0)
	{
		sfdcConsole.injectInterface();
	}
	else
	{
		jQuery('#sfdcConsoleContainer').show();
	}
}

//build the interface usising some minified HTML and CSS.
sfdcConsole.injectInterface = function(){
    
    //jQuery('body').append('<style>.container {background-color: transparent !Important;background: transparent !Important; }body {overflow: hidden;}#preloader{position:fixed;top:0;left:0;right:0;bottom:0;background-color:#fff;z-index:99999}#status{width:227px;height:200px;position:absolute;left:50%;top:50%;background-image:url(https://xenotime-india.github.io/force.com-chrome-ext/DeploymentTool/276.GIF);background-repeat:no-repeat;background-position:center;margin:-100px 0 0 -100px}#sfdcConsoleContainer{position:fixed;top:0;left:0;width:100%;min-height:50px;height:100%;}</style> <div id="preloader"> <div id="status" class="sfdcConsoleloading">&nbsp;</div> </div> <div id="sfdcConsoleContainer"> <div class="navbar navbar-default navbar-static-top"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand" href="#">Salesforce Deployment Tool</a> </div> <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1"> <form class="navbar-form navbar-left" role="search"> <div class="btn-group" data-toggle="buttons"> <label class="btn btn-primary" onclick="changefilterMode(\'CreatedDate\',\'createdDate\')"> <input type="radio" name="options" id="CreatedDate" onclick="changefilterMode(\'CreatedDate\',\'createdDate\')"/> By Created Date </label> <label class="btn btn-primary active" onclick="changefilterMode(\'LastModifiedDate\',\'lastModifiedDate\')"> <input type="radio" name="options" id="LastModifiedDate" onclick="changefilterMode(\'LastModifiedDate\',\'lastModifiedDate\')"/> By LastModified Date </label> </div> <div class="form-group"> <input type="text" class="form-control" placeholder="From Date" id="dateField"/> </div> &nbsp;&nbsp; <a href="#" onclick="showLoading();updateData();return false"><i class="fa fa-filter fa-2x"></i></a> </form> <ul class="nav navbar-nav navbar-right"> <li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown">Action <span class="caret"></span></a> <ul class="dropdown-menu" role="menu"> <li><a href="#" onclick="globalSelectAll();return false">Select All</a></li> <li><a href="#" onclick="globalUnSelectAll();return false">Un-Select All</a></li> <li class="divider"></li> <li><a href="#" onclick="generateXml();return false">Generate Package.xml</a></li> <li><a href="#" onclick="getPackage();return false">Get Resource Zip</a></li> <li><a href="#">Deploy</a></li> </ul> </li> </ul> </div> </div> </div> <div style="padding: 0px 10px;"> <ul class="nav nav-tabs" role="tablist" id="myTab"> <li class="dropdown"> <a href="#" id="soqlData" class="dropdown-toggle" data-toggle="dropdown">Dev Resource <span class="caret"></span></a> <ul class="dropdown-menu" role="menu" aria-labelledby="soqlData" id="container-tab"> </ul> </li> <li class="dropdown"> <a href="#" id="metaData" class="dropdown-toggle" data-toggle="dropdown">Config Resource <span class="caret"></span></a> <ul class="dropdown-menu" role="menu" aria-labelledby="metaData" id="container-tab2"> </ul> </li> </ul> <div class="tab-content" id="container"> </div> </div> <div class="modal" id="xmlDialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> <h4 class="modal-title">Package.xml</h4> </div> <div class="modal-body"> <textarea id="xmlData" style="width:558px;height:307px;border-width:0"></textarea> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> </div> </div> </div> </div> <div class="modal" id="loginDialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <h4 class="modal-title">Login Detail</h4> </div> <div class="modal-body"> <form role="form"> <div class="form-group"> <label for="exampleInputEmail1">User Name</label> <input type="email" class="form-control" id="userNameTxt" placeholder="User Name"> </div> <div class="form-group"> <label for="exampleInputPassword1">Password</label> <input type="password" class="form-control" id="passwordTxt" placeholder="Password + Security Token"> </div> </form> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" onclick="loginUser();">Login</button> </div> </div> </div> </div></div>');
}

//generic function for dynamic script sfdcConsoleloading with callback support!
sfdcConsole.getScript = function(element,type,src,callback){
	var success = true;
	var head= document.getElementsByTagName('head')[0];	
	newItem =  document.createElement( element );
	newItem.type= type;
	if(type.toLowerCase().indexOf('script') > -1)
	{
		newItem.src = src;
	}
	else
	{
		newItem.href = src;
		newItem.rel = 'stylesheet';
	}
	if(typeof callback == 'function')
	{	
		newItem.onload=callback;
	}
	try
	{
		head.appendChild(newItem);	
	}
	catch(ex)
	{
		success = false;
		console.log('Error');
		console.log(ex.message);
	}
}


//recursivly called function to load all required scripts, then return to the callback once all are loaded. Pretty clever stuff :)
sfdcConsole.loadScripts = function(callback){
	
	if (typeof jQuery == "undefined" || parseFloat(jQuery().jquery) < 1.8 ) 
	{
        sfdcConsole.getScript('script','text/javascript','https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js',function(){
            jQuery("link[rel='stylesheet']").remove();
            jQuery('body').html('');
            jQuery( "body" ).load( "https://xenotime-india.github.io/force.com-chrome-ext/DeploymentTool/template.html", function() {
                alert( "Load was performed." );
                sfdcConsole.getScript('link','text/css','https://maxcdn.bootstrapcdn.com/bootstrap/3.2.0/css/bootstrap.min.css',function(){
                    sfdcConsole.getScript('link','text/css','https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css',function(){
                        sfdcConsole.getScript('link','text/css','https://maxcdn.bootstrapcdn.com/bootswatch/3.2.0/spacelab/bootstrap.min.css',function(){
                            sfdcConsole.getScript('link','text/css','https://cdn.datatables.net/plug-ins/a5734b29083/integration/bootstrap/3/dataTables.bootstrap.css',function(){
                                sfdcConsole.getScript('script','text/javascript','/soap/ajax/31.0/connection.js',function(){
                                    sfdcConsole.getScript('script','text/javascript','https://netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js',function(){
                                        sfdcConsole.getScript('script','text/javascript','https://cdn.datatables.net/1.10.3/js/jquery.dataTables.min.js',function(){
                                            sfdcConsole.getScript('script','text/javascript','https://cdn.datatables.net/plug-ins/a5734b29083/integration/bootstrap/3/dataTables.bootstrap.js',function(){
                                                sfdcConsole.getScript('link','text/css','https://xenotime-india.github.io/force.com-chrome-ext/DeploymentTool/datepicker3.css',function(){
                                                    sfdcConsole.getScript('script','text/javascript','https://xenotime-india.github.io/force.com-chrome-ext/DeploymentTool/bootstrap-datepicker.js',function(){
                                                        sfdcConsole.getScript('script','text/javascript','https://xenotime-india.github.io/force.com-chrome-ext/DeploymentTool/sfdcMetadata.js',function(){
                                                            sfdcConsole.getScript('script','text/javascript','https://xenotime-india.github.io/force.com-chrome-ext/DeploymentTool/background.js',function(){
                                                                sfdcConsole.loadScripts(callback);
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
            jQuery('body').append('<style>#preloader{position:fixed;top:0;left:0;right:0;bottom:0;background-color:#fff;z-index:99999}#status{width:227px;height:200px;position:absolute;left:50%;top:50%;background-image:url(https://xenotime-india.github.io/force.com-chrome-ext/DeploymentTool/276.GIF);background-repeat:no-repeat;background-position:center;margin:-100px 0 0 -100px}#sfdcConsoleContainer{width:100%;min-height:50px;height:100%;}table.dataTable tbody tr.selected{background-color:#3071a9!Important;color:#fff!Important}table.dataTable tbody tr.selected>td{background-color:#3071a9!Important;color:#fff!Important}table.dataTable.display tbody tr.selected>.sorting_1,table.dataTable.order-column.stripe tbody tr.selected>.sorting_1.{background-color:#b0bed9;color:#fff}</style> <div id="preloader"> <div id="status" class="sfdcConsoleloading">&nbsp;</div> </div> <div id="sfdcConsoleContainer"> <div class="navbar navbar-default navbar-static-top"> <div class="container"> <div class="navbar-header"> <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1"> <span class="sr-only">Toggle navigation</span> <span class="icon-bar"></span> <span class="icon-bar"></span> <span class="icon-bar"></span> </button> <a class="navbar-brand" href="#">Salesforce Deployment Tool</a> </div> <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1"> <form class="navbar-form navbar-left" role="search"> <div class="btn-group" data-toggle="buttons"> <label class="btn btn-primary" onclick="changefilterMode(\'CreatedDate\',\'createdDate\')"> <input type="radio" name="options" id="CreatedDate" onclick="changefilterMode(\'CreatedDate\',\'createdDate\')"/> By Created Date </label> <label class="btn btn-primary active" onclick="changefilterMode(\'LastModifiedDate\',\'lastModifiedDate\')"> <input type="radio" name="options" id="LastModifiedDate" onclick="changefilterMode(\'LastModifiedDate\',\'lastModifiedDate\')"/> By LastModified Date </label> </div> <div class="form-group"> <input type="text" class="form-control" placeholder="From Date" id="dateField"/> </div> &nbsp;&nbsp; <a href="#" onclick="updateData();return false"><i class="fa fa-filter fa-2x"></i></a> </form> <ul class="nav navbar-nav navbar-right"> <li class="dropdown"> <a href="#" class="dropdown-toggle" data-toggle="dropdown">Action <span class="caret"></span></a> <ul class="dropdown-menu" role="menu"> <li><a href="#" onclick="globalSelectAll();return false">Select All</a></li> <li><a href="#" onclick="globalUnSelectAll();return false">Un-Select All</a></li> <li class="divider"></li> <li><a href="#" onclick="generateXml();return false">Generate Package.xml</a></li> <li><a href="#" onclick="getPackage();return false">Get Resource Zip</a></li> <li><a href="#">Deploy</a></li> </ul> </li> </ul> </div> </div> </div> <div style="padding: 0px 10px;"> <ul class="nav nav-tabs" role="tablist" id="myTab"> <li class="dropdown"> <a href="#" id="soqlData" class="dropdown-toggle" data-toggle="dropdown">Dev Resource <span class="caret"></span></a> <ul class="dropdown-menu" role="menu" aria-labelledby="soqlData" id="container-tab"> </ul> </li> <li class="dropdown"> <a href="#" id="metaData" class="dropdown-toggle" data-toggle="dropdown">Config Resource <span class="caret"></span></a> <ul class="dropdown-menu" role="menu" aria-labelledby="metaData" id="container-tab2"> </ul> </li> </ul> <div class="tab-content" id="container"> </div> </div> <div class="modal" id="xmlDialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button> <h4 class="modal-title">Package.xml</h4> </div> <div class="modal-body"> <textarea id="xmlData" style="width:558px;height:307px;border-width:0"></textarea> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> </div> </div> </div> </div> <div class="modal" id="loginDialog"> <div class="modal-dialog"> <div class="modal-content"> <div class="modal-header"> <h4 class="modal-title">Login Detail</h4> </div> <div class="modal-body"> <form role="form"> <div class="form-group"> <label for="exampleInputEmail1">User Name</label> <input type="email" class="form-control" id="userNameTxt" placeholder="User Name"> </div> <div class="form-group"> <label for="exampleInputPassword1">Password</label> <input type="password" class="form-control" id="passwordTxt" placeholder="Password + Security Token"> </div> </form> </div> <div class="modal-footer"> <button type="button" class="btn btn-default" onclick="loginUser();">Login</button> </div> </div> </div> </div></div>');

        });
	}
	else
	{
		callback();
	}
}

sfdcConsole.loadScripts(function(){
	sfdcConsole.setup();
	
});