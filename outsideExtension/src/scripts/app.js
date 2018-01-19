const apiVersion = '41.0';
let requestMetadata = [];

const requestSqlData = [
    {
        type:'ApexClass',
        table: 'ApexClass_tb',
        soqlFields: 'Id, Name, LastModifiedDate, LastModifiedBy.Name, CreatedBy.Name, CreatedDate',
        soqlWhere: 'NamespacePrefix = null',
        fields: [ 'Select','Id', 'Name', 'LastModifiedDate', 'LastModifiedBy',
            'CreatedDate','CreatedBy' ],
        apiFieldIndex: 2,
    }, {
        type:'ApexPage',
        table: 'ApexPage_tb',
        soqlFields: 'Id, Name, LastModifiedDate, LastModifiedBy.Name, CreatedBy.Name, CreatedDate',
        soqlWhere: 'NamespacePrefix = null',
        fields: [ 'Select','Id', 'Name', 'LastModifiedDate', 'LastModifiedBy',
            'CreatedDate','CreatedBy' ],
        apiFieldIndex: 2,
    }, {
        type:'ApexTrigger',
        table: 'ApexTrigger_tb',
        soqlFields: 'Id, Name, LastModifiedDate, LastModifiedBy.Name, CreatedBy.Name, CreatedDate',
        soqlWhere: 'NamespacePrefix = null',
        fields: [ 'Select','Id', 'Name', 'LastModifiedDate', 'LastModifiedBy',
            'CreatedDate','CreatedBy' ],
        apiFieldIndex: 2,
    }, {
        type:'ApexComponent',
        table: 'ApexComponent_tb',
        soqlFields: 'Id, Name, LastModifiedDate, LastModifiedBy.Name, CreatedBy.Name, CreatedDate',
        soqlWhere: 'NamespacePrefix = null',
        fields: [ 'Select','Id', 'Name', 'LastModifiedDate', 'LastModifiedBy',
            'CreatedDate','CreatedBy' ],
        apiFieldIndex: 2,
    }, {
        type:'StaticResource',
        table: 'StaticResource_tb',
        soqlFields: 'Id, Name, LastModifiedDate, LastModifiedBy.Name, CreatedBy.Name, CreatedDate',
        soqlWhere: 'NamespacePrefix = null',
        fields: [ 'Select','Id', 'Name', 'LastModifiedDate', 'LastModifiedBy',
            'CreatedDate','CreatedBy' ],
        apiFieldIndex: 2,
    }, {
        type:'WebLink',
        table: 'WebLink_tb',
        soqlFields: 'Id, Name, LastModifiedDate, LastModifiedBy.Name, CreatedBy.Name, CreatedDate, PageOrSobjectType',
        soqlWhere: 'NamespacePrefix = null',
        fields: ['Select','Id', 'Name', 'PageOrSobjectType', 'LastModifiedDate', 'LastModifiedBy',
            'CreatedDate','CreatedBy'],
        apiFieldIndex: [3,2],
    }, {
        type:'Dashboard',
        table: 'Dashboard_tb',
        soqlFields: 'Id, Title, LastModifiedDate, LastModifiedBy.Name, CreatedBy.Name, CreatedDate',
        soqlWhere: 'NamespacePrefix = null',
        fields: [ 'Select','Id', 'Title', 'LastModifiedDate', 'LastModifiedBy',
            'CreatedDate','CreatedBy' ],
        apiFieldIndex: 2,
    }, {
        type:'Report',
        table: 'Report_tb',
        soqlFields: 'Id, Name, DeveloperName,LastModifiedDate, LastModifiedBy.Name, CreatedBy.Name, CreatedDate',
        soqlWhere: 'NamespacePrefix = null',
        fields: [ 'Select','Id', 'Name','DeveloperName','LastModifiedDate', 'LastModifiedBy',
            'CreatedDate','CreatedBy' ],
        apiFieldIndex: 3,
    }, {
        type:'RecordType',
        table: 'RecordType_tb',
        soqlFields: 'Id, SobjectType, Name, LastModifiedDate, LastModifiedBy.Name, CreatedBy.Name, CreatedDate, DeveloperName',
        soqlWhere: 'NamespacePrefix = null',
        fields: [ 'Select','Id', 'SobjectType' ,'Name','DeveloperName','LastModifiedDate', 'LastModifiedBy',
            'CreatedDate','CreatedBy' ],
        apiFieldIndex: [2,4],
    }, {
        type:'ActionLinkGroupTemplate',
        table: 'ActionLinkGroupTemplate_tb',
        soqlFields: 'Id, MasterLabel, DeveloperName, LastModifiedDate, LastModifiedBy.Name, CreatedBy.Name, CreatedDate',
        soqlWhere: 'Id != null',
        fields: [ 'Select','Id', 'MasterLabel', 'DeveloperName', 'LastModifiedDate', 'LastModifiedBy',
            'CreatedDate','CreatedBy' ],
        apiFieldIndex: 3,
    }];

