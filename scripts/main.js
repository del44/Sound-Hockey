import 'pixi.js';
import 'p2';
import Phaser from 'phaser';
import GameState from './game.js';


class Game extends Phaser.Game {

  constructor () {
	super(960, 640, Phaser.CANVAS, 'content', null);
    this.state.add('Game', GameState, false);
	this.state.start('Game');
  }
}

window.game = new Game();

