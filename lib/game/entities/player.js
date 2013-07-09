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

	size: {x: 32, y:32},

	baseMaxVel: {x: 150, y: 150},
	maxVel: undefined,
	friction: {x: 1000, y: 1000},

	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
	name: 'player',

	animSheet: new ig.AnimationSheet('media/twd_player.png', 32, 32),

	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	accel_default: 400,
	health: 10,
	inBox: false,
	itemUseCooldown: false,
	cooldownTimer: new ig.Timer(),
	cooldownTime: .5,

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.maxVel = this.baseMaxVel;

		this.addAnim( 'idle', 1, [0] );
		//this.addAnim( 'run', 0.09, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] );
		//this.addAnim( 'boxHide', 2, [16,17,18,19], true);
		//this.addAnim( 'boxIdle', 1, [19]);
		//this.addAnim( 'boxAway', 2, [19, 20], true);
		this.addAnim( 'run', 0.09, [0,1,2,3,4,5,6,7,8,9,10,11] );
		this.addAnim( 'boxHide', 2, [12,13,14,15], true);
		this.addAnim( 'boxIdle', 1, [15]);
		this.addAnim( 'boxAway', 2, [14, 15], true);
	},

	sleep: function() {
		ig.game.saveGame();
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
			if(this.inBox) this.currentAnim = this.anims.boxIdle;
		}
		else {
			this.currentAnim = this.anims.idle;
			if(this.inBox) this.currentAnim = this.anims.boxIdle;
		}

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


});