function __getCookie(c_name){
    let i;
    let x;
    let y;
    const ARRcookies=document.cookie.split(";");
    for (i=0;i<ARRcookies.length;i++){
        x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
        y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
        x=x.replace(/^\s+|\s+$/g,"");
        if (x==c_name){
            return unescape(y);
        }
    }
}

let filterBy = 'LastModifiedDate';
let filterByMetadata = 'lastModifiedDate';


const sforce = new jsforce.Connection({
    serverUrl : getServerURL(),
    sessionId : __getCookie('sid')
});
function changefilterMode(newmode,newmode1) {
    filterBy = newmode;
    filterByMetadata = newmode1;
}

function getServerURL() {
    const url = window.location.href;
    const arr = url.split("/");
    return `${arr[0]}//${arr[2]}`;
}

const blobToBase64 = (blob, cb) => {
    const reader = new FileReader();
    reader.onload = () => {
        const dataUrl = reader.result;
        const base64 = dataUrl.split(',')[1];
        cb(base64);
    };
    reader.readAsDataURL(blob);
};

function addRow(data, fields, table) {
    jQuery(table).append('<tr/>');

    const tdgroup = fields.map(item => {
        if(item == 'Select') {
            return jQuery('<td><i class="fa fa-square-o"></i></td>');
        }
        else if(data[item] == 'null' || data[item] == null) {
            return jQuery('<td></td>');
        }
        else if(isDate(data[item])) {
            return jQuery(`<td>${showDate(data[item])}<br/>(${moment(new Date(data[item])).fromNow()})</td>`);
        }
        else if(typeof(data[item]) == 'string') {
            return jQuery(`<td>${data[item]}</td>`);
        }
        else {
            return jQuery(`<td>${data[item].Name}</td>`);
        }
        return jQuery('<td></td>');
    });
    tdgroup.forEach(value => {
        jQuery(table).find('tr:last').append(value);
    });
}
function isDate(val) {
    const d = new Date(val);
    return !isNaN(d.valueOf());
}

function showDate(theDate) {
    const newDate = new Date(theDate);
    const today = newDate;
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    if (month < 10)
        month = `0${month}`;
    if (day < 10)
        day = `0${day}`;
    return `${year}-${month}-${day}`;
}

function createPanel(title,table,tab) {
    jQuery(tab).append(`<li><a href="#${jQuery(table).attr('Id')}-tab" role="tab" data-toggle="tab">${title}</a></li>`)
    const topPanel = jQuery(`<div class="tab-pane" id="${jQuery(table).attr('Id')}-tab"/>`);
    const panel = jQuery('<div class="panel panel-default"/>');
    jQuery(panel).append(`<div class="panel-heading"> ${title}</div>`);
    jQuery(panel).append('<div class="panel-body"></div>');
    jQuery(panel).find('.panel-body').append(jQuery(table));
    jQuery(topPanel).append(jQuery(panel));
    return jQuery(topPanel);
}

