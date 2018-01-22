String.prototype.trimEnd = function(c) {
    if (c)
        return this.replace(new RegExp(c.escapeRegExp() + "*$"), '');
    return this.replace(/\s+$/, '');
};
String.prototype.trimStart = function(c) {
    if (c)
        return this.replace(new RegExp("^" + c.escapeRegExp() + "*"), '');
    return this.replace(/^\s+/, '');
};

String.prototype.escapeRegExp = function() {
    return this.replace(/[.*+?^${}()|[\]\/\\]/g, "\\$0");
};

convertSFDC15To18 = function(sfdcID15){
    if (sfdcID15.length == 15) {
        var s = "";
        for (var i = 0; i < 3; i++) {
            var f = 0;
            for (var j = 0; j < 5; j++) {
                var c = sfdcID15.charAt(i * 5 + j);
                if (c >= "A" && c <= "Z")
                    f += 1 << j;
            }
            s += "ABCDEFGHIJKLMNOPQRSTUVWXYZ012345".charAt(f);
        }
        return sfdcID15 + s;
    } else {
        throw "Error : " + sfdcID15 + " has not a length of 15 characters. Current length detected: " + sfdcID15.length + " characters.";
    }
};

subStrAfterChars = function(str, char, pos) {
    if(pos=='b')
        return str.substring(str.indexOf(char) + 1);
    else if(pos=='a')
        return str.substring(0, str.indexOf(char));
    else
        return str;
};

getUrlEncodedKey = function(key, query) {
    if (!query)
        query = window.location.search;
    var re = new RegExp("[?|&]" + key + "=(.*?)&");
    var matches = re.exec(query + "&");
    if (!matches || matches.length < 2)
        return "";
    return decodeURIComponent(matches[1].replace("+", " "));
};
setUrlEncodedKey = function(key, value, query) {

    query = query || window.location.search;
    var q = query + "&";
    var re = new RegExp("[?|&]" + key + "=.*?&");
    if (!re.test(q))
        q += key + "=" + encodeURIComponent(value);
    else
        q = q.replace(re, "&" + key + "=" + encodeURIComponent(value) + "&");
    q = q.trimStart("&").trimEnd("&");
    return (q[0]=="?" ? q : q = "?" + q);
};