/*
	Checkpoint

	This acts as a player spawner. It simple sets itself as the current checkpoint when the player
	passes over it. Can use this to respawn players when the die / load

	It's also used by the levelChange entity to spawn the player on the next level

*/
ig.module(
	'game.entities.checkpoint'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityCheckpoint = ig.Entity.extend({
	size: {x: 32, y: 32},
	target: {},
	checkAgainst: ig.Entity.TYPE.A,
	name: '',

	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 200, 200, 0.7)',

	check: function( other ) {
		if(other && other instanceof EntityPlayer) ig.game.state.currentCheckpoint = this.name;
	}
});

});