function createTable(fields,tableId) {
    const table = jQuery(`<table id="${tableId}" cellpadding="0" border="0" class="table table-striped table-bordered" cellspacing="0" width="100%"></table>`);
    jQuery(table).append('<thead></thead>');
    jQuery(table).append('<tbody></tbody>');
    jQuery(table).find('thead').append('<tr/>');
    for (i = 0; i < fields.length; i++) {
        if(fields[i] == 'Select') {
            jQuery(table).find('tr:last').append(
                `<td><input type="checkbox" onclick="selectAll(this,'${tableId}','')"/></td>`);
        }
        else {
            jQuery(table).find('thead>tr').append(`<th>${fields[i]}</th>`);
        }
    }
    return jQuery(table);
}

function selectAll(check,table,obj) {
    let dataTbl;
    if(table != '') {
        dataTbl = jQuery(`#${table}`).dataTable();
    }
    else {
        dataTbl = jQuery(obj).dataTable();
    }
    const nNodes = dataTbl.fnGetNodes();
    jQuery(nNodes).each(function() {
        if(check == '' || jQuery(check).is(':checked')) {
            jQuery(this).addClass('selected');
            jQuery(this).find('i.fa').removeClass('fa-square-o').addClass('fa-check-square-o');
        }
        else {
            jQuery(this).removeClass('selected');
            jQuery(this).find('i.fa').removeClass('fa-check-square-o').addClass('fa-square-o');
        }
    });
}

function globalSelectAll() {
    requestMetadata.forEach((val, index) => {
        selectAll('','',jQuery(`#${val.table}`));
    });
    requestSqlData.forEach((val, index) => {
        selectAll('','',jQuery(`#${val.table}`));
    });
}

function globalUnSelectAll() {
    requestMetadata.forEach((val, index) => {
        selectAll(' ','',jQuery(`#${val.table}`));
    });
    requestSqlData.forEach((val, index) => {
        selectAll(' ','',jQuery(`#${val.table}`));
    });
}

function waitForDone(callback) {
    function getResult(id) {
        sforce.metadata.checkRetrieveStatus(id, callback);
    }
    function check(results) {
        const done = results[0].getBoolean("done");
        if (!done) {
            sforce.metadata.checkStatus([results[0].id], check);
        } else {
            getResult(results[0].id);
        }
    }
    return result => {
        check([result]);
    };
}
function maketypeblock(table_data,index,name) {
    let XMLString = '';
    if(jQuery(table_data).DataTable().rows('.selected').data().length > 0) {
        XMLString += '\n    <types>';
        jQuery(jQuery(table_data).DataTable().rows('.selected').data()).each(function() {
            const current = jQuery(this);
            XMLString += '\n        <members>';
            if(typeof(index) == 'number') {
                if(jQuery(this)[index] != '' && jQuery(this)[index] != 'null' && jQuery(this)[index] != null) {
                    XMLString += jQuery(this)[index];
                }
            }
            else {
                for(i = 0 ; i < index.length ; i++) {
                    if(jQuery(this)[index[i]] != '' && jQuery(this)[index[i]] != 'null' && jQuery(this)[index[i]] != null) {
                        if(i != index.length - 1) {
                            XMLString += `${jQuery(this)[index[i]]}.`;
                        }
                        else {
                            XMLString += jQuery(this)[index[i]];
                        }
                    }
                }
            }
            XMLString += '</members>';
        });
        XMLString += ` \n       <name>${name}</name>`;
        XMLString += ' \n   </types>';
    }

    return XMLString;
}
function makeobjectToRetrive(table_data, index, type) {
    let returnData;
    if(jQuery(table_data).DataTable().rows('.selected').data().length > 0) {
        returnData = {name:type,members:[]};
        jQuery(jQuery(table_data).DataTable().rows('.selected').data()).each(function() {
            if(typeof(index) == 'number') {
                if(jQuery(this)[index] != '' && jQuery(this)[index] != 'null' && jQuery(this)[index] != null) {
                    returnData.members.push(jQuery(this)[index]);
                }
            }
            else {
                for(i = 0 ; i < index.length ; i++) {
                    let XMLString = '';
                    if(jQuery(this)[index[i]] != '' && jQuery(this)[index[i]] != 'null' && jQuery(this)[index[i]] != null) {
                        if(i != index.length - 1) {
                            XMLString += `${jQuery(this)[index[i]]}.`;
                        }
                        else {
                            XMLString += jQuery(this)[index[i]];
                        }
                    }
                    returnData.members.push(XMLString);
                }
            }
        });
    }
    return returnData;
}
function getPackage() {
    showLoading();
    const resourceType = [];

    requestMetadata.forEach((val, index) => {
        const result = makeobjectToRetrive(jQuery(`#${val.table}`),val.apiFieldIndex,val.type);
        if(typeof(result) != 'undefined') {
            resourceType.push(result);
        }
    });
    requestSqlData.forEach((val, index) => {
        const result = makeobjectToRetrive(jQuery(`#${val.table}`),val.apiFieldIndex,val.type);
        if(typeof(result) != 'undefined') {
            resourceType.push(result);
        }
    });
    if(resourceType.length > 0) {
        sforce.metadata.retrieve({
            unpackaged: {
                types: resourceType,
                version: apiVersion
            }
        }).complete((err, value) => {
            if (err) { console.error(err); }
            console.log('ready for download..');
            location.href=`data:application/zip;base64,${value.zipFile}`;
            hideLoading();
        });
    }
    else {
        alert('No Resource selected...');
        hideLoading();
    }
}
function deploy() {
    /*
    jQuery('#loginDialog').modal({
        backdrop: 'static',
        keyboard: true
    });
    */
}

