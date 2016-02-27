var players;
var player;
var platforms;
var cursors;
var colors = [];
var changesBlocks = [];
Template.canvas.onCreated(function () {
    var instance = this;
    instance.autorun(function () {
        instance.subscribe('changedBlocks');
        instance.subscribe('game');
    });

	var freePlayers = Players.find({active: true}).fetch();
	var game = new Phaser.Game(800, 600, Phaser.WEBGL, 'canvas', {preload: preload, create: create, update: update});

	function preload() {
		game.stage.backgroundColor = 'rgba(255, 255, 255, 0.5)';
		game.load.image('surfer', '/images/surfer.png');
	}

	function create() {
		var playedGame = Game.findOne();

		if (!freePlayers.length){
			freePlayers = Players.find({active: true}).fetch();
		}
		game.stage.backgroundColor = 'rgba(255, 255, 255, 0.5)';
		var graphics = game.add.graphics(0, 0);
		platforms = game.add.physicsGroup();
		players = game.add.physicsGroup();

		var drawnObject;
		var width = 20; // example;
		var height = 20; // example;
		for (var i = 0; i < 800; i += width) {
			for (var j = 0; j < 600; j += height) {
				var bmd = game.add.bitmapData(width, height);

				bmd.ctx.beginPath();
				bmd.ctx.rect(0, 0, width, height);
				bmd.ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
				bmd.ctx.fill();
				drawnObject = game.add.sprite(i, j, bmd);
				platforms.add(drawnObject);
			}
		}
		platforms.setAll('body.immovable', true);

		_.each(freePlayers, function(item){
			var x,y;
			switch (item.number)
			{
				case 1:
					x=0;y=0;
					break;
				case 2:
					x=800;y=0;

					break;
				case 3:
					x=0;y=600;

					break;
				case 4:
					x=800;y=600;
					break;
			}
			tempPlayer = game.add.sprite(x, y, 'surfer');
			tempPlayer.color = item.color;
			players.add(tempPlayer);
			if (item.userId === Meteor.userId())
			{
				game.physics.arcade.enable(tempPlayer);
				player = tempPlayer
			}
		});

		game.physics.arcade.enable(player);
		player.body.collideWorldBounds = true;

		cursors = game.input.keyboard.createCursorKeys();

		setTimeout(function () {
			var a = [], b = [], prev;

			colors.sort();
			for (var i = 0; i < colors.length; i++) {
				if (colors[i] !== prev) {
					a.push(colors[i]);
					b.push(1);
				} else {
					b[b.length - 1]++;
				}
				prev = colors[i];
			}

			var highestScore = {score: 0, color: ''};

			for (var j = 0; j < b.length; j++) {
				if (j === 0) {
					highestScore.score = b[j];
					highestScore.color = a[j];
				} else if (b[j] > highestScore.score) {
					highestScore.score = b[j];
					highestScore.color = a[j];
				}
			}

			for (var k = 0; k < players.children.length; k++) {
				if (players.children[k].color === highestScore.color) {
					console.log(players.children[k].color + ' heeft gewonnen met een score van ' + highestScore.score);
				}
			}

		}, playedGame.time * 1000);

		Tracker.autorun(function () {
			var changedBlocks = ChangedBlocks.find().fetch();
			changedBlocks.forEach(function (block) {
				var platform = platforms.children[block.index];
				platform.key.ctx.fillStyle = block.color;
				platform.key.ctx.fill();
				platform.key.dirty = true;
			});
		});
	}

	function update() {
		game.physics.arcade.overlap(players, platforms, function (player, platform) {
			var platformId = platforms.children.indexOf(platform);
			platform.captured = true;
			if (platform.key.ctx.fillStyle !== player.color) {
				colors.push(player.color);
				Meteor.call('updateColor', platformId, player.color);
			}
			platform.key.ctx.fillStyle = player.color;
			platform.key.ctx.fill();
			platform.key.dirty = true;
		});

		player.body.velocity.x = 0;
		player.body.velocity.y = 0;

        if (Game.findOne().started) {
            if (cursors.left.isDown) {
                player.body.velocity.x = -50;
            } else if (cursors.right.isDown) {
                player.body.velocity.x = 50;
            } else if (cursors.up.isDown) {
                player.body.velocity.y = -50;
            } else if (cursors.down.isDown) {
                player.body.velocity.y = 50;
            }
        }
	}

});
