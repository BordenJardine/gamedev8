ig.module(
	'game.entities.arm'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityArm = ig.Entity.extend({

	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.BOTH,

	size: {x:16,y:16},
	friction: { x:0, y:0 },

	init: function( x, y, settings ){
		this.parent(x,y,settings);
	},

	ready: function() {
		this.owner = ig.game.getEntitiesByType(EntityPrism)[0];
	},

	move: function() {

	},

	draw: function() {
		this.parent();
	},

	update: function() {
		this.parent();
	}

});

});
