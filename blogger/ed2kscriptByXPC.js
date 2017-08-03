/*
 
  ed2kscriptByXBJ.js
  Downloads
  
  Created by Roranicus on 2013-08-26. v1.0
   Modify by Roranicus on 2014-07-27. v1.1 fix file name with %
   Modify by Roranicus on 2014-07-30. v1.2 fix autocomplete
   Modify by Roranicus on 2014-08-03. v1.3 remove time delay workaround, add Math.random();
   Modify by Roranicus on 2017-08-03. v2.0 use `` (&grave;) to accomplish use plain text as input method

  TODO Bug list: 1. ed2k link error function will not work
                 2. (fix) checkbox won't auto-re-check after uncheck and reload the page
*/

function CalculateSize_ed2kXPC (size) {
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

function UpdateTotalSize_ed2kXPC (ed2kScriptName) {
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

  document.getElementById("SizeOf" + ed2kScriptName).innerHTML = CalculateSize_ed2kXPC(TotalSize);;
}

function DoSelectAll_ed2kXPC (ed2kScriptName, checked) {
  var ed2k_list = document.getElementsByName(ed2kScriptName);

  for (var i = 0; i < ed2k_list.length; i++) {
    ed2k_list[i].checked = checked;
  }
  UpdateTotalSize_ed2kXPC(ed2kScriptName);
}  

function DownloadSelectItems_ed2kXPC (ed2kScriptName, CurrentIndex, IsFirst) {
  var ed2k_list = document.getElementsByName(ed2kScriptName);
  var timeout;

  for (var i = CurrentIndex; i < ed2k_list.length; i++) {
    if(ed2k_list[i].checked) {
      window.location = ed2k_list[i].value;
      timeout = IsFirst ? 6000 : 500;
      i++;
      window.setTimeout("DownloadSelectItems_ed2kXPC('" + ed2kScriptName + "'," + i + ",0);", timeout);
      break;
    }
  }
}

function UniqueName_ed2kXPC () {
  //
  // declear a unique id name from current time for every ed2k link groups
  var Time = new Date();
  var random = Math.random();

  return 'ed2kScript' + Time.getSeconds().toString() + Time.getMilliseconds().toString() + random;
}

function FileNameCheck_ed2kXPC (fileName) {
  var temp = fileName;
  var checkForPercentage = fileName.match ('%'); // check for if % exist, if exist will do 'File name check #1'
  var splitDecodablePercentage = fileName.split(/%[0-9a-fA-F]{2}/g);    // check for decodable (decodeURIComponent), save splited strings

  //
  // File name check #1: check for alone %, decodable URI component and remove it
  if (splitDecodablePercentage != fileName) { // if these two are the same means temp[2] doesn't have %xx
    var stringToGlue = "";
    var matchDecodablePercentage = fileName.match(/%[0-9a-fA-F]{2}/g); // check for decodable (decodeURIComponent), save decodable strings
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
    temp = stringToGlue;
  } else if (checkForPercentage) { // File name check #1, else part: means temp[2] have single/seperate % exist
    var removeSinglePercentage = temp[2].split(/%/g);
    var stringToGlue = "";
    for (var glueIndex = 0; glueIndex < removeSinglePercentage.length; glueIndex++ ) {
      stringToGlue = stringToGlue + removeSinglePercentage[glueIndex];
    }
    temp = stringToGlue;
  }

  return temp;
}

//
// This function isn't missing arguments/parameters, I use "arguments" to get arguments.
// NOTE: if ed2k_link has symbol like ' (single quotation mark) or " (quotation mark), it will make big mistake...... 
//       <s>arguments doesn't support ed2k name start with '[' or ']'. I feel so Orz</s>
function XPCed2kMain () {
  var arg;
  var Total_ed2k_Size = 0;
  var ed2kScriptName = UniqueName_ed2kXPC();

  //
  // determine if it's original XPCed2kMain or XPCed2kParser
  if (typeof arguments[0] === 'object') {
    arg = arguments[0]; // XPCed2kParser
  } else if (typeof arguments[0] === 'string') {
    arg = arguments;    // XPCed2kMain (original)
  } else {
    // there must be something wrong
    console.log (">>> fatal error: arguments not valid");
    return 0;
  }

  document.write('<table class="ed2kXPCtableStyle">');
  for (var i = 0; i < arg.length; i++) {
    //
    // split arguments (emule_link)
    // temp [0] contains ed2k declare "ed2k://"
    // temp [1] contains ed2k declare "file" 
    // temp [2] contains "file name"
    // temp [3] contains "file size"
    // temp [4] contains "file hash value"
    // temp [5], [6] ...  ignore.
    var temp = arg[i].split('|');

    //
    // basic ed2k_link error check
    if ((temp[0] != 'ed2k://') || (temp[1] != 'file') || (temp[4].length != 32)) {
      //
      // checksum error
      document.write('<tr><td colspan="3" class="XPCed2kFileNameArea">ed2k link error</td></tr>');
      break;
    } 

    /*
        // backup: easy method for file name replace
        if (temp [2].replace(/%[0-9a-fA-F]{2}/g,"").match(/%/g)){
          var fileType = temp [2].replace(/%[0-9a-fA-F]{2}/g,"").split(".");
          temp[2] = 'FileNameError_' + temp [4] + '.' + fileType[fileType.length - 1]; // use hash for unique id
        }
    */

    temp[2] = FileNameCheck_ed2kXPC (temp[2]);

    document.write('<tr>');
    //
    // print checkbox and HTML code
    document.write('<td><input type="checkbox" checked="checked" name="' + ed2kScriptName + '" value="' + arg[i] + '" onclick="UpdateTotalSize_ed2kXPC(\'' + ed2kScriptName + '\');" autocomplete="off" /></td><td class="XPCed2kFileNameArea"><a href="' + arg[i] + '">' + unescape(decodeURIComponent(temp[2])) + '</a></td>');
    //
    // print ed2k file size
    Total_ed2k_Size += parseInt(temp[3]);
    document.write('<td class="XPCed2kFileSize">' + CalculateSize_ed2kXPC(temp[3]) + '</td>');
    document.write('</tr>');
  }

  document.write('<tr><td><input type="checkbox" checked="checked" id="SelectAll' + ed2kScriptName + '" onClick="DoSelectAll_ed2kXPC(\'' + ed2kScriptName + '\',this.checked)" autocomplete="off" /></td><td class="XPCed2kFileNameArea"><label for="SelectAll' + ed2kScriptName +'">select all</label>&nbsp;&nbsp;&nbsp;&nbsp;<input value="Download selected item(s)" onclick="DownloadSelectItems_ed2kXPC(\'' + ed2kScriptName + '\',0,1)" type="button"></td><td class="XPCed2kFileSize" style="color:red; font-weight:bold;" id="SizeOf' + ed2kScriptName +'">' + CalculateSize_ed2kXPC(Total_ed2k_Size) +'</td></tr>');
  document.write('</table>');

  //
  // CSS code section
  // I don't know why '.XPCed2kFileNameArea' and '.XPCed2kFileSize' has to be right after '#ed2kXPCtableStyle', otherwise it won't work.
  document.write('<style type="text/css">.ed2kXPCtableStyle { width:99%; margin:auto; font-size:15px; line-height:initial; max-width:600px; min-width:400px;} .ed2kXPCtableStyle td {background-color: rgb(243, 247, 253);} .XPCed2kFileNameArea {word-break:break-all; padding:0.2em;} .XPCed2kFileSize {width: 5em; padding-right: 7px; text-align:right; font-family:Courier;}</style>');
}

//
// Version 2.0 of XPCed2kMain
// This function uses `` to parse whatever it is between two grave accents (including line-break [\r\n]).
//  Note: There can NOT have any "`" in ed2k filename.
//
//  See "Template literals" in MDN under section "Multi-line strings" for more detail
function XPCed2kParser () {
  if (arguments[0].indexOf ("<br />\n") > -1) {
    var pass = arguments[0].split("<br />\n");
  } else {
    var pass = arguments[0].split("\n");
  }
  XPCed2kMain (pass);
}

/*
  Copyright 2013-2017 Roranicus. All rights reserved.
*/
