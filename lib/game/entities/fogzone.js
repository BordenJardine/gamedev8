/*
	Checkpoint

	This acts as a player spawner. It simple sets itself as the current checkpoint when the player
	passes over it. Can use this to respawn players when the die / load

	It's also used by the levelChange entity to spawn the player on the next level

*/
ig.module(
	'game.entities.fogzone'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityFogzone = ig.Entity.extend({
	size: {x: 32, y: 32},
	target: {},
	checkAgainst: ig.Entity.TYPE.A,
	name: '',
	zIndex: 1,

	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 250, 250, 0.7)',


	check: function( other ) {
		if(other && other instanceof EntityPlayer) {
			if (!ig.game.fogSpawned) {
				player.hidden = true;
				ig.game.spawnEntity( EntityFog, 0, 0);
				ig.game.fogSpawned = true;
			}
		}
		this.parent(other);
	}
});

});
