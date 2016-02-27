Meteor.subscribe('freePlayers');

AccountsEntry.config({
	dashboardRoute: '/overview',
	waitEmailVerification: false   // will not allow users to login until their email is verified.
});

/*AccountsEntry.config({
	passwordSignupFields: 'USERNAME_ONLY'
});*/



Template.layout.events({
	'click .box1': function () {
		Router.go('/overview');
	}
});