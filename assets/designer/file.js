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
        save : function(f,content, callback, path) {
            window.cefQuery({
                request : 'writeFile:' + f + '####' + content,
                onSuccess : function(response) {
                     callback && callback(err, data);
                },
                onFailure : function(error_code, error_message) {
                }
            });
        }
    }
})
