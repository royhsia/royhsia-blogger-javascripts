function doInstall(){
var installObj = {}
var boxObjs = document.getElementById("installList").getElementsByTagName("input");
for (i=0; i<boxObjs.length; i++) {
if (boxObjs[i].checked) installObj[boxObjs[i].name]=boxObjs[i].value;
}
InstallTrigger.install(installObj);
}

function selectall(ul_id){
var boxObjs = document.getElementById(ul_id).getElementsByTagName("input");
for (i=0; i<boxObjs.length; i++) boxObjs[i].checked=true;
}