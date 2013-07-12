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

	size: {x: 30, y:30},

	baseMovementSpeed: 150,
	movementSpeed: 150,
	friction: {x: 1000, y: 1000},

	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.PASSIVE,
	name: 'player',

	animSheet: new ig.AnimationSheet('media/twd_player.png', 32, 32),

	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	health: 10,
	healthMax: 10,
	sleepEnergyBoost: 7,
	needs: undefined,
	inBox: false,
	itemUseCooldown: false,
	cooldownTimer: new ig.Timer(),
	cooldownTime: .5,

	zIndex: 2,

	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		this.addAnim( 'idle', 1, [0] );
		//this.addAnim( 'run', 0.09, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] );
		//this.addAnim( 'boxHide', 2, [16,17,18,19], true);
		//this.addAnim( 'boxIdle', 1, [19]);
		//this.addAnim( 'boxAway', 2, [19, 20], true);
		this.addAnim( 'run', 0.09, [0,1,2,3,4,5,6,7,8,9,10,11] );
		this.addAnim( 'boxHide', 2, [12,13,14,15], true);
		this.addAnim( 'boxIdle', 1, [15]);
		this.addAnim( 'boxAway', 2, [14, 15], true);

		if(settings.needs == undefined) {
			ig.game.needs = new Needs();
			this.needs = ig.game.needs;
		}
	},

	eat: function(hp, hg) {
		if(hp == undefined) hp = 2;
		if(hg == undefined) hg = 5;
		health = ig.game.state.health;
		(hp + ig.game.state.health > this.healthMax) ? this.health = this.heathMax : ig.game.state.health += hp;
		this.needs.addHunger(hg);
	},

	sleep: function() {
		ig.game.saveGame();
		this.needs.addEnergy(this.sleepEnergyBoost);
	},

	receiveDamage: function(amount, entity) {
		ig.game.state.health -= amount;
	},

	update: function() {

		// movement
		var speed = this.movementSpeed;
		var tired = ig.game.state.energy <= 0 ? true : false;
		var hungry = ig.game.state.hunger <= 0 ? true : false;

		if (tired) speed = this.movementSpeed * 0.5;

		if((ig.input.state('left') || ig.input.state('left')) &&
			 (ig.input.state('up') || ig.input.state('up'))) {
			speed = Math.sqrt(Math.pow(speed, 2) / 2);
		}

		if( ig.input.state('left') ) {
			this.vel.x = -speed;

		} else if( ig.input.state('right') ) {
			this.vel.x = speed;
		} else {
			this.vel.x = 0;
		}

		if (ig.input.state('up')) {
			this.vel.y = -speed;
		} else if(ig.input.state('down')) {
			this.vel.y = speed;
		} else {
			this.vel.y = 0;
		}

		// If hungry, reverse movement
		if(hungry) {
			this.vel.y *= -1;
			this.vel.x *= -1;
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
			var item = ig.game.state.equipped;

			this.itemUseCooldown = true;
			this.cooldownTimer.set(this.cooldownTime);

			ig.game.inventory.useItem(item);
		}

		this.parent();
	}
});


});
