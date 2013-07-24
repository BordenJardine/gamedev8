ig.module(
	'game.entities.bullet'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityBullet = ig.Entity.extend({
	size: {x: 4, y: 4},
	maxVel: {x: 800, y: 800},
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B, // Check Against B - our evil enemy group
	collides: ig.Entity.COLLIDES.LIGHT,

	animSheet: new ig.AnimationSheet( 'media/bullet.png', 4, 4 ),

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.addAnim( 'idle', 1, [0] );
		this.currentAnim.angle = settings.angle;
		this.owner = settings.owner;

		this.vel.x = Math.cos(settings.angle) * this.maxVel.x;
		this.vel.y = Math.sin(settings.angle) * this.maxVel.y;

	},

	// This function is called when this entity overlaps anonther entity of the
	// checkAgainst group. I.e. for this entity, all entities in the B group.
	//spawn bullet holes, etc. effects here
	check: function( other ) {
		other.receiveDamage( 4, this );
		this.kill();
	},

	//handle collisions with walls
	handleMovementTrace: function ( res ){
		if( res.collision.x || res.collision.y ) {
			this.kill();
		} else {
			// No collision. Just move normally.
			this.parent( res );
		}
	}
});

});
