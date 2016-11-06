import Phaser from 'phaser';
import Tone from 'tone';
import {controllerBall,waveGen,audioSample,SFX} from './ball.js';
import CB from './callbacks.js';
export default class extends Phaser.State {

	init(){}
	preload(){
		game.load.image('ball', 'assets/ball.png');
	    game.load.image('ball_green', 'assets/ball_green.png');
	    game.load.image('ball_black', 'assets/ball_black.png');
	    game.load.physics("ball_physics", "assets/ball.json");
	    game.player = new Tone.Player("./sounds/collision.wav").toMaster();
	}

	create(){
		game.world.setBounds(0, 0, 960, 640);  //   Enable p2 physics
	    game.stage.backgroundColor = '#eee';
		game.physics.startSystem(Phaser.Physics.P2JS);
	 // game.physics.p2.setBoundsToWorld(true, true, true, true, false);
	    game.physics.p2.setImpactEvents(true);
	    game.physics.p2.updateBoundsCollisionGroup();
	    game.physics.p2.restitution = 1;    //  Make things a bit more bouncey
	    game.add.text(20, 20, 'move the ball with arrow keys!', { fill: '#ffffff' });


	    game.cursors = game.input.keyboard.createCursorKeys();
    	game.mouse = game.input.mouse;
    	game.myCollisionGroup = game.physics.p2.createCollisionGroup();
    	game.addButton = document.getElementById('addBall');
    	game.addButton.onclick = CB.addNewBall;
    //	game.graphics = game.add.graphics(game.world.centerX, game.world.centerY);
    	game.con = new controllerBall(360,360);
    	game.wav = new audioSample(200,200);
    	game.sfx = new SFX(500,500);
   
	}

	update(){
		var distance = game.sfx.distanceWith(game.wav);
		if(distance < 250){
			if(!game.sfx.connected){ 
				game.wav.sample.connect(game.sfx.effect);
				game.sfx.connected = true;
			}
			game.sfx.effect.wet.value = -0.00617 * distance + 1.5432;
		}

			
		else{
			if(game.sfx.connected){
				game.wav.sample.disconnect().toMaster();
				game.sfx.connected = false;
			}
			
		}
	}
}