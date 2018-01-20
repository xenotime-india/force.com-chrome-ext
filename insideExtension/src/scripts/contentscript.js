'use strict';

console.log('\'Allo \'Allo! Content script','Xenotime');
jQuery(function() {
    if(window.location.href.indexOf('changemgmt/createOutboundChangeSet.apexp') > 0) {
        var changeSetName = jQuery('CreateOutboundChangeSetPage:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetForm:CreateOutboundChangePageBlock:changesetTableSection:nameSection:changeSetName');

        if (changeSetName) {
            changeSetName.value = 'New Change Set';
        }
        var changeSetDescription = jQuery('CreateOutboundChangeSetPage:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetForm:CreateOutboundChangePageBlock:changesetTableSection:descriptionSection:changeSetDescription');
        if (changeSetDescription) {
            changeSetDescription.value = 'New Change Description';
        }

        var saveChangeSet = jQuery('CreateOutboundChangeSetPage:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetForm:CreateOutboundChangePageBlock:form_buttons:saveChangeSet');
        if (saveChangeSet) {
            saveChangeSet.click();
        }
    }

    if(window.location.href.indexOf('changemgmt/outboundChangeSetDetailPage.apexp') > 0) {
        var changeSet = JSON.parse(localStorage.getItem('changeSet'));
        if(changeSet.length > 0) {
            var currentProcess = changeSet[0];
            sessionStorage.setItem('CurrentProcess', JSON.stringify(currentProcess));
            sessionStorage.setItem('DoneChangeSet', JSON.stringify([]));
        }
    }

    if(window.location.href.indexOf('p/mfpkg/AddToPackageFromChangeMgmtUi') > 0) {

        var rowsperpage = getUrlEncodedKey('rowsperpage');
        var entityType = getUrlEncodedKey('entityType');
        var currentProcess = sessionStorage.getItem('CurrentProcess') != null ? JSON.parse(sessionStorage.getItem('CurrentProcess')) : null;
        if(currentProcess != null && currentProcess.members.length>0) {
            if (rowsperpage == '') {
                var path = setUrlEncodedKey('rowsperpage', '1500', window.location.search);
                path = setUrlEncodedKey('entityType', currentProcess.name, path);
                setTimeout(function () {
                    window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname + path;
                }, 500);
            } else {
                console.log(currentProcess);
                if (currentProcess && entityType == currentProcess.name) {
                    document.querySelectorAll('input[type=checkbox]').forEach(function (item) {
                        if(item.title.startsWith("Select ") && item.title.split(' ').length == 2) {
                            var result = currentProcess.members.filter(function (member) {
                                return member.toLowerCase() == item.title.split(' ')[1].toLowerCase();
                            })
                            if(result.length>0) {
                                item.checked = true;
                            }
                        }
                    });
                    var DoneChangeSet = JSON.parse(sessionStorage.getItem('DoneChangeSet'));
                    DoneChangeSet.push(currentProcess.name);

                    var changeSet = JSON.parse(localStorage.getItem('changeSet'));

                    var pendingProcess = changeSet.filter(function (item) {
                        return DoneChangeSet == null || DoneChangeSet.indexOf(item.name) < 0;
                    });
                    console.log(pendingProcess);
                    if(pendingProcess.length > 0) {
                        currentProcess = pendingProcess[0];
                        sessionStorage.setItem('CurrentProcess',JSON.stringify(currentProcess));
                        sessionStorage.setItem('DoneChangeSet',JSON.stringify(DoneChangeSet));
                        document.querySelector('input[name=save]').click();
                    } else {
                        document.querySelector('input[name=cancel]').click();
                    }
                }
            }
        }
    }
})