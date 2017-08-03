// 
//  ed2kscriptByXBJ.js
//  Downloads
//  
//  Created by Roranicus on 2013-08-26. v1.0
//   Modify by Roranicus on 2014-07-27. v1.1 fix file name with %
//   Modify by Roranicus on 2014-07-30. v1.2 fix autocomplete
//   Modify by Roranicus on 2014-08-03. v1.3 remove time delay workaround, add Math.random();
//  Copyright 2013 Roranicus. All rights reserved.
// 
/*
  TODO Bug list: 1. ed2k link error function will not work
                 2. (fix) checkbox won't auto-re-check after uncheck and reload the page
*/

function XPCed2k_CalculateSize (size) {
  //
  // you can use either "navigator.platform" or "navigator.userAgent", this is for 
  // Mac calculate data size using 1000 bytes as 1KB and windows use 1024 bytes as 1KB.
  var BaseSize = (navigator.userAgent.toLowerCase()).match('mac') ? 1000: 1024;
  var NumberAfterPoint = 10;

  if (size >= BaseSize * BaseSize * BaseSize * BaseSize) {
    size = Math.round(size * 100 / BaseSize / BaseSize / BaseSize / BaseSize) / 100;
    unit = ' TB';
  } else if (size >= BaseSize * BaseSize * BaseSize) {
    size = Math.round(size * 100 / BaseSize / BaseSize / BaseSize) / 100;
    unit = ' GB';
  } else if (size >= BaseSize * BaseSize) {
    size = Math.round(size * NumberAfterPoint / BaseSize / BaseSize) / NumberAfterPoint;
    unit = ' MB';
  } else if (size >= BaseSize) {
    size = Math.round(size * NumberAfterPoint / BaseSize) / NumberAfterPoint;
    unit = ' KB';
  } else {
    unit = ' Bytes';
  }

  return size + unit;
}

function XPCed2k_UpdateTotalSize (ed2kScriptName) {
  var ed2k_list = document.getElementsByName(ed2kScriptName);
  var IsCheckboxAllChecked = document.getElementById("SelectAll"+ed2kScriptName);
  var temp, TotalSize = 0;

  IsCheckboxAllChecked.checked = true ;
  for (var i = 0; i < ed2k_list.length; i++) {
    if (ed2k_list[i].checked) {
      temp = ed2k_list[i].value.split( "|" );
      TotalSize += temp[3]*1;
    } else {
      IsCheckboxAllChecked.checked = false;
    }
  }

  document.getElementById("SizeOf" + ed2kScriptName).innerHTML = XPCed2k_CalculateSize(TotalSize);;
}

function XPCed2k_DoSelectAll (ed2kScriptName, checked) {
  var ed2k_list = document.getElementsByName(ed2kScriptName);

  for (var i = 0; i < ed2k_list.length; i++) {
    ed2k_list[i].checked = checked;
  }
  XPCed2k_UpdateTotalSize(ed2kScriptName);
}  

function XPCed2k_DownloadSelectItems(ed2kScriptName, CurrentIndex, IsFirst) {
  var ed2k_list = document.getElementsByName(ed2kScriptName);
  var timeout;

  for (var i = CurrentIndex; i < ed2k_list.length; i++) {
    if(ed2k_list[i].checked) {
      window.location = ed2k_list[i].value;
      timeout = IsFirst ? 6000 : 500;
      i++;
      window.setTimeout("XPCed2k_DownloadSelectItems('" + ed2kScriptName + "'," + i + ",0);", timeout);
      break;
    }
  }
}

