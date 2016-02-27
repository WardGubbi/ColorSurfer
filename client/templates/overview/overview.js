Template.overview.onCreated(function(){
	var instance = this;

	instance.autorun(function () {
		instance.subscribe('game');
		instance.subscribe('freePlayers');
		instance.subscribe('users');
	});
});

Template.overview.helpers({
	joinedUsers: function(){
		$('.start').prop("disabled", true);
		var players = Players.find().fetch();
		var users = Meteor.users.find();
		var joinedUsers = [];

		players.forEach(function(player){
			users.forEach(function(user) {
				if(user._id === player.userId) {
					joinedUsers.push(user);
				}
			});
		});

		if(joinedUsers.length > 1){
			$('.start').prop("disabled", false);
		} else {
			$('.start').prop("disabled", true);
		}

		return joinedUsers;
	}
});

Template.overview.events({
	'click .join': function() {
		Meteor.call('join', function(error, response) {
			if(error) {
				console.log(error.message);
			} else if(response) {
				Session.set("currentPlayer",response);
			}
		});
	},
	'click .start': function() {
		Meteor.call('startGame', function(error, response) {
			if(error) {
				console.log(error.message);
			} else if(response) {
				Router.go('/game');
			}
		});
	}
});
