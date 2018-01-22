'use strict';

console.log('\'Allo \'Allo! Content script','Xenotime');
var availableResource = ["QuickActionDefinition", "ActionLinkGroupTemplate", "ApexClass", "CustomShareRowCause", "ApexTrigger", "TabSet", "ProcessDefinition", "ContentAsset", "AssignmentRule", "AssistantRecommendationType", "AuthProvider", "AutoResponseRule", "WebLink", "CorsWhitelistEntry", "CallCenter", "ChatterExtension", "CommChannelLayout", "CompactLayout", "CspTrustedSite", "CustomConsoleComponent", "CustomFieldDefinition", "ExternalString", "Custom Metadata Type", "CustomEntityDefinition", "CustomPermission", "CustomReportType", "Custom Settings", "Dashboard", "CleanDataService", "Document", "DuplicateRule", "EclairNgMapGeoJson", "EmailTemplate", "EscalationRule", "EventSubscription", "ExternalDataSource", "ExternalServiceRegistration", "FeedFilterDefinition", "FieldMapping", "FieldSet", "FlowDefinition", "Folder", "SharedPicklistDefinition", "Group", "PageComponent", "CustomPage", "BrandTemplate", "CommunityTemplateDefinition", "AuraDefinitionBundle", "FlexiPage", "LightningExperienceTheme", "ListView", "MatchingRule", "MailAppOwaWhitelist", "NamedCredential", "Network", "Layout", "PathAssistant", "PermissionSet", "PlatformCachePartition", "FeedPostTemplate", "Queues", "RecordType", "RemoteProxy", "Report", "ReportJob", "UserRole", "Scontrol", "SecurityCustomBaseline", "ActionSend", "CustomObjectCriteriaSharingRule", "CustomObjectOwnerSharingRule", "SharingSet", "Site", "StaticResource", "CustomTabDefinition", "UserProvisioningConfig", "VF_Email_Template__mdt", "ValidationFormula", "ApexComponent", "ApexPage", "CspFrameAncestor", "ActionEmail", "ActionFieldUpdate", "ActionOutboundMessage", "WorkflowRule", "ActionTask", "Community", "qbdialer__isTriggerConfig__mdt"];
var requestSplit = ["ListView", "Layout"];
window.onload = function() {
    if(window.location.href.indexOf('changemgmt/createOutboundChangeSet.apexp?auto=1') >= 0) {
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
                localStorage.setItem('processStatus','2');
                setTimeout(saveChangeSet.click(),100);
            }
        }
    }

    if(window.location.href.indexOf('changemgmt/outboundChangeSetDetailPage.apexp') >= 0) {
        var changeSet = JSON.parse(localStorage.getItem('changeSet'));
        var processStatus = localStorage.getItem('processStatus');
        var DoneChangeSet = localStorage.getItem('DoneChangeSet') != null ? JSON.parse(localStorage.getItem('DoneChangeSet')) : [];
        if(processStatus == '2' && changeSet.length > 0) {
            var pendingProcess = changeSet.filter(function (item) {
                return DoneChangeSet.indexOf(item.name) < 0 && availableResource.indexOf(item.name) >= 0;
            });
            console.log(pendingProcess);
            if(pendingProcess.length > 0) {
                var currentProcess = pendingProcess[0];
                sessionStorage.setItem('CurrentProcess', JSON.stringify(currentProcess));
                localStorage.setItem('DoneChangeSet', JSON.stringify(DoneChangeSet));
                var outboundCs_add = document.getElementById('outboundChangeSetDetailPage:outboundChangeSetDetailPageBody:outboundChangeSetDetailPageBody:detail_form:outboundCs_componentsBlock:component_list_form_buttons:outboundCs_add');

                setTimeout(outboundCs_add.click(),100);
            } else {
                localStorage.removeItem('processStatus');
                alert('Your Change Set is ready...');
            }
        }
    }

    if(window.location.href.indexOf('p/mfpkg/AddToPackageFromChangeMgmtUi') >= 0) {

        var processStatus = localStorage.getItem('processStatus');
        if(processStatus == '2') {
            var rowsperpage = getUrlEncodedKey('rowsperpage');
            var entityType = getUrlEncodedKey('entityType');
            var currentProcess = sessionStorage.getItem('CurrentProcess') != null ? JSON.parse(sessionStorage.getItem('CurrentProcess')) : null;
            if(currentProcess != null) {
                if (rowsperpage == '' || entityType != currentProcess.name) {
                    var path = setUrlEncodedKey('rowsperpage', '1500', window.location.search);
                    path = setUrlEncodedKey('entityType', currentProcess.name, path);
                    setTimeout(function () {
                        window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname + path;
                    }, 100);
                } else {
                    if (currentProcess && entityType == currentProcess.name) {
                        var needSave = false;
                        document.querySelectorAll('input[type=checkbox]').forEach(function (item) {
                            if (item.title.startsWith("Select ") && item.title.split(' ').length >= 2) {
                                var result = currentProcess.members.filter(function (member) {
                                        return member == convertSFDC15To18(item.value);
                                });
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
                            return DoneChangeSet.indexOf(item.name) < 0 && availableResource.indexOf(item.name) >= 0;
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
                            setTimeout(document.querySelector('input[name=save]').click(),100);
                        } else {
                            window.location.href = window.location.href;
                        }
                    }
                }
            } else if(processStatus != null){
                localStorage.removeItem('processStatus');
                setTimeout(document.querySelector('input[name=cancel]').click(),100);
            }
        }
    }
};