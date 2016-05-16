var tplBaseUrl = "";

var constant = {

}

var tools = {

}

function loadTemplate(tpl) {
    var template = null;
    $.ajax({
        url : tplBaseUrl + tpl,
        type : 'GET',
        data : {}, //默认从参数获取
        timeout : 10000,
        async : false,
        success : function(data) {
            template = _.template(data);
        },
        error : function(e) {
        }
    });
    return template;
}

function loadSequence(urls, callback) {
    var loader = null;
    for (var i in urls) {
        var url = urls[i];
        loader = $LAB.script(url);
    }
    loader ? loader.wait(callback) : callback();
}

var getUUID = function(len) {
    len = len || 6;
    len = parseInt(len, 10);
    len = isNaN(len) ? 6 : len;
    var seed = '0123456789abcdefghijklmnopqrstubwxyzABCEDFGHIJKLMNOPQRSTUVWXYZ';
    var seedLen = seed.length - 1;
    var uuid = '';
    while (len--) {
        uuid += seed[Math.round(Math.random() * seedLen)]
    }
    return uuid;
}

jQuery(function($) {
    $.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return unescape(r[2]);
        return null;
    }
});

