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

	baseMaxVel: {x: 150, y: 150},
	maxVel: undefined,
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
	inBox: false,
	itemUseCooldown: false,
	cooldownTimer: new ig.Timer(),
	cooldownTime: 1,

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.maxVel = this.baseMaxVel;
		// Add the animations
		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'run', 0.1, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] );
		this.addAnim( 'boxHide', 2, [16,17,18,19], true);
		this.addAnim( 'boxIdle', 1, [19]);
		this.addAnim( 'boxAway', 2, [19, 20], true);
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

		if(this.inBox) {

		}

		// set the current animation
		if( this.vel.x != 0 || this.vel.y != 0 ) {
			this.currentAnim = this.anims.run;
			if(this.inBox) this.currentAnim = this.anims.boxIdle;
		}
		else {
			this.currentAnim = this.anims.idle;
			if(this.inBox) this.currentAnim = this.anims.boxIdle;
		}

		this.currentAnim.flip.x = this.flipx;
		this.currentAnim.flip.y = this.flipy;

        // figure out where the mouse is
        var rotate_to_x = ig.input.mouse.x + ig.game.screen.x;
        var rotate_to_y = ig.input.mouse.y + ig.game.screen.y;
		this.currentAnim.angle = Math.atan2((rotate_to_y-this.pos.y), (rotate_to_x-this.pos.x));

		if(this.itemUseCooldown) {
			if(this.cooldownTimer.delta() >= 0) {
				this.itemUseCooldown = false;
			}
		}

		if(ig.input.pressed('use') && ig.game.state.equipped != undefined && !this.itemUseCooldown) {
			var item = ig.game.state.equipped.name;
			var itemObj = undefined;
			this.itemUseCooldown = true;
			this.cooldownTimer.set(this.cooldownTime);

			for(var key in ig.global.ITEM_USES) {
				if(key == item) itemObj = ig.global.ITEM_USES[key];
				if(itemObj != undefined) itemObj.use(this);
				break;
			}

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
