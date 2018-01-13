const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true, typeInterval: 100 })

nightmare
    .goto('https://test.salesforce.com/login.jsp?pw=appirio#123&un=sandeep.kumar+ptp-opdev@appirio.com')
    .wait('#zero_click_wrapper .c-info__title a')
    .click('a#globalHeaderNameMink > span:nth-child(2)')
    .click('div#globalHeaderBar > div.globalHeaderNameMenuContainer:nth-child(2) > div.globalHeaderVerticalLineInner:nth-child(1) > div.globalHeaderVerticalLineOuter:nth-child(1) > div.zen-select:nth-child(1) > ul.zen-options:nth-child(2) > li.zen-firstItem:nth-child(1) > a:nth-child(1)')
    .click('a#Deploy_icon > img.setupImage:nth-child(1)')
    .click('a#OutboundChangeSet_font')
    .click('input#ChangeMgmtSplashPage:splashInputForm:continueBtn')
    .click('input#ListOutboundChangeSetPage:listOutboundChangeSetPageBody:listOutboundChangeSetPageBody:ListOutboundChangeSetForm:ListOutboundChangeSetPageBlock:form_buttons:newChangeSet')
    .click('input#CreateOutboundChangeSetPage:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetForm:CreateOutboundChangePageBlock:changesetTableSection:nameSection:changeSetName')
    .click('textarea#CreateOutboundChangeSetPage:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetForm:CreateOutboundChangePageBlock:changesetTableSection:descriptionSection:changeSetDescription')
    .click('div#CreateOutboundChangeSetPage:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetForm:CreateOutboundChangePageBlock:changesetTableSection:nameSection:j_id5')
    .click('input#CreateOutboundChangeSetPage:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetPageBody:CreateOutboundChangeSetForm:CreateOutboundChangePageBlock:form_buttons:saveChangeSet')
    .click('input#outboundChangeSetDetailPage:outboundChangeSetDetailPageBody:outboundChangeSetDetailPageBody:detail_form:outboundCs_componentsBlock:component_list_form_buttons:outboundCs_add')
    .click('select#entityType')
    .click('input#ids5')
    .click('input#ids6')
    .click('td#topButtonRow > input.btn:nth-child(1)')
    .end()
    .then(function (result) {
        console.log(result)
    })
    .catch(function (error) {
        console.error('Error:', error);
    });