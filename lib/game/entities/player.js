/*
	Main Player Entity -- DO NOT PLACE VIA WELTMEISTER
*/
ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({

	// The players (collision) size is a bit smaller than the animation
	// frames, so we have to move the collision box a bit (offset)
	size: {x: 32, y:32},

	maxVel: {x: 100, y: 100},
	friction: {x: 1000, y: 1000},

	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
	name: 'player',

	animSheet: new ig.AnimationSheet('media/player.png', 32, 32),


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
		this.addAnim( 'run', 0.07, [0,1,2] );
	},

	update: function() {

		// movement
		var accel = this.accel_default;

		if( ig.input.state('left') ) {
			this.accel.x = -accel;
		} else if( ig.input.state('right') ) {
			this.accel.x = accel;
		} else {
			this.accel.x = 0;
		}

		if (ig.input.state('up')) {
			this.accel.y = -accel;
		} else if(ig.input.state('down')) {
			this.accel.y = accel;
		} else {
			this.accel.y = 0;
		}

		// set the current animation
		if( this.vel.x != 0 || this.vel.y != 0 ) {
			this.currentAnim = this.anims.run;
		}
		else {
			this.currentAnim = this.anims.idle;
		}

		this.currentAnim.flip.x = this.flipx;
		this.currentAnim.flip.y = this.flipy;

		// move!

		//play sounds here
		if(ig.input.pressed('mouse1')){
			//using currentAnim.angle directly makes the bullet rotated 90 degrees.
			var rotated_angle = (90).toRad() + this.currentAnim.angle;
			x_to_spawn = this.pos.x + (this.size.x/2);
			y_to_spawn = this.pos.y + (this.size.y/2);
			ig.game.spawnEntity(EntityBullet, x_to_spawn, y_to_spawn,{angle:rotated_angle});
		}


		this.parent();
	}
});


EntityBullet = ig.Entity.extend({
	size: {x: 2, y: 3},
	maxVel: {x: 200, y: 200},
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B, // Check Against B - our evil enemy group
	collides: ig.Entity.COLLIDES.PASSIVE,

	animSheet: new ig.AnimationSheet( 'media/bullet.png', 8, 8 ),

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.addAnim( 'idle', 1, [0] );
		this.currentAnim.angle = settings.angle;
		
		this.vel.x = Math.sin(settings.angle) * this.maxVel.x;
		this.vel.y = -(Math.cos(settings.angle) * this.maxVel.y);

	},

	// This function is called when this entity overlaps anonther entity of the
	// checkAgainst group. I.e. for this entity, all entities in the B group.
	//spawn bullet holes, etc. effects here
	check: function( other ) {
		other.receiveDamage( 10, this );
		this.kill();
	},

	//handle collisions with walls
	handleMovementTrace: function ( res ){
    if( res.collision.x || res.collision.y ) {
        this.kill();
    }
    else {
        // No collision. Just move normally.
        this.parent( res );
    }
}
});

});
