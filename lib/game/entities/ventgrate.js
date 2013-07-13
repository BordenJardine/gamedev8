/*
	Basic enemy class

	Doesn't do anything yet
*/
ig.module(
	'game.entities.ventgrate'
)
.requires(
	'impact.entity',
	'game.entities.fog'
)
.defines(function(){

EntityVentgrate = ig.Entity.extend({

	size: {x: 32, y:32},

	maxVel: {x: 0, y: 0},
	friction: {x: 0, y: 0},

	zIndex: 1,

	type: ig.Entity.TYPE.NONE, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.NEVER,

	animSheet: new ig.AnimationSheet( 'media/ventgrate.png', 32, 32 ),

	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	accel_default: 400,
	health: 5,
	flip: false,

	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		// Add the animations
		this.addAnim( 'idle', 1, [0] );
		this.currentAnim = this.anims.idle
		this.timeOut = new ig.Timer();
		this.timeOut.set(1);
	},

	ready: function() {
		if(this.facing != undefined) this.currentAnim.angle = this.facing;
	},

	check: function(other) {
		if(other && other instanceof EntityPlayer && this.timeOut.delta() > 0) {
			if(ig.game.fogSpawned) {
				ig.game.fogSpawned = false;
				ig.game.getEntitiesByType(EntityFog)[0].kill();
			}
			else {
				ig.game.spawnEntity( EntityFog, 0, 0);
				ig.game.fogSpawned = true;
			}

			this.timeOut.reset();
		}
		this.parent(other);
	}
});

});
