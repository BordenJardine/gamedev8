/*
	Basic enemy class

	Doesn't do anything yet
*/
ig.module(
	'game.entities.trashcan'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityTrashcan = ig.Entity.extend({

	size: {x: 16, y: 16},

	maxVel: {x: 100, y: 100},
	friction: {x: 1000, y: 1000},

	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.ACTIVE,

	animSheet: new ig.AnimationSheet( 'media/trashcan.png', 16, 16 ),

	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	accel_default: 400,
	health: 5,
	flip: false,

	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		// Add the animations
		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'run', 0.07, [0] );
	},


	update: function() {

		// ENEMY AI HERE!

		this.parent();
	},

	//function that the damaging class calls to do damage
	//override this method to spawn effects (blood splats, etc.) and sounds here.
	//the parent function already takes care of despawing the entity if it has zero or less HP
	receiveDamage: function(amt,who){
		this.parent(amt,who);
	}
});

});
