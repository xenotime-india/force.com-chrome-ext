console.log('\'Allo \'Allo! Content script','Xenotime');
var availableResource = {
    "QuickAction": "QuickActionDefinition",
    "ActionLinkGroupTemplate": "ActionLinkGroupTemplate",
    "ApexClass": "ApexClass",
    "CustomShareRowCause": "CustomShareRowCause",
    "ApexTrigger": "ApexTrigger",
    "TabSet": "TabSet",
    "Process": "ProcessDefinition",
    "ContentAsset": "ContentAsset",
    "AssignmentRule": "AssignmentRule",
    "AssistantRecommendationType": "AssistantRecommendationType",
    "AuthProvider": "AuthProvider",
    "AutoResponseRule": "AutoResponseRule",
    "WebLink": "WebLink",
    "CorsWhitelistEntry": "CorsWhitelistEntry",
    "CallCenter": "CallCenter",
    "ChatterExtension": "ChatterExtension",
    "CommChannelLayout": "CommChannelLayout",
    "CompactLayout": "CompactLayout",
    "CspTrustedSite": "CspTrustedSite",
    "CustomConsoleComponent": "CustomConsoleComponent",
    "CustomField": "CustomFieldDefinition",
    "ExternalString": "ExternalString",
    "Custom Metadata Type": "Custom Metadata Type",
    "CustomEntity": "CustomEntityDefinition",
    "CustomPermission": "CustomPermission",
    "CustomReportType": "CustomReportType",
    "Custom Settings": "Custom Settings",
    "Dashboard": "Dashboard",
    "CleanDataService": "CleanDataService",
    "Document": "Document",
    "DuplicateRule": "DuplicateRule",
    "EclairNgMapGeoJson": "EclairNgMapGeoJson",
    "EmailTemplate": "EmailTemplate",
    "EscalationRule": "EscalationRule",
    "EventSubscription": "EventSubscription",
    "ExternalDataSource": "ExternalDataSource",
    "ExternalServiceRegistration": "ExternalServiceRegistration",
    "FeedFilter": "FeedFilterDefinition",
    "FieldMapping": "FieldMapping",
    "FieldSet": "FieldSet",
    "Flow": "FlowDefinition",
    "Folder": "Folder",
    "SharedPicklist": "SharedPicklistDefinition",
    "Group": "Group",
    "PageComponent": "PageComponent",
    "CustomPage": "CustomPage",
    "BrandTemplate": "BrandTemplate",
    "CommunityTemplate": "CommunityTemplateDefinition",
    "AuraDefinitionBundle": "AuraDefinitionBundle",
    "FlexiPage": "FlexiPage",
    "LightningExperienceTheme": "LightningExperienceTheme",
    "ListView": "ListView",
    "MatchingRule": "MatchingRule",
    "MailAppOwaWhitelist": "MailAppOwaWhitelist",
    "NamedCredential": "NamedCredential",
    "Network": "Network",
    "Layout": "Layout",
    "PathAssistant": "PathAssistant",
    "PermissionSet": "PermissionSet",
    "PlatformCachePartition": "PlatformCachePartition",
    "FeedPostTemplate": "FeedPostTemplate",
    "Queues": "Queues",
    "RecordType": "RecordType",
    "RemoteProxy": "RemoteProxy",
    "Report": "Report",
    "ReportJob": "ReportJob",
    "UserRole": "UserRole",
    "Scontrol": "Scontrol",
    "SecurityCustomBaseline": "SecurityCustomBaseline",
    "ActionSend": "ActionSend",
    "CustomObjectCriteriaSharingRule": "CustomObjectCriteriaSharingRule",
    "CustomObjectOwnerSharingRule": "CustomObjectOwnerSharingRule",
    "SharingSet": "SharingSet",
    "Site": "Site",
    "StaticResource": "StaticResource",
    "CustomTab": "CustomTabDefinition",
    "UserProvisioningConfig": "UserProvisioningConfig",
    "VF_Email_Template__mdt": "VF_Email_Template__mdt",
    "ValidationFormula": "ValidationFormula",
    "ApexComponent": "ApexComponent",
    "ApexPage": "ApexPage",
    "CspFrameAncestor": "CspFrameAncestor",
    "ActionEmail": "ActionEmail",
    "ActionFieldUpdate": "ActionFieldUpdate",
    "ActionOutboundMessage": "ActionOutboundMessage",
    "WorkflowRule": "WorkflowRule",
    "ActionTask": "ActionTask",
    "Community": "Community"
};
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
        var profiles = JSON.parse(localStorage.getItem('profiles'));
        var processStatus = localStorage.getItem('processStatus');
        var DoneChangeSet = localStorage.getItem('DoneChangeSet') != null ? JSON.parse(localStorage.getItem('DoneChangeSet')) : [];
        if(processStatus == '2' && changeSet.length > 0) {
            var pendingProcess = changeSet.filter(function (item) {
                return DoneChangeSet.indexOf(item.name) < 0 && availableResource[item.name];
            });
            console.log(pendingProcess);
            if(pendingProcess.length > 0) {
                var alertDiv = document.createElement("div");
                alertDiv.style.padding = "20px";
                alertDiv.style.backgroundColor = "#2196F3";
                alertDiv.style.color = "white";
                alertDiv.innerHTML = "Your Change Set is in progress. Please Wait...";

                var bDescription = document.querySelector('.bDescription')
                bDescription.innerHTML = '';
                bDescription.appendChild(alertDiv);

                var currentProcess = pendingProcess[0];
                sessionStorage.setItem('CurrentProcess', JSON.stringify(currentProcess));
                localStorage.setItem('DoneChangeSet', JSON.stringify(DoneChangeSet));
                var outboundCs_add = document.getElementById('outboundChangeSetDetailPage:outboundChangeSetDetailPageBody:outboundChangeSetDetailPageBody:detail_form:outboundCs_componentsBlock:component_list_form_buttons:outboundCs_add');

                setTimeout(outboundCs_add.click(),500);
            } else if(profiles.members.length > 0){
                localStorage.setItem('processStatus','3');
                var alertDiv = document.createElement("div");
                alertDiv.style.padding = "20px";
                alertDiv.style.backgroundColor = "#2196F3";
                alertDiv.style.color = "white";
                alertDiv.innerHTML = "Your Change Set is in progress. Please Wait...";

                var bDescription = document.querySelector('.bDescription')
                bDescription.innerHTML = '';
                bDescription.appendChild(alertDiv);
                var outboundCs_addProfile = document.getElementById('outboundChangeSetDetailPage:outboundChangeSetDetailPageBody:outboundChangeSetDetailPageBody:detail_form:outboundCs_profilesBlock:component_list_form_buttons:outboundCs_addProfile');

                setTimeout(outboundCs_addProfile.click(),500);
            } else {
                localStorage.removeItem('processStatus');
                var alertDiv = document.createElement("div");
                alertDiv.style.padding = "20px";
                alertDiv.style.backgroundColor = "#4CAF50";
                alertDiv.style.color = "white";
                alertDiv.innerHTML = "Your Change Set is ready...";

                var bDescription = document.querySelector('.bDescription')
                bDescription.innerHTML = '';
                bDescription.appendChild(alertDiv);
            }
        }
        if(processStatus == '3' && profiles.members.length > 0) {
            localStorage.removeItem('processStatus');
            var alertDiv = document.createElement("div");
            alertDiv.style.padding = "20px";
            alertDiv.style.backgroundColor = "#4CAF50";
            alertDiv.style.color = "white";
            alertDiv.innerHTML = "Your Change Set is ready...";

            var bDescription = document.querySelector('.bDescription')
            bDescription.innerHTML = '';
            bDescription.appendChild(alertDiv);
        }
    }

    if(window.location.href.indexOf('p/mfpkg/AddToPackageFromChangeMgmtUi') >= 0) {

        var processStatus = localStorage.getItem('processStatus');
        if(processStatus == '2') {
            var rowsperpage = getUrlEncodedKey('rowsperpage');
            var entityType = getUrlEncodedKey('entityType');
            var lsr = getUrlEncodedKey('lsr');
            var page = sessionStorage.getItem('page');
            var currentProcess = sessionStorage.getItem('CurrentProcess') != null ? JSON.parse(sessionStorage.getItem('CurrentProcess')) : null;
            if(typeof currentProcess != 'undefined' && currentProcess != null) {
                if (rowsperpage == '' || entityType != availableResource[currentProcess.name] || (page && page != '0' && lsr == '')) {
                    var path = setUrlEncodedKey('rowsperpage', '1000', window.location.search);
                    path = setUrlEncodedKey('entityType', availableResource[currentProcess.name], path);
                    if(page == '1' || page == 1) {
                        path = setUrlEncodedKey('lsr', 1000 * parseInt(page), path);
                    }
                    setTimeout(function () {
                        window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname + path;
                    }, 100);
                } else {
                    if (currentProcess && entityType == availableResource[currentProcess.name]) {
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
                        if(document.querySelectorAll('.bNext .withFilter div.next a').length > 0 &&
                            document.querySelectorAll('.bNext .withFilter div.next a')[0].innerHTML.indexOf('Next Page') >= 0) {
                            if(page) {
                                sessionStorage.setItem('page', parseInt(page) + 1);
                            } else {
                                sessionStorage.setItem('page', 1);
                            }
                            if (needSave) {
                                setTimeout(document.querySelector('input[name=save]').click(), 500);
                            } else {
                                setTimeout(function () {
                                    window.location.href = window.location.href;
                                }, 500);
                            }
                        } else {
                            sessionStorage.removeItem('page', 0);
                            var DoneChangeSet = JSON.parse(localStorage.getItem('DoneChangeSet'));
                            DoneChangeSet.push(currentProcess.name);

                            var changeSet = JSON.parse(localStorage.getItem('changeSet'));

                            var pendingProcess = changeSet.filter(function (item) {
                                return DoneChangeSet.indexOf(item.name) < 0 && availableResource[item.name];
                            });
                            if (pendingProcess.length > 0) {
                                currentProcess = pendingProcess[0];
                                sessionStorage.setItem('CurrentProcess', JSON.stringify(currentProcess));
                                localStorage.setItem('DoneChangeSet', JSON.stringify(DoneChangeSet));
                            } else {
                                sessionStorage.removeItem('CurrentProcess');
                                localStorage.setItem('DoneChangeSet', JSON.stringify(DoneChangeSet));
                            }
                            if (needSave) {
                                setTimeout(document.querySelector('input[name=save]').click(), 500);
                            } else {
                                setTimeout(function () {
                                    window.location.href = window.location.href;
                                }, 500);
                            }
                        }
                    }
                }
            } else {
                localStorage.removeItem('processStatus');
                setTimeout(document.querySelector('input[name=cancel]').click(),100);
            }
        }
    }

    if(window.location.href.indexOf('changemgmt/outboundChangeSetAddProfile.apexp') >= 0) {
        var processStatus = localStorage.getItem('processStatus');
        var profiles = JSON.parse(localStorage.getItem('profiles'));
        if(processStatus == '3') {
            if(profiles.members.length > 0) {
                var needSave = false;
                document.querySelectorAll('input[type=checkbox]').forEach(function (item) {
                    if (item.parentNode.parentNode.nodeName == 'TR' && item.parentNode.parentNode.querySelectorAll('td').length == 3) {
                        var result = profiles.members.filter(function (member) {
                            return member.toLowerCase() == item.parentNode.parentNode.querySelectorAll('td')[2].innerHTML.toLowerCase();
                        });
                        if (result.length > 0) {
                            item.checked = true;
                            needSave = true;
                        }
                    }
                });

                if(needSave) {
                    setTimeout(document.getElementById('outboundChangeSetProfilePage:outboundChangeSetAddProfilePageBody:outboundChangeSetAddProfilePageBody:ListProfileForm:profileBlock:form_buttons:bottom:addToChangeSet').click(),100);
                } else {
                    localStorage.removeItem('processStatus');
                    setTimeout(document.getElementById('outboundChangeSetProfilePage:outboundChangeSetAddProfilePageBody:outboundChangeSetAddProfilePageBody:ListProfileForm:profileBlock:form_buttons:bottom:cancelAddToChangeSet').click(),100);
                }
            } else {
                localStorage.removeItem('processStatus');
                setTimeout(document.getElementById('outboundChangeSetProfilePage:outboundChangeSetAddProfilePageBody:outboundChangeSetAddProfilePageBody:ListProfileForm:profileBlock:form_buttons:bottom:cancelAddToChangeSet').click(),100);
            }
        }
    }
};