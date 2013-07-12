/*
	Basic enemy class

	Doesn't do anything yet
*/
ig.module(
	'game.entities.fog'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityFog = ig.Entity.extend({

	size: {x: 1024, y:768},

	maxVel: {x: 0, y: 0},
	friction: {x: 0, y: 0},

	type: ig.Entity.TYPE.NONE, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.NONE, // Check against friendly
	collides: ig.Entity.COLLIDES.NEVER,

	animSheet: new ig.AnimationSheet( 'media/fog.png', 1024, 768 ),

	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	accel_default: 0,

	init: function( x, y, settings ) {
		var player = ig.game.getEntitiesByType(EntityPlayer)[0];
		this.pos.x = player.pos.x - ig.system.width / 2;
		this.pos.y = player.pos.y - ig.system.height / 2;
		this.parent( x, y, settings );

		// Add the animations
		this.addAnim( 'idle', 1, [0] );
	},

	update: function() {
		var player = ig.game.getEntitiesByType(EntityPlayer)[0];
		this.pos.x = player.pos.x - ig.system.width / 2;
		this.pos.y = player.pos.y - ig.system.height / 2;
		this.parent();
	}
});

});
