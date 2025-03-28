//
// inputFocus and inputBlur are for gray input text
function inputFocus(i){
  if (i.value == i.defaultValue) {i.value=""; i.style.color="#000";}
}
function inputBlur(i){
  if (i.value == "") {i.value=i.defaultValue; i.style.color="#888";}
}

//
// For hidden text button 
function HiddenBoxToButton () {
  var ButtonName = document.getElementById ('HiddenTextForButton').value;
  var HiddenTextForID = document.getElementById ('HiddenTextForID').value;
  var temp = "";
  temp = '&lt;input type="button" value="' + ButtonName + '" id="' + HiddenTextForID + 'Box" style="font-size:16px;" onclick=" document.getElementById(\'' + HiddenTextForID + '\').style.display=\'inline\'; document.getElementById(\'' + HiddenTextForID + 'Box\').style.display=\'none\';"&gt;&lt;span id="' + HiddenTextForID + '" style="display:none;"&gt;要隱藏的內容&lt;/span&gt;';

  document.getElementById('HiddenButtonResult').innerHTML = temp;
}

function replaceSpecificThing (MainStrings, WantedToBeReplace) {
  var startString = "";
  var endString = "";
  var replaceString = "";

  switch (WantedToBeReplace) {
    case 'textarea_linebreak':
      // pre-soaking the string
//      MainStrings = MainStrings.replace(/</g, '&lt;').replace(/>/g, '&gt;');//.replace(/&/g, '&amp;');
      WantedToBeReplace = '\n';
      startString = '<textarea rows="10" cols="60" onfocus="this.select();">';
      endString = '</textarea>';
      replaceString = '&#13;&#10;';
      break;

    case 'ed2k_linebreak_replace':
      WantedToBeReplace = '\n';
      startString = '\"';
      endString = '\"';
      replaceString = '\",\"';
      break;

    case '&':
      // startString = '<textarea rows="10" cols="60" onfocus="this.select();">';
      // endString = '&lt;/textarea&gt;';
      replaceString = '&amp;';
      break;

    case '<':
      // startString = '<textarea rows="10" cols="60" onfocus="this.select();">';
      // endString = '&lt;/textarea&gt;';
      replaceString = '&lt;';
      break;

    case '>':
      // startString = '<textarea rows="10" cols="60" onfocus="this.select();">';
      // endString = '&lt;/textarea&gt;';
      replaceString = '&gt;';
      break;

    default:
      break;
  }

  var teststring = MainStrings.split(WantedToBeReplace);
  let rsltStr = new String ();
  for (var i = 0; i < teststring.length; i++) {
	rsltStr += teststring[i];
	if ((i + 1) != teststring.length)
	{
		rsltStr += replaceString;
	}
  }
  rsltStr = startString + rsltStr + endString;
  console.log (rsltStr);

  return rsltStr;
}

//
// Auto generate shortcut links by ClassName
function AutoClassNameToShortLink (TargetClassName, AutoClassNameToShortLinkSpan) {
  var ReplacePattern = /[ ,\"\\\/#@><!?]/g;
  var innerTEXTcontent, temp;
  var ClassNameArray = document.getElementsByClassName (TargetClassName);

  if (AutoClassNameToShortLinkSpan === undefined) {
    AutoClassNameToShortLinkSpan = 'AutoClassNameToShortLinkSpan';
  }
  temp = document.getElementById (AutoClassNameToShortLinkSpan).innerHTML + '<ul class=\"AutoGenShortLink\">';

  for (var i = 0; i < ClassNameArray.length; i++) {
    //
    // Workaround for Firefox does not support innerText, IE does not support textContent
    if (ClassNameArray[i].innerText != undefined) {
      innerTEXTcontent = ClassNameArray[i].innerText;
    } else {
      innerTEXTcontent = ClassNameArray[i].textContent;
    }

    if (!ClassNameArray[i].id) {
      ClassNameArray[i].id = innerTEXTcontent.replace(ReplacePattern, "");
      ClassNameArray[i].id = innerTEXTcontent.replace(/\n/g, ""); // try to fix blogger auto line break error
    }
    temp = temp + '<li><a href=\"#' + ClassNameArray[i].id + '\">' + innerTEXTcontent + '</a></li>\n';
  }
  temp = temp + '</ul>';
  document.getElementById (AutoClassNameToShortLinkSpan).innerHTML = temp;
}

//
// Package Search: t-cat
function t_catSearch () {
  var DestinationUrl = "http://www.t-cat.com.tw/inquire/TraceDetail.aspx?BillID=" + document.getElementById ('t-catPackageInquire').value + "&ReturnUrl=Trace.aspx";
  window.open(DestinationUrl,'_blank');
}

//
// Package Search: post
function postSearch () {
  var DestinationUrl = "http://postserv.post.gov.tw/webpost/CSController?cmd=POS4001_3&_MENU_ID=189&_SYS_ID=D&_ACTIVE_ID=190&MAILNO=" + document.getElementById ('postPackageInquire').value;
  window.open(DestinationUrl,'_blank');
}

function save2file (event) {
  // prevent default, scroll to top of the page
  event.preventDefault();

  let element = event.target;
  let textarea = element.nextElementSibling.nextElementSibling;

  // get content of textarea
  let batContent = textarea.value;

  // create Blob object, make content binary
  let blob = new Blob([batContent], { type: 'text/plain' });

  // create a URL pointing to this object Blob
  let url = URL.createObjectURL(blob);

  // create a hidden DOM <a> to trigger download
  let downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = element.getAttribute("filename");  // set file name by attribute
  document.body.appendChild(downloadLink);
  downloadLink.click();

  // remove URL DOM after download
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}
