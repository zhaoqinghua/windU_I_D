jQuery(function($) {
    window.FileMgr = {
        load : function(path, callback) {
            window.cefQuery({
                request : 'readFile:' + path,
                onSuccess : function(response) {
                    callback && callback(0, response);
                },
                onFailure : function(error_code, error_message) {
                    callback && callback(error_code, error_message);
                }
            });
        },
        save : function(f, content, callback, path) {
            window.cefQuery({
                request : 'writeFile:' + f + '^^^^' + content,
                onSuccess : function(response) {
                    callback && callback(0, response);
                },
                onFailure : function(error_code, error_message) {
                    callback && callback(error_code, error_message);
                }
            });
        },
        exists : function(f, callback) {
            window.cefQuery({
                request : 'isFileExist:' + f,
                onSuccess : function(response) {
                    callback && callback(0, response);
                },
                onFailure : function(error_code, error_message) {
                    callback && callback(error_code, error_message);
                }
            });
        },
        rename : function(f, f1, callback) {
            window.cefQuery({
                request : 'renameFile:' + f + '^^^^' + f1,
                onSuccess : function(response) {
                    callback && callback(0, response);
                },
                onFailure : function(error_code, error_message) {
                    callback && callback(error_code, error_message);
                }
            });
        },
        list : function(path, callback) {
            window.cefQuery({
                request : 'getFileList:' + path,
                onSuccess : function(response) {
                    callback && callback(0, response);
                },
                onFailure : function(error_code, error_message) {
                    callback && callback(error_code, error_message);
                }
            });
        }
    }
})
var PathModule = {
    basename : function(p, ext) {
        var arr = p.split("\\")
        filename = (arr.length && arr[arr.length - 1]) || "";
        if (filename.indexOf(".") != -1) {
            var arr = filename.split(".");
            return (arr.length && arr[arr.length - 2]) || ""
        }
        return filename;
    },
    dirname : function(p) {
        var arr = p.split("\\");
        arr.pop();
        return arr.join("\\");
    },
    filename : function(p) {
        var arr = p.split("\\")
        return (arr.length && arr[arr.length - 1]) || "";
    },
    extname : function(p) {
        var arr = p.split("\\")
        filename = (arr.length && arr[arr.length - 1]) || "";
        if (filename.indexOf(".") != -1) {
            var arr = filename.split(".");
            return (arr.length && arr[arr.length - 1]) || ""
        }
        return "";

    },
    relative : function(target, base) {
        var relative = target.replace(base, "");
        var level = relative.split("\\");
        relative = "";
        var i = 0;
        for ( i = 0; i < level.length - 2; i++) {
            relative += "../";
        }
        return relative;
    }
};
