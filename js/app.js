$(function () {
    //define variables and functions
    var twitchStreamers = ["dreamhackcs", "skyzhar", "freecodecamp", "faceittv", "comster404", "brunofin", "terakilobyte", "sheevergaming", "esl_sc2", "jacksofamerica", "OgamingSC2", "cretetion", "storbeck", "habathcx", "RobotCaleb", "noobs2ninjas"], status, user, logo, transmission;
    //base function with ajax request
    // input the list items to the html
    function updateHTML() {
		$("#listOfStreams").append('<li class="well' + transmission + '"><img class="img-rounded" src=' + logo + ' alt="Smiley face" height="50" width="50"><span>    ' + status + '</span></li>');
	}
    // check for the json data
    function checkData(data) {
        if (data.stream === null) {
			user = data._links.channel.substr(38);
            transmission = ' transmissionOff';
			checkForOfflineUsers();
		} else {
			if (data.stream.channel.logo !== null) {
				logo = data.stream.channel.logo;
			} else {
				logo = "../images/error-icon-25242.png";
			}
			user = data._links.channel.substr(38);
            transmission = ' transmissionOn';
			status = "<b>Channel <a href='https://twitch.tv/" + user + "' target=_blank>" + data.stream.channel.display_name +  "</a> is currently streaming " + data.stream.game + "</b>";
			updateHTML();
		}
	}
    // get data for each streamers in the array
    function searchStreamers(i) {
        $.ajax({
            url: "https://wind-bow.gomix.me/twitch-api/streams/" + twitchStreamers[i] + "?callback=?",
            dataType: "jsonp",
            success: function (data) {
                checkData(data);
            }
        });
    }
    //If users are offline, wee need another ajax request to find user info
    function checkForOfflineUsers() {
		$.ajax({
			url: "https://wind-bow.gomix.me/twitch-api/channels/" + user,
			dataType: "jsonp",
			success: function (data) {
                if (data.status === 422 || data.status === 404) {
                    if (data.message.length > 0) {
                        status = data.message;
                        logo = "../images/error-icon-25266.png";
                    } else {
                        status = "Information about '" + user + "' was not found";
                        logo = "../images/error-icon-25266.png";
                    }
                    updateHTML();
                } else {
				    status = "Channel <a href='" + data.url + "' target=_blank>" + data.display_name + "</a> is currently offline";
				    if (data.logo !== null) {
				        logo = data.logo;
				    } else {
				        logo = "../images/error-icon-25242.png";
				    }
				    updateHTML();
                }
            }
        });
	}
    // check for all streamers in the array
    function start() {
        for (var i = 0; i < twitchStreamers.length; i++) {
            searchStreamers(i); 
        }
    }
    // find single user from search input
    function searchSingleUser () {
		$("#listOfStreams").empty();
		user = $("#search").val().replace(/[^A-Z0-9_]/ig, "");
		$.ajax({
			url: "https://wind-bow.gomix.me/twitch-api/streams/" + user,
			dataType: "jsonp",
			success: function (data) {
				checkData(data);					
			}
		});
	}
    // search for user submited in the form
	$("form").on("submit", function () {
        event.preventDefault();
		searchSingleUser();
        //reset input field
        $(this).trigger("reset");
	});
    // show and hide elements
    $("#showAll").on('click', function(){
        $("#listOfStreams").find('li').removeClass('hidden');
    });
    $("#showOnline").on('click', function(){
        $('.transmissionOff').addClass('hidden');
        $('.transmissionOn').removeClass('hidden');
    });
    $("#showOffline").on('click', function(){
        $('.transmissionOn').addClass('hidden');
        $('.transmissionOff').removeClass('hidden');
    });
    // start program on page load
    window.onload = start();
});