//
// This function isn't missing arguments/parameters, I use "arguments" to get arguments.
// NOTE: if ed2k_link has symbol like ' (single quotation mark) or " (quotation mark), it will make big mistake...... 
//       <s>arguments doesn't support ed2k name start with '[' or ']'. I feel so Orz</s>
function XPCed2kMain () {  
  //
  // declear a unique id name from current time for every ed2k link groups
  var Time = new Date();
  var random = Math.random();
  var Total_ed2k_Size = 0;
  var ed2kScriptName = 'ed2kScript' + Time.getSeconds().toString() + Time.getMilliseconds().toString() + random;

  document.write('<table class="ed2kXPCtableStyle">');
  for (var i = 0; i < arguments.length; i++) {
    //
    // split arguments (emule_link)
    // temp [0] contains ed2k declare "ed2k://"
    // temp [1] contains ed2k declare "file" 
    // temp [2] contains "file name"
    // temp [3] contains "file size"
    // temp [4] contains "file hash value", others ignore.
    var temp = arguments[i].split('|');

    //
    // basic ed2k_link error check
    if ((temp[0] != 'ed2k://') || (temp[1] != 'file') || (temp[4].length != 32)) {
      //
      // checksum error
      document.write('<tr><td></td><td class="XPCed2kFileNameArea">ed2k link error</td><td class="XPCed2kFileSize"></td></tr>');
      break;
    } 

    /*
        //
        // backup: easy method for file name replace
        if (temp [2].replace(/%[0-9a-fA-F]{2}/g,"").match(/%/g)){
          var fileType = temp [2].replace(/%[0-9a-fA-F]{2}/g,"").split(".");
          temp[2] = 'FileNameError_' + temp [4] + '.' + fileType[fileType.length - 1]; // use hash for unique id
        }
    */

    var checkForPercentage = temp[2].match ('%'); // check for if % exist, if exist will do 'File name check #1'
    var splitDecodablePercentage = temp[2].split(/%[0-9a-fA-F]{2}/g);    // check for decodable (decodeURIComponent), save splited strings

    //
    // File name check #1: check for alone %, decodable URI component and remove it
    if (splitDecodablePercentage != temp[2]) { // if these two are the same means temp[2] doesn't have %xx
      var stringToGlue = "";
      var matchDecodablePercentage = temp [2].match(/%[0-9a-fA-F]{2}/g); // check for decodable (decodeURIComponent), save decodable strings
      for (var glueIndex = 0; glueIndex < splitDecodablePercentage.length; glueIndex++ ) {
        splitDecodablePercentage[glueIndex] = splitDecodablePercentage[glueIndex].replace('%',''); // remove single % in splitDecodablePercentage[i]

        //
        // glue strings back together
        if (glueIndex < matchDecodablePercentage.length) {
          stringToGlue = stringToGlue + splitDecodablePercentage[glueIndex] + matchDecodablePercentage[glueIndex];
        } else {
          stringToGlue = stringToGlue + splitDecodablePercentage[glueIndex]; // for the last string
        }
      }
      temp [2] = stringToGlue;
    } else if (checkForPercentage) { // File name check #1, else part: means temp[2] have single/seperate % exist
      var removeSinglePercentage = temp[2].split(/%/g);
      var stringToGlue = "";
      for (var glueIndex = 0; glueIndex < removeSinglePercentage.length; glueIndex++ ) {
        stringToGlue = stringToGlue + removeSinglePercentage[glueIndex];
      }
      temp [2] = stringToGlue;
    }

    document.write('<tr>');
    //
    // print checkbox and HTML code
    document.write('<td><input type="checkbox" checked="checked" name="' + ed2kScriptName + '" value="' + arguments[i] + '" onclick="XPCed2k_UpdateTotalSize(\'' + ed2kScriptName + '\');" autocomplete="off" /></td><td class="XPCed2kFileNameArea"><a href="' + arguments[i] + '">' + unescape(decodeURIComponent(temp[2])) + '</a></td>');
    //
    // print ed2k file size
    Total_ed2k_Size += parseInt(temp[3]);
    document.write('<td class="XPCed2kFileSize">' + XPCed2k_CalculateSize(temp[3]) + '</td>');
    document.write('</tr>');
  }

  document.write('<tr><td><input type="checkbox" checked="checked" id="SelectAll' + ed2kScriptName + '" onClick="XPCed2k_DoSelectAll(\'' + ed2kScriptName + '\',this.checked)" autocomplete="off" /></td><td class="XPCed2kFileNameArea"><label for="SelectAll' + ed2kScriptName +'">select all</label>&nbsp;&nbsp;&nbsp;&nbsp;<input value="Download selected item(s)" onclick="XPCed2k_DownloadSelectItems(\'' + ed2kScriptName + '\',0,1)" type="button"></td><td class="XPCed2kFileSize" style="color:red; font-weight:bold;" id="SizeOf' + ed2kScriptName +'">' + XPCed2k_CalculateSize(Total_ed2k_Size) +'</td></tr>');
  document.write('</table>');

  //
  // CSS code section
  // I don't know why '.XPCed2kFileNameArea' and '.XPCed2kFileSize' has to be right after '#ed2kXPCtableStyle', otherwise it won't work.
  document.write('<style type="text/css">.ed2kXPCtableStyle { width:99%; margin:auto; font-size:15px; line-height:initial; max-width:600px; min-width:400px;} .ed2kXPCtableStyle td {background-color: rgb(243, 247, 253);} .XPCed2kFileNameArea {word-break:break-all; padding:0.2em;} .XPCed2kFileSize {width: 5em; padding-right: 7px; text-align:right; font-family:Courier;}</style>');
}
