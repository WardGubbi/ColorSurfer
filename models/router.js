var OnBeforeActions = {
	loginRequired: function(){
		if(!Meteor.userId()) {
			Router.go('/sign-in');
			this.next();
		} else {
			this.next();
		}
	}
};

Router.onBeforeAction(OnBeforeActions.loginRequired, {
	only: ['game', 'overview']
});

Router.configure({
	layoutTemplate: 'layout'
});

Router.map(function() {
	this.route('game', {
		path: '/game'
	});
});

Router.route('/', {
	action: function () {
		Router.go('/sign-in');
	}
});

Router.route('/overview', {
	subscriptions: function() {
		// returning a subscription handle or an array of subscription handles
		// adds them to the wait list.
		return [
			Meteor.subscribe('game')
		];
	},
	action: function () {
		if (this.ready()) {
			if (Game.findOne({started: true})) {
				// there is a current game in progress
				Router.go('/game');
				this.next();
			} else {
				this.render();
			}
		} else {
			console.log('Loading');
		}
	}
});
