
var index;

var success = function(data) {
	var html = data.fields[3].editHtml;
	var dom = $.parseHTML(html);
	var text = dom
	var des = $('textarea[name=description]', dom).html();
	var check = ( /{panel:title=.*}[\s\S]([\s\S]*)[\s\S]{panel}/i.exec(des) )[1];
	var list = check.replace('\r','').split('\n');



	if (/\(\/\)/.test(list[index])) {
		list[index] = list[index].replace(/\(\/\)/,"(x)");
		$(".panel img.emoticon").eq(index).attr("src", "/images/icons/emoticons/error.png");
		//$(element)
	}
	else if (/\(x\)/.test(list[index])) {
		list[index] = list[index].replace(/\(x\)/,"(/)");
		console.log($(".panel img.emoticon").eq(index).attr("src"));
		$(".panel img.emoticon").eq(index).attr("src", "/images/icons/emoticons/check.png");
		console.log($(".panel img.emoticon").eq(index).attr("src"));
	}

	var list2 = list.join("\r\n");

	var des2 = des.replace(/({panel:title=.*}[\s\S])([\s\S]*)([\s\S]{panel})/i, "$1" + list2 + "$3");

	var token = $("input[name=atl_token]").val();

	$.ajax({
	  url: "https://sheknows.jira.com/secure/AjaxIssueAction.jspa?decorator=none",
	  data: {description:des2,issueId:31078,atl_token:token,singleFieldEdit:true,fieldsToForcePresent:'description'},
	  type: 'POST',
	  //success: success,
	  dataType: 'json'
	});

	console.log(list);
	console.log(des2);
}

$("#description-val .panel").remove().clone().insertAfter("#description-val");


$(".panel img.emoticon").click(function(e) {
	index = $(".panel img.emoticon").index(this);
	console.log(index);

	$.ajax({
	  url: "https://sheknows.jira.com/secure/AjaxIssueEditAction!default.jspa",
	  data: {decorator:'none',issueId:31078},
	  type: 'GET',
	  success: success,
	  dataType: 'json'
	});
});
