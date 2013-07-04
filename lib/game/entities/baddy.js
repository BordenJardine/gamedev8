TO_RADS = 180/Math.PI;

ig.module(
	'game.entities.baddy'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityBaddy = ig.Entity.extend({

	size: {x: 32, y:32},

	movementSpeed: 100,
	friction: {x: 1000, y: 1000},

	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.ACTIVE,

	animSheet: new ig.AnimationSheet('media/baddy.png', 32, 32),


	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	accel_default: 400,
	health: 5,

	init: function(x, y, settings) {

		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'run', 0.07, [0,1,2] );

		this.parent( x, y, settings );
	},


	ready: function() {
		this.createRoute();
		if (this.target != undefined) this.target = ig.game.getEntityByName(this.target);
	},


	update: function() {
		if( this.vel.x != 0 || this.vel.y != 0 ) {
			this.currentAnim = this.anims.run;
		} else {
			this.currentAnim = this.anims.idle;
		}

		// ENEMY AI HERE!
		if(this.behavior == 'patrol') this.followRoute(this.route);
		if(this.behavior == 'pursue') this.pathToTarget(this.target);

		this.currentAnim.angle = this.facing;
		this.parent();
	}
});

});
