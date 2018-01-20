'use strict';

console.log('\'Allo \'Allo! Content script','Xenotime');
window.onload = function() {
    if(window.location.href.indexOf('changemgmt/createOutboundChangeSet.apexp') >= 0) {
        var processStatus = localStorage.getItem('processStatus');
        var changeSetNameVal = localStorage.getItem('changeSetName');
        var changeSetDescriptionVal = localStorage.getItem('changeSetDescription');
        if(processStatus == '1') {
            var pageDescription = document.querySelector('.pageDescription');
            if (pageDescription) {
                pageDescription.innerHTML = 'Creating New Change Set using automated tool.';
            }
            var changeSetName = document.getElementById('CreateOutboundChangeSetPage:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetForm:CreateOutboundChangePageBlock:changesetTableSection:nameSection:changeSetName');

            if (changeSetName) {
                changeSetName.value = changeSetNameVal;
            }
            var changeSetDescription = document.getElementById('CreateOutboundChangeSetPage:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetForm:CreateOutboundChangePageBlock:changesetTableSection:descriptionSection:changeSetDescription');
            if (changeSetDescription) {
                changeSetDescription.value = changeSetDescriptionVal;
            }

            localStorage.removeItem('changeSetName');
            localStorage.removeItem('changeSetDescription');

            var saveChangeSet = document.getElementById('CreateOutboundChangeSetPage:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetForm:CreateOutboundChangePageBlock:form_buttons:saveChangeSet');
            if (saveChangeSet) {
                saveChangeSet.click();
            }
        }
    }

    if(window.location.href.indexOf('changemgmt/outboundChangeSetDetailPage.apexp') >= 0) {
        var changeSet = JSON.parse(localStorage.getItem('changeSet'));
        var processStatus = localStorage.getItem('processStatus');
        var DoneChangeSet = localStorage.getItem('DoneChangeSet') != null ? JSON.parse(localStorage.getItem('DoneChangeSet')) : [];
        if(processStatus == '1' && changeSet.length > 0) {
            var pendingProcess = changeSet.filter(function (item) {
                return DoneChangeSet.indexOf(item.name) < 0;
            });
            console.log(pendingProcess);
            if(pendingProcess.length > 0) {
                var currentProcess = pendingProcess[0];
                sessionStorage.setItem('CurrentProcess', JSON.stringify(currentProcess));
                localStorage.setItem('DoneChangeSet', JSON.stringify(DoneChangeSet));
                var outboundCs_add = document.getElementById('outboundChangeSetDetailPage:outboundChangeSetDetailPageBody:outboundChangeSetDetailPageBody:detail_form:outboundCs_componentsBlock:component_list_form_buttons:outboundCs_add');

                setTimeout(outboundCs_add.click(),500);
            }
        }
    }

    if(window.location.href.indexOf('p/mfpkg/AddToPackageFromChangeMgmtUi') >= 0) {

        var processStatus = localStorage.getItem('processStatus');
        if(processStatus == '1') {
            var rowsperpage = getUrlEncodedKey('rowsperpage');
            var entityType = getUrlEncodedKey('entityType');
            var currentProcess = sessionStorage.getItem('CurrentProcess') != null ? JSON.parse(sessionStorage.getItem('CurrentProcess')) : null;
            if(currentProcess != null) {
                if (rowsperpage == '') {
                    var path = setUrlEncodedKey('rowsperpage', '1500', window.location.search);
                    path = setUrlEncodedKey('entityType', currentProcess.name, path);
                    setTimeout(function () {
                        window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname + path;
                    }, 500);
                } else {
                    if (currentProcess && entityType == currentProcess.name) {
                        var needSave = false;
                        document.querySelectorAll('input[type=checkbox]').forEach(function (item) {
                            if (item.title.startsWith("Select ") && item.title.split(' ').length == 2) {
                                var result = currentProcess.members.filter(function (member) {
                                    return member.toLowerCase() == item.title.split(' ')[1].toLowerCase();
                                })
                                if (result.length > 0) {
                                    item.checked = true;
                                    needSave = true;
                                }
                            }
                        });
                        var DoneChangeSet = JSON.parse(localStorage.getItem('DoneChangeSet'));
                        DoneChangeSet.push(currentProcess.name);

                        var changeSet = JSON.parse(localStorage.getItem('changeSet'));

                        var pendingProcess = changeSet.filter(function (item) {
                            return DoneChangeSet == null || DoneChangeSet.indexOf(item.name) < 0;
                        });
                        console.log(pendingProcess);
                        if (pendingProcess.length > 0) {
                            currentProcess = pendingProcess[0];
                            sessionStorage.setItem('CurrentProcess', JSON.stringify(currentProcess));
                            localStorage.setItem('DoneChangeSet', JSON.stringify(DoneChangeSet));
                        } else {
                            sessionStorage.removeItem('CurrentProcess');
                            localStorage.setItem('DoneChangeSet', JSON.stringify(DoneChangeSet));
                        }
                        if(needSave) {
                            setTimeout(document.querySelector('input[name=save]').click(),500);
                        } else {
                            window.location.href = window.location.href;
                        }
                    }
                }
            } else {
                localStorage.setItem('processStatus', '0');
                setTimeout(document.querySelector('input[name=cancel]').click(),500);
            }
        }
    }
};