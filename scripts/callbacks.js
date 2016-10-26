import appData from './data.js';
import {waveGen,audioSample} from './ball.js';

const CB = {
	collision : function(){
		game.player.start();
	},

	addNewBall : function(){
		switch(appData.unitSelect){
		  case 'oscillator' : new waveGen(appData.xPos,appData.yPos,appData.freq,appData.waveSelect);break;
		  case 'audioSample' : new audioSample(appData.xPos,appData.yPos);break;
		}
	},

	handleClick : function(){
		this.osc.type = appData.waveSelect;
	}
};

export default CB;
