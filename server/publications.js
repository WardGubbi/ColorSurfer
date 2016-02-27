Meteor.publish('game', function(){
    return Game.find();
});

Meteor.publish('players', function(){
    return Players.find();
});

Meteor.publish('freePlayers', function(){
	return Players.find({active: true});
});

Meteor.publish('users', function(){
	return Meteor.users.find();
});

Meteor.publish('changedBlocks', function(){
	return ChangedBlocks.find();
});
