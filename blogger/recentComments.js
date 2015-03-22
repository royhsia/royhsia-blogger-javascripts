//modified from http://chagg.blogspot.com/2007/07/blogger-pixnet.html 2009/8/9
document.write("<div id='rec_comment'><p align='center'><img src='http://raywei1122.googlepages.com/loading.gif'/></p><p align='center'>Loading....</p></div>");

function recentComment(json) {

    var temp = '';
    var comment=json.feed.entry;
	if(comment.length<maxComment) {maxComment=comment.length;}
    for (var i=0; i < maxComment; i++) {
        var title=comment[i].content.$t.replace(/<.*?>/g,'').substr(0,20);
        var link=comment[i].link[2].href;
        var authorname=comment[i].author[0].name.$t;
		if(comment[i].author[0].uri != undefined) authorname='<a href="'+comment[i].author[0].uri.$t+'">'+comment[i].author[0].name.$t+'</a>';
        var timestamp=comment[i].published.$t.substr(0,10);
		
        temp += authorname+' 回應 <a href="'+link+'">'+ title +'</a><br/>';
      }
document.getElementById("rec_comment").innerHTML = temp;
}

var feedurl="/feeds/comments/default?alt=json-in-script&orderby=published&callback=recentComment&max-results=" + maxComment;
var script = document.createElement('script');
script.setAttribute('src', feedurl);
script.setAttribute('type', 'text/javascript');
document.documentElement.firstChild.appendChild(script);