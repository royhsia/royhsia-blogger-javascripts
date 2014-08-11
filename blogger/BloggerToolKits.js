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
      WantedToBeReplace = '\n';
      startString = '&lt;textarea rows="10" cols="60" onfocus="this.select();"&gt;';
      endString = '&lt;/textarea&gt;';
      replaceString = '&amp;#13;&amp;#10;';
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
  var stringbuffer = startString;
  for (var i = 0; i < teststring.length; i++) {
    if (i+1 == teststring.length) {
      stringbuffer = stringbuffer + teststring[i] + endString; // this is end
    } else {
      stringbuffer = stringbuffer + teststring[i] + replaceString;
    }
  }

  return stringbuffer;
}

function ForTextAreaScriptlize () {
  var temp = document.getElementById ('textAreascriptlize').value;
  temp = replaceSpecificThing (temp, '<');
  temp = replaceSpecificThing (temp, '>');
  temp = replaceSpecificThing (temp, '&');
  temp = replaceSpecificThing (temp, 'textarea_linebreak');
  
  document.getElementById('textAreascriptlizeTextarea').innerHTML = temp;
}

function ForEd2kScriptlize () {
  var temp = document.getElementById ('ed2kscriptlize').value;
  temp = replaceSpecificThing (temp, 'ed2k_linebreak_replace');

  document.getElementById('ed2kscriptlizeTextarea').innerHTML = temp;
}