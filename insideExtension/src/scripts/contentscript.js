'use strict';

console.log('\'Allo \'Allo! Content script','Xenotime');
jQuery(function() {
    if(window.location.href.indexOf('changemgmt/createOutboundChangeSet.apexp')) {
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

    if(window.location.href.indexOf('changemgmt/outboundChangeSetDetailPage.apexp')) {
        var outboundCs_add = jQuery('outboundChangeSetDetailPage:outboundChangeSetDetailPageBody:outboundChangeSetDetailPageBody:detail_form:outboundCs_componentsBlock:component_list_form_buttons:outboundCs_add');
        if (outboundCs_add) {
            outboundCs_add.click();
        }
    }

    if(window.location.href.indexOf('p/mfpkg/AddToPackageFromChangeMgmtUi')) {

        var changeSet = JSON.parse(localStorage.getItem('changeSet'));
        console.log(changeSet);
        var entityType = getUrlEncodedKey('entityType');
        if (entityType != '') {
            switch (entityType.value) {
                case 'App' :
                entityType.value = 'ApexTrigger';
                entityType.form.submit();
                break;
            }
        } else if(entityType != 'ApexTrigger') {

            var path = setUrlEncodedKey('entityType','ApexTrigger');
            var path = setUrlEncodedKey('rowsperpage','1500', path);
            setTimeout(function () {
                window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname + path;
            },500);
        }
    }
})