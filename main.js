// Create our 'main' state that will contain the game
var mainState = {
  preload: function() {
    game.load.image('bird', 'assets/evilnyanwafflecat.png');

    game.load.image('pipe', 'assets/rainbow.png');

    game.load.audio('jump', 'assets/jump.wav');
  },

  create: function() {
    game.stage.backgroundColor = '#67b';

    game.physics.startSystem(Phaser.Physics.ARCADE);

    this.bird = game.add.sprite(100, 245, 'bird');

    game.physics.arcade.enable(this.bird);

    this.bird.body.gravity.y = 1000;

    var spaceKey = game.input.keyboard.addKey(
      Phaser.Keyboard.SPACEBAR);
    spaceKey.onDown.add(this.jump, this);

    game.input.onDown.add(this.jump, this);

    this.pipes = game.add.group();

    this.timer = game.time.events.loop(1500, this.addRowOfPipes, this);

    this.score = -1;
    this.labelScore = game.add.text(150, 150, "0", {
      font: "150px Futura ",
      fontWeight: "bold",
      fill: "#0003"


    });
    this.bird.anchor.setTo(-0.2, 0.5);

this.jumpSound = game.add.audio('jump');
  },

  update: function() {
    if (this.bird.y < 0 || this.bird.y > 490)
      this.restartGame();

      game.physics.arcade.overlap(this.bird, this.pipes, this.hitPipe, null, this);

      if (this.bird.angle < 20)
    this.bird.angle += 1;
  },

  jump: function() {
    if (this.bird.alive == false)
        return;

    this.bird.body.velocity.y = -350;

    this.jumpSound.play();

    var animation = game.add.tween(this.bird);

    animation.to({angle: -20}, 100);

    animation.start();

    animation.start();
  },

  restartGame: function() {
    game.state.start('main');

    game.physics.arcade.overlap(
    this.bird, this.pipes, this.hitPipe, null, this);
  },

  addOnePipe: function(x, y) {
    // Create a pipe at the position x and y
    var pipe = game.add.sprite(x, y, 'pipe');

    // Add the pipe to our previously created group
    this.pipes.add(pipe);

    // Enable physics on the pipe
    game.physics.arcade.enable(pipe);

    // Add velocity to the pipe to make it move left
    pipe.body.velocity.x = -200;

    // Automatically kill the pipe when it's no longer visible
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
  },
  addRowOfPipes: function() {
    // Randomly pick a number between 1 and 5
    // This will be the hole position
    var hole = Math.floor(Math.random() * 5);

    // Add the 6 pipes
    // With one big hole at position 'hole' and 'hole + 1'
    for (var i = 0; i < 11; i++)
      if (i != hole && i != hole + 1 && i != hole + 2)
        this.addOnePipe(400, i * 45);

    this.score += 1;
    this.labelScore.text = this.score;
  },

  hitPipe: function() {
    // If the bird has already hit a pipe, do nothing
    // It means the bird is already falling off the screen
    if (this.bird.alive == false)
        return;

    // Set the alive property of the bird to false
    this.bird.alive = false;

    // Prevent new pipes from appearing
    game.time.events.remove(this.timer);

    // Go through all the pipes, and stop their movement
    this.pipes.forEach(function(p){
        p.body.velocity.x = 0;
    }, this);

},

};



// Initialize Phaser, and create a 400px by 490px game
var game = new Phaser.Game(400, 490);

// Add the 'mainState' and call it 'main'
game.state.add('main', mainState);

// Start the state to actually start the game
game.state.start('main');
