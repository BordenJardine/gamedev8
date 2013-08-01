/*

	Changelevel

	This entity changes the current level when triggered

	It also sets the checkpoint which is where the player will be spawned when they trigger
	the level change

	Note: must have a checkpoint entity with the same name as "goTo" in weltmeister

*/

ig.module(
	'game.entities.changelevel'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityChangelevel = ig.Entity.extend({
	size: {x: 32, y: 32},
	target: {},
	level: {},
	goTo: {},

	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 255, 0, 0.7)',

	startLevelChange: function() {
		if (ig.game.state.flags.indexOf('prismdead') > -1) {
			this.sceneManager.pushScene( new ClosingScene() )
		} else {
			var hb2 = ig.game.getEntitiesByType(EntityHb2)[0];
			if(hb2 != undefined) hb2.saveState();

			ig.game.state.currentCheckpoint = this.goTo;
			ig.game.state.currentLevel = this.level;
			ig.game.fader = new ig.ScreenFader ({fade: 'in', speed: 3, callback: this.changeLevel, delayAfter: .5});
		}
	},

	changeLevel: function() {
		ig.game.fogSpawned = false;
		ig.game.levelDirector.jumpTo( ig.global[ig.game.state.currentLevel]);
	},

	resetLevel: function() {
		ig.game.fader = new ig.ScreenFader ({fade: 'in', speed: 3, callback: this.changeLevel, delayAfter: .5});
	}
});

});
