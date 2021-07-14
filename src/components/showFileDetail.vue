<template>
    
</template>
<style>

</style>
<script>
import global from '@/assets/js/global.js';
export default {
    data(){
        return{

        }
    },
    methods:{
        //js下载文件流
        downFile(blob, fileName) {
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveOrOpenBlob(blob, fileName);
            } else {
                var href = window.URL.createObjectURL(blob);
                window.open(href);
                window.URL.revokeObjectURL(href);
            }
        },
        
        showFile(file){
            var type = "";
            // console.log(file);
            var isPDF = (file.name || file.fileName).indexOf("pdf");
            var isPng = (file.name || file.fileName).indexOf("png");
            var isJPG = (file.name || file.fileName).indexOf("jpg");
            var isJPEG = (file.name || file.fileName).indexOf("jpeg");
            if(isPDF!=-1){
                type = "application/pdf";
            }
            if(isPng!=-1){
                type = "image/png";
            }
            if(isJPG!=-1){
                type = "image/jpeg";
            }
            if(isJPEG!=-1){
                type = "image/jpeg";
            }
            //testPDF文件
            var vm = this;
            var url = "";
            if(file.dataPoolURL){
                if(file.dataPoolURL.indexOf("v2.0/attachment")>=0){
                    url = global.concateUrl( this.$appConst.uploadFile,file.dataPoolURL);
                }else{
                    url = this.$apiUrl.fileQuery + file.fileId;
                    window.open(url);
                    return; 
                }
            }else{
                if(file.file_id){
                    url = global.concateUrl(vm.$apiUrl.fileQuery, file.file_id);
                }else if(file.fileId){
                    url = global.concateUrl(vm.$apiUrl.fileQuery, file.fileId);
                }else if(file.id){
                    url =  global.concateUrl(vm.$apiUrl.fileQuery, file.id);
                }
            }
            console.log(url,"url");
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = "blob";
            xhr.setRequestHeader("Authorization", sessionStorage.getItem("access_token"));
            xhr.setRequestHeader("org_id", sessionStorage.getItem("orgId"));
            xhr.setRequestHeader("client_id","pGCXRYBmkbDS88Yls6CNBaD8YkHK7QPzFHFlG1m8IPIgD6T3L98ZnO82q67kj8R1")
            xhr.onreadystatechange =   function() {    
              if (xhr.readyState == 4) {//4代表执行完成
                //200代表执行成功
                  if(xhr.status == 409){
                    global.warningMesBox("没有读文件权限或文件获取不成功");
                  }
                  else{
                        var content = this.response;
                        type=!type?"application/pdf":type;
                        var blob =new Blob([content],{type:type});
                        var fileName = file.name||file.fileName;
                        vm.downFile(blob,fileName);
                  }
                  
              }
            }
            xhr.send();
        }
    },
}
</script>