function loginUser() {
    const resourceType = [];

    requestMetadata.forEach((val, index) => {
        const result = makeobjectToRetrive(jQuery(`#${val.table}`),val.apiFieldIndex,val.type);
        if(typeof(result) != 'undefined') {
            resourceType.push(result);
        }
    });
    requestSqlData.forEach((val, index) => {
        const result = makeobjectToRetrive(jQuery(`#${val.table}`),val.apiFieldIndex,val.type);
        if(typeof(result) != 'undefined') {
            resourceType.push(result);
        }
    });

    const requestObj = sforce.metadata.retrieve({
        unpackaged: {
            types: resourceType,
            version: apiVersion
        }
    });

    const fileName = 'package.zip';

    requestObj.complete((err, value) => {
        if (err) { console.error(err); }
        console.log('ready for download..');
        const bigTestBlob = new Blob([value.zipFile], { type: "application/zip" });
        blobToBase64(bigTestBlob, x => {
            //console.log(value.zipFile);
            //location.href="data:application/zip;base64," + value.zipFile;
            const fileObj = new File([x], fileName, { type: 'application/zip'});
            console.log('File object created:', fileObj);

            const formData = new FormData();
            formData.append('file', fileObj);

            fetch('http://localhost:3000/upload', { // Your POST endpoint
                method: 'POST',
                body: formData
            }).then(
                response => response.json() // if the response is a JSON object
            ).then(
                success => console.log(success) // Handle the success response object
            ).catch(
                error => console.log(error) // Handle the error response object
            );
        });

    });
}

function generateXml() {
    let XMLString = '<?xml version="1.0" encoding="UTF-8"?>';
    XMLString += '\n<Package xmlns="http://soap.sforce.com/2006/04/metadata">'

    requestMetadata.forEach((val, index) => {
        XMLString += maketypeblock(jQuery(`#${val.table}`),val.apiFieldIndex,val.type);
    });
    requestSqlData.forEach((val, index) => {
        XMLString += maketypeblock(jQuery(`#${val.table}`),val.apiFieldIndex,val.type);
    });

    XMLString += `\n    <version>${apiVersion}</version>\n</Package>`;
    jQuery('#xmlData').val(XMLString);
    jQuery('#xmlDialog').modal();
}

