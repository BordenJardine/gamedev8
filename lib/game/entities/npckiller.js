ig.module(
	'game.entities.npckiller'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityNpckiller = ig.Entity.extend({

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NONE,

	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 150, 150, 0.7)',

	size: {x:32,y:32},
	friction: { x:0, y:0 },

	init: function( x, y, settings ){
		this.parent(x,y,settings);
	},

	ready: function()
	{
		this.parent();
	},

	check: function(other) {
		if (other && other instanceof EntitySpawnednpc) {
			other.despawn();
		}
	}

});

});
