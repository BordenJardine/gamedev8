/*
	Checkpoint

	This acts as a player spawner. It simple sets itself as the current checkpoint when the player
	passes over it. Can use this to respawn players when the die / load

	It's also used by the levelChange entity to spawn the player on the next level

*/
ig.module(
	'game.entities.sleepzone'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntitySleepzone = ig.Entity.extend({
	size: {x: 32, y: 32},
	target: {},
	checkAgainst: ig.Entity.TYPE.A,
	name: '',
	zIndex: 1,

	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 100, 100, 0.7)',

	check: function( other ) {
		if(other && other instanceof EntityPlayer) {
			if (other.inBox && ig.input.pressed('action')) {
				if(ig.game.state.flags.indexOf('firstSleep') < 0) ig.game.state.flags.push('firstSleep');
				ig.game.state.currentCheckpoint = this.name;
				other.sleep();
			}
		}
	}
});

});