jQuery(() => {
    showLoading();

    jQuery('#dateField').val(showDate(new Date().add(-1).month()));
    console.log("Ready for API fun!");
    sforce.metadata.describe(apiVersion).then(metadata => {
        metadata.metadataObjects.forEach(value => {
            if(value.childXmlNames) {
                value.childXmlNames.forEach(childXmlName => {
                    const result = requestSqlData.filter(item => item.type.toLowerCase() === childXmlName.toLowerCase());
                    if(result.length == 0) {
                        requestMetadata.push({
                            type: childXmlName,
                            table: `${childXmlName}_tb`,
                            apiFieldIndex: 2,
                        });
                    }
                });
            }
            const result = requestSqlData.filter(item => item.type.toLowerCase() === value.xmlName.toLowerCase());
            if(result.length == 0) {
                requestMetadata.push({
                    type: value.xmlName,
                    table: `${value.xmlName}_tb`,
                    apiFieldIndex: 2,
                });
            }
        });
        requestMetadata = requestMetadata.sort((a, b) => {
            if (a.type < b.type) {
                return -1;
            }
            if (a.type > b.type) {
                return 1;
            }
            return 0;
        });
        return workWithSOQL();
    })
        .then(() => workWithMetaData()).then(() => {
        jQuery(`#myTab a[href="#${requestSqlData[0].type}_tb-tab"]`).tab('show');
        hideLoading();
    }).catch(err => {
        console.error('Error',err);
    });
    jQuery('#dateField').datepicker({
        format: 'yyyy-mm-dd'
    });
});

function updateData() {
    showLoading();
    setTimeout(() => {

        jQuery('#container').html('');
        jQuery('#container-tab2').html('');
        jQuery('#container-tab').html('');
        workWithSOQL().then(() => workWithSessionStorageMetaData()).then(() => {
            jQuery(`#myTab a[href="#${requestSqlData[0].type}_tb-tab"]`).tab('show');
            hideLoading();
        }).catch(err => {
            console.error('Error',err);
        });
    },200);
}

function workWithSOQL() {

    let userDate = '2015-12-10';
    if(jQuery('#dateField').val() != '') {
        userDate = convertDate(jQuery('#dateField').val());
    }

    const requestPromises = requestSqlData.map(item => {
        let query = `Select ${item.soqlFields} From ${item.type} where `;
        query += userDate != '' ? `${filterBy} >= ${userDate} AND `: '';
        query += ` ${item.soqlWhere} order by ${filterBy} desc`;
        return sforce.query(query);
    });

    return Promise.all(requestPromises).then(results => {
        results.forEach((val, index) => {
            const records = val.records;
            if (records && records.length > 0) {
                let panel;
                let table;

                table = createTable(requestSqlData[index].fields, requestSqlData[index].table);
                panel = createPanel(requestSqlData[index].type, table, jQuery('#container-tab'));

                for (let i = 0; i < records.length; i++) {
                    addRow(records[i], requestSqlData[index].fields, jQuery(table).find('tbody'));
                }
                jQuery('#container').append(jQuery(panel));

                jQuery(`#${requestSqlData[index].table}`).DataTable({
                    order: [[requestSqlData[index].fields.indexOf('LastModifiedDate'), "desc"]],
                    iDisplayLength: 100
                });

                jQuery(`#${requestSqlData[index].table} tbody`).on('click', 'tr', function () {
                    jQuery(this).toggleClass('selected');
                    if (jQuery(this).hasClass('selected')) {
                        jQuery(this).find('i.fa').removeClass('fa-square-o').addClass('fa-check-square-o');
                    }
                    else {
                        jQuery(this).find('i.fa').removeClass('fa-check-square-o').addClass('fa-square-o');
                    }
                });
            }
        })
        return Promise.resolve();
    }).catch(err => Promise.reject(err));
}

