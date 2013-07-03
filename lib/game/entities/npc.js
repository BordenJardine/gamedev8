ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
	'game.classes.wordwrap'
)
.defines(function(){

EntityNPC = ig.Entity.extend({

	size: {x: 16, y:16},

	maxVel: {x: 100, y: 100},
	friction: {x: 1000, y: 1000},

	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,

	animSheet: new ig.AnimationSheet( 'media/npc.png', 16, 16 ),


	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	accel_default: 400,
	health: 10,
	flipx: false,
	flipy: false,

	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		// Add the animations
		this.addAnim( 'idle', 1, [0] );
	},

	check: function(other) {
		// if player is close AND action button pressed
		// open dialogue

		// add pages to ig.game.dialogue
	},

	update: function() {

		this.parent();
	}
});

});
