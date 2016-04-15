appcan.ready(function(){
    window.FileMgr = {
        load:function(callback){
            appcan.file.read("D:/Server/html/Out/layout.m",-1,function(err,data,dataType,optId){
                callback && callback(err,data);
            })
        },
        save:function(content,callback,path){
            appcan.file.write(path || "D:/Server/html/Out/layout.m",content,function(err,data,dataType,optId){
                callback && callback(err,data);
            })
        }
    }
})
