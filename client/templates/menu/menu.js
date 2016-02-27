Template.menu.onCreated(function() {
	Meteor.subscribe('players');
	Meteor.subscribe('game');
	poll();

});

Template.menu.helpers({
    game: function() {
        /*var gameObject = Game.findOne();
        Session.set('game', gameObject);*/
        return Game.findOne();
    },
    currentPlayer: function()
    {
        return Session.get("currentPlayer");
    },
    gameFull: function()
    {
        var gameObject = Game.findOne();

        if(gameObject && gameObject.playerCount == 4)
        {
            return true;
        }

        return false;
    },
    isStarted: function() {
        var gameObject = Game.findOne();

        if(gameObject)
        {
            return gameObject.started;
        }
        return false;
    }
});

Template.menu.events({
    'click .clear': function() {
			console.log('clicking on clear');
        Meteor.call('clearGame', function(error, response) {
            if(error) {
                console.log(error.message);
            } else if(response) {
                console.log(response);
								Router.go('/overview');
            }
        });
    }
});

function poll() {
	var players = Players.find({active: true}).fetch();
	for(i = 0; i < players.length; i++) {
		if ($('#user-'+ players[i].number).length == 0) {
			// this id doesn't exist, so add it to our list.
			$("#leaderboard").append('<li><p class="playerTag" style="background-color: '+ players[i].color + '" id="user-' + players[i].number + '">' + players[i].name + ' - ' + players[i].score + '</div></li>');
		} else {
			// this id does exist, so update 'score' count in the h1 tag in the list item.
			$('#user-' + players[i].number).html(players[i].name + ' - ' + players[i].score );
		}
	}
	sort();

	t = setTimeout(poll, 1000);
}

function sort() {
	var board = $('ul#leaderboard');
	board.css({position:'relative',height:board.height()});
	var iLnH;
	var $Li = $('ul#leaderboard>li');
	$Li.each(function(i, el){
		var iY = $(el).position().top;
		$.data(el,'h',iY);
		if (i===1) iLnH = iY;
	});
	$Li.tsort('p:eq(0)',{order:'asc'}).each(function(i,el){
		var $El = $(el);
		var iFr = $.data(el,'h');
		var iTo = i*iLnH;
		$El.css({position:'absolute',top:iFr, left: '10%'}).animate({top:iTo},500);
	});
}

