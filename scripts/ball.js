import Phaser from 'phaser';
import Tone from 'tone';
import CB from './callbacks.js';
import appData from './data.js';
//Sprite.body.damping 用来控制摩擦力！！！！
class Ball extends Phaser.Sprite{
	constructor( x, y, balltype){
		super(game, appData.x || x || 480, appData.y || y || 320, balltype);
		game.physics.p2.enable(this);
		this.body.clearShapes();
	    this.body.loadPolygon("ball_physics", "ball");
	    this.body.collideWorldBounds = true;
	    this.body.setCollisionGroup(game.myCollisionGroup);
	    this.body.collides(game.myCollisionGroup);
	    this.body.fixedRotation = true;
	    this.inputEnabled = true;
	    game.add.existing(this);
	    this.events.onInputDown.add(CB.handleClick.bind(this),this);
	//    this.body.damping = 0;
	}
	update(){

	}
}

class controllerBall extends Ball {
	constructor(x = 480,y = 320){
		super(x, y, 'ball');
		// this.text = game.add.text(this.left ,this.centerY-5,"controller ball",{
		// 	font: "15px Arial",
		// //	align : 'center',
		// //	wordWrap: true, 
		// //	wordWrapWidth: 30
		// //	align : 'center'
		// });
	//	this.addChild(text);
	}

	update(){
		this.body.setZeroVelocity();
		// this.text.x = this.left;
		// this.text.y = this.centerY-5;

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
	}
}

class waveGen extends Ball{
	
	constructor(x,y,freq, waveSelect){
		super(x,y,'ball_green');
		this.osc = new Tone.Oscillator(freq || 440, waveSelect).toMaster();
		this.text = game.add.text(this.left ,this.centerY-5,"osc\n" + waveSelect + "\n" + freq,{
			font: "15px Arial",
			align : 'center',
			wordWrap: true, 
			wordWrapWidth: 30
		//	align : 'center'
		});
		console.log(this.text);
	}

	update(){
		this.text.x = this.left;
		this.text.y = this.centerY-5;
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
	constructor(x,y,sample){
		super(x,y,'ball_black');
		this.sample = new Tone.Player(`./sounds/${sample}.wav`).toMaster();
    	this.sample.loop = true;
	}

	update(){
		if(Math.abs(this.body.velocity.x) > 1){
			if(this.sample.state === 'stopped'){
				this.sample.start();
			}
		}
		else{
			this.sample.stop();
		}
	}
}

class SFX extends Ball {
	constructor(x,y,radius){
		super(x,y,'ball_green');
		this.effect = new Tone.Freeverb().toMaster();
		this.connected = false;
		this.graphics = game.add.graphics(game.world.centerX, game.world.centerY);
		this.graphics.lineStyle(3, 0xffd900);
		this.circle = this.graphics.arc(0, 0, radius, 0, Math.PI * 2, false);

		
	}

	update(){
		this.circle.position.x = this.centerX;
		this.circle.position.y = this.centerY;
	}

	distanceWith(obj){
		var thisX = this.centerX;
		var thisY = this.centerY;
		var dx = thisX - obj.x;
		var dy = thisY - obj.y;
		return Math.sqrt(dx * dx + dy * dy);
	}
}

class paramBall extends Ball{
	constructor(x,y){
		super(x || 440,y || 360,'ball_green');
	}

	update(){
		// Synth.pitchDecay = this.position.x * 0.0078125;
		// Synth.octaves = this.position.y * 0.03125;
	}
}

export {Ball,controllerBall,waveGen,audioSample,SFX,paramBall};