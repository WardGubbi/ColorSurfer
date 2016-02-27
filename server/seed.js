Meteor.startup(function () {
    Array.prototype.diff = function(a) {
        return this.filter(function(i) {return a.indexOf(i) < 0;});
    };
    
    ServiceConfiguration.configurations.upsert(
        { service: "google" },
        {
            $set: {
                clientId: "663381971664-0c9g2900q17m6drt3qfesung5olanpl7.apps.googleusercontent.com",
                loginStyle: "popup",
                secret: "gLC7XZKklVdaGUqEhkG9FBAe"
            }
        }
    );
    ServiceConfiguration.configurations.upsert(
        { service: "twitter" },
        {
            $set: {
                clientId: "5heXtNTx7mgvbfSmY3I2z65rq",
                loginStyle: "popup",
                secret: "i3TNqxe8AEqqeMmfcHgGknriybAybxOeCObHYTrA4OnQYF3yz6"
            }
        }
    );

    ServiceConfiguration.configurations.upsert(
        { service: "facebook" },
        {
            $set: {
                clientId: "151667465220187",
                loginStyle: "popup",
                secret: "dd9dd0f7a704f898e7069eae2ac20aa6"
            }
        }
    );

    if (Players.find().count() === 0) {
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

        _.each(playersArray, function (object) {
            Players.insert(object);
        });
    }

    if (Game.find().count() === 0) {
        var game = {
            time: 60,
            started: false,
            playerCount: 0
        };

        Game.insert(game);
    }

    if (Blocks.find().count() === 0) {
        var index = 0;

        for(var i = 0; i < 1200; i++)
        {
            Blocks.insert({index: index, color: null});
            index++;
        }
    }
});