Meteor.methods({
    updateCoordinates: function (id, x, y) {
        return Players.update(id, {$set: {x: x, y: y}});
    },
    resetPlayers: function (canvasWidth, canvasHeight, playerWidth, playerHeight) {
        let success = 1;

        if (Players.update({}, {$set: {score: 0}}) == 0) {
            success = 0
        }
        if (Players.update(1, {$set: {x: 0, y: 0}}) == 0) {
            success = 0
        } //topleft
        if (Players.update(2, {$set: {x: canvasWidth - playerWidth, y: 0}}) == 0) {
            success = 0
        } //topright
        if (Players.update(3, {$set: {x: 0, y: canvasHeight - playerHeight}}) == 0) {
            success = 0
        } //bottomleft
        if (Players.update(4, {$set: {x: canvasWidth - playerWidth, y: canvasHeight - playerHeight}}) == 0) {
            success = 0
        } //bottomright

        return success;
    },
    join: function () {
        var freePlayers = Players.find({active: false}, {sort: {number: 1}}).fetch(),
            playerExists = Players.findOne({active: true, userId: Meteor.userId()}),
            game = Game.findOne({}),
            player = null;

        if (freePlayers.length > 0 && !playerExists && !game.started && Meteor.userId()) //Player & game available?
        {
            player = freePlayers[0];
            player.name = Meteor.user().emails[0].address;
            player.userId = this.userId;
            player.active = true;
            var playerCount = game.playerCount + 1;

            Players.update(player._id, {$set: {name: player.name, active: player.active, userId: player.userId}});
            Game.update({},{$set: {playerCount: playerCount}});
        }
        else {
            player = playerExists;
        }
        return player;
    },
    updateColor: function (index, color)
    {
        Blocks.update({index : index},{$set: {color: color}});
    },
    updateScore: function() {
        console.log("updateScore");
        var activePlayers = Players.find({active: true}).fetch();
        for (var i = 0; i < activePlayers.length; i++) {
            var score = Blocks.find({color: activePlayers[i].color}).count();
            console.log(activePlayers[i].name +  " " + score);
            Players.update(activePlayers[i]._id, {$set: {score: score}});
        }
    },
    startGame: function () {
        if (Players.find({active: true}).fetch().length == 0) {
            return false;
        }
        //Meteor.call("createBlocks",4800);
        var result = Game.update({}, {$set: {time: 60, started: true}});
				Blocks.update({},{$set: {color: null}}, {multi: true});
        Meteor.call("startTimer");
        Meteor.call("checkColorChanges");
        Meteor.call("checkScoreChanges");

        return result;
    },
    startTimer: function () {
        //Countdown
        var game = Game.findOne({}),
            timer = Meteor.setInterval(function () {
            var time = game.time--;
            if(time == 0) {
                Meteor.call("stopGame");
                clearInterval(timer);
            } else {
                Game.update({}, {$set: {time: time}});
            }
        }, 1000);
    },
    checkScoreChanges: function (id, score) {
        checkScoreChangesTimer = Meteor.setInterval(function () {
            var game = Game.findOne({});
            if(game.started) {
                console.log("checkScoreChanges");
                Meteor.call("updateScore");
            }
            else
            {
                clearInterval(checkScoreChangesTimer);
            }
        }, 3000);
    },
    checkColorChanges: function () {
        var previousChanges = [];
        //Countdown
        var changesTimer = Meteor.setInterval(function () {
            var game = Game.findOne({});
            if(game.started) {
                var allBlocks = Blocks.find({color: {$ne: null}}).fetch();
                previousChanges = allBlocks.diff(previousChanges);
								console.log(previousChanges.length);

                ChangedBlocks.remove({});
                for (var i = 0; i < previousChanges.length; i++) {
                    ChangedBlocks.insert(previousChanges[i]);
                }
            }
            else
            {
                clearInterval(changesTimer);
            }
        }, 500);
    },
    stopGame: function() {
        console.log("stopGame");
        Meteor.call("updateScore");
        var result = Game.update({}, {$set: {started : false}});
    },
    clearGame: function() {
        console.log("reset");
        var game = Game.findOne({}),
            result = 1;

        if(!game.started) {
            var playersArray = [
                {
                    number: 1,
                    name: "Player 1",
                    score: 0,
                    x: 0,
                    y: 0,
                    active: false,
                    userId: null,
                    color: "red"
                },
                {
                    number: 2,
                    name: "Player 2",
                    score: 0,
                    x: 0,
                    y: 0,
                    active: false,
                    userId: null,
                    color: "blue"
                },
                {
                    number: 3,
                    name: "Player 3",
                    score: 0,
                    x: 0,
                    y: 0,
                    active: false,
                    userId: null,
                    color: "green"
                },
                {
                    number: 4,
                    name: "Player 4",
                    score: 0,
                    x: 0,
                    y: 0,
                    active: false,
                    userId: null,
                    color: "yellow"
                }
            ];
            console.log("players");
            if(Game.update({}, {$set: {time : 60, playerCount : 0}}) == 0){result = 0} //Reset game
            console.log("blocks");
            if(Blocks.update({},{$set: {color: null}}, {multi: true})){result =0} //Reset blocks
            Players.remove({});
            _.each(playersArray, function (object) {
                Players.insert(object); //Reset players
            });
            console.log("result " + result);
        }

        return result;
    },
    createBlocks: function(amount)
    {
        if (Blocks.find().count() === 0) {
            var index = 0;

            for(var i = 0; i < amount; i++)
            {
                Blocks.insert({index: index, color: null});
                index++;
            }
        }
    }
});