function workWithSessionStorageMetaData() {
    const fields = [ 'Select','id', 'fullName','fileName','lastModifiedDate','lastModifiedByName',
        'createdDate','createdByName' ];
    let userDate = '2015-12-10';
    if(jQuery('#dateField').val() != '') {
        userDate = new Date(jQuery('#dateField').val());
    }
    requestMetadata.forEach(item => {
        const val = JSON.parse(sessionStorage.getItem(item.type));
        if(val && val.length > 0) {
            let panel;
            let table;

            table = createTable(fields, item.table);


            let hasRecord = false;
            val.forEach(value => {
                if (value.manageableState != "installed" && (userDate == '' || userDate < new Date(value[filterByMetadata]))) {
                    addRow(value, fields, jQuery(table).find('tbody'));
                    hasRecord = true;
                }
            });

            if(hasRecord) {
                panel = createPanel(item.type, table, jQuery('#container-tab2'));
                jQuery('#container').append(jQuery(panel));

                jQuery(`#${item.table}`).DataTable({
                    order: [[fields.indexOf('lastModifiedDate'), "desc"]],
                    iDisplayLength: 100
                });

                jQuery(`#${item.table} tbody`).on('click', 'tr', function () {
                    jQuery(this).toggleClass('selected');
                    if (jQuery(this).hasClass('selected')) {
                        jQuery(this).find('i.fa').removeClass('fa-square-o').addClass('fa-check-square-o');
                    }
                    else {
                        jQuery(this).find('i.fa').removeClass('fa-check-square-o').addClass('fa-square-o');
                    }
                });
            }
        }
    });

    return Promise.resolve();
}

function workWithMetaData() {
    const fields = [ 'Select','id', 'fullName','fileName','lastModifiedDate','lastModifiedByName',
        'createdDate','createdByName' ];
    let userDate = '2015-12-10';
    if(jQuery('#dateField').val() != '') {
        userDate = new Date(jQuery('#dateField').val());
    }
    const requestPromises = requestMetadata.map(item => {
        const types = [{type: item.type}];
        return sforce.metadata.list(types, apiVersion);
    });
    return Promise.all(requestPromises).then(results => {
        results.forEach((val, index) => {
            if(val && val.length > 0) {
                sessionStorage.setItem(requestMetadata[index].type, JSON.stringify(val));
                let panel;
                let table;

                table = createTable(fields, requestMetadata[index].table);


                let hasRecord = false;
                val.forEach(value => {
                    if (value.manageableState != "installed" && (userDate == '' || userDate < new Date(value[filterByMetadata]))) {
                        addRow(value, fields, jQuery(table).find('tbody'));
                        hasRecord = true;
                    }
                });

                if(hasRecord) {
                    panel = createPanel(requestMetadata[index].type, table, jQuery('#container-tab2'));
                    jQuery('#container').append(jQuery(panel));

                    jQuery(`#${requestMetadata[index].table}`).DataTable({
                        order: [[fields.indexOf('lastModifiedDate'), "desc"]],
                        iDisplayLength: 100
                    });

                    jQuery(`#${requestMetadata[index].table} tbody`).on('click', 'tr', function () {
                        jQuery(this).toggleClass('selected');
                        if (jQuery(this).hasClass('selected')) {
                            jQuery(this).find('i.fa').removeClass('fa-square-o').addClass('fa-check-square-o');
                        }
                        else {
                            jQuery(this).find('i.fa').removeClass('fa-check-square-o').addClass('fa-square-o');
                        }
                    });
                }
            } else {
                sessionStorage.removeItem(requestMetadata[index].type);
            }
        });
        return Promise.resolve();
    }).catch(err => Promise.reject(err));
}


function convertDate(theDate) {
    if(typeof(theDate) != 'undefined') {
        const newDate = new Date(theDate);
        const today = newDate;
        const year = today.getFullYear();
        let month = today.getMonth() + 1;
        let day = today.getDate();
        if (month < 10)
            month = `0${month}`;
        if (day < 10)
            day = `0${day}`;
        return `${year}-${month}-${day}T00:00:00Z`;
    }
    else {
        return '';
    }
}

function showLoading() {
    if(!jQuery('#status').hasClass('show')) {
        jQuery('#status').addClass('show');
        jQuery('#status').show(); // will first fade out the sfdcConsoleloading animation
        jQuery('#preloader').show(); // will fade out the white DIV that covers the website.
    }
}
function hideLoading() {
    jQuery('#status').removeClass('show');
    jQuery('#status').hide(); // will first fade out the sfdcConsoleloading animation
    jQuery('#preloader').hide(); // will fade out the white DIV that covers the website.
}