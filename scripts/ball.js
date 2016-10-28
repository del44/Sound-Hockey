import Phaser from 'phaser';
import Tone from 'tone';
import CB from './callbacks.js';
import appData from './data.js';

class Ball extends Phaser.Sprite{
	constructor( x, y, balltype){
		super(game, appData.x || x || 480, appData.y || y || 320, balltype);
		game.physics.p2.enable(this);
		this.body.clearShapes();
	    this.body.loadPolygon("ball_physics", "ball");
	    this.body.collideWorldBounds = true;
	    this.body.setCollisionGroup(game.myCollisionGroup);
	    this.body.collides(game.myCollisionGroup,CB.collision);
	    this.body.fixedRotation = true;
	    this.inputEnabled = true;
	    game.add.existing(this);
	    this.events.onInputDown.add(CB.handleClick.bind(this),this);
	}

	update(){

	}
}

class controllerBall extends Ball {
	constructor(x,y){
		super(x || 480,y || 320,'ball');
		this.circle = new Phaser.Circle(x, y, 300);
	//	this.contains();
	}

	drawCircle(){
		var x = this.centerX;
		var y = this.centerY;
		this.circle = new Phaser.Circle(x, y, 300);
	//	game.input.mousePointer.x,game.input.mousePointer.y
	//	console.log(this.circle.contains(game.input.mousePointer.x,game.input.mousePointer.y));
	//	console.log(game.input.mousePointer.x,game.input.mousePointer.y);
	//	console.log(this.circle.contains(this.circle,game.input.mousePointer.x,game.input.mousePointer.y));
	}

	update(){
		this.body.setZeroVelocity();

	    if (game.cursors.left.isDown)
	    {
	    	this.body.moveLeft(1000);
	    }
	    else if (game.cursors.right.isDown)
	    {
	    	this.body.moveRight(400);
	    }

	    if (game.cursors.up.isDown)
	    {
	    	this.body.moveUp(400);
	    }
	    else if (game.cursors.down.isDown)
	    {
	    	this.body.moveDown(400);
	    }

	   this.drawCircle();
	}



}

class waveGen extends Ball{
	
	constructor(x,y,freq,waveSelect){
		super(x,y,'ball_green');
		this.osc = new Tone.Oscillator(freq || 440, waveSelect || 'sine').toMaster();
	}

	update(){
		if(this.body.velocity.x > 0){
			if(this.osc.state === 'stopped'){
				this.osc.start();
			}
		}
		else{
			this.osc.stop();
		}
	}
	
}

class audioSample extends Ball {
	constructor(x,y){
		super(x,y,'ball_black');
		this.sample = new Tone.Player('./sounds/kick-drum.wav').toMaster();
    	this.sample.loop = true;
	}

	update(){
		if(Math.abs(this.body.velocity.x) > 0){
			if(this.sample.state === 'stopped'){
				this.sample.start();
			}
		}
		else{
			this.sample.stop();
		}
	}
}

export {controllerBall,waveGen,audioSample};