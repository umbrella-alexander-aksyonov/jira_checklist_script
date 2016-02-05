(function() {
	var issueId = $("input[name=id]").val();
	var token = $("input[name=atl_token]").val();

	$("#description-val .panel").remove().clone().insertAfter("#description-val");

	$(".panel img.emoticon").hover(function(e) {
		$(this).attr('height', 18);
		$(this).attr('width', 18);
		$(this).css('cursor', 'pointer');
	}, function() {
		$(this).attr('height', 16);
		$(this).attr('width', 16);
		$(this).css('cursor', 'default');
	});

	$(".panel img.emoticon").click(function(e) {
		index = $(".panel img.emoticon").index(this);

		var des = getDescription();
		var list = parseDes(des);

		if (/\(\/\)/.test(list[index])) {
			list[index] = list[index].replace(/\(\/\)/,"(x)");
			$(".panel img.emoticon").eq(index).attr("src", "/images/icons/emoticons/error.png");
		}
		else if (/\(x\)/.test(list[index])) {
			list[index] = list[index].replace(/\(x\)/,"(/)");
			$(".panel img.emoticon").eq(index).attr("src", "/images/icons/emoticons/check.png");
		}

		var newDes = genDes(des, list);
		setDescription(newDes);
	});


	var parseDes = function(des) {
		var check = ( /{panel:title=.*}[\s\S]([\s\S]*)[\s\S]{panel}/i.exec(des) )[1];
		var list = check.replace('\r','').split('\n');

		return list;
	}

	var genDes = function(des, list) {
		var list2 = list.join("\r\n");
		var des2 = des.replace(/({panel:title=.*}[\s\S])([\s\S]*)([\s\S]{panel})/i, "$1" + list2 + "$3");

		return des2;
	}

	var getDescription = function() {
		var description;

		$.ajax({
			url: "https://sheknows.jira.com/secure/AjaxIssueEditAction!default.jspa",
		  	data: {decorator:'none',issueId:issueId},
		  	type: 'GET',
		  	async: false,
		  	success: function(data) {
		  		var html = data.fields[3].editHtml;
				var dom = $.parseHTML(html);
				var text = dom
				description = $('textarea[name=description]', dom).html();
		  	},
		  	dataType: 'json'
		});

		return description;
	}

	var setDescription = function(des) {
		$.ajax({
		  	url: "https://sheknows.jira.com/secure/AjaxIssueAction.jspa?decorator=none",
		  	data: {description:des,issueId:issueId,atl_token:token,singleFieldEdit:true,fieldsToForcePresent:'description'},
		  	type: 'POST',
		  	dataType: 'json'
		});
	}
})();