ig.module(
	'game.entities.shootybaddy'
)
.requires(
	'game.entities.baddy',
	'game.entities.bullet',
	'game.system.eventChain'
)
.defines(function() {
EntityShootybaddy = EntityBaddy.extend({

	shootChain: undefined,
	shooting: false,
	shootCooldown: 0.5,
	gunSound: new ig.Sound('media/sounds/gun.ogg'),

	init: function(x, y, settings) {
		this.addAnim( 'fire', .5, [24,25,26] );

		this.shootChain = EventChain(this)
			.wait(this.shootCooldown)
			.then(function() {
				this.fire();
				this.gunSound.play();
			}).repeat();

		this.parent(x, y, settings);
	},


	decideBehavior: function() {
		if(this.hostile && this.behavior == 'pursue' && this.spotTarget()){
			this.shootTarget();
		}
		this.parent();
	},


	fire: function() {
		this.makeBullet();
		this.shooting = false;
	},

	makeBullet: function() {
		ig.game.spawnEntity(EntityBullet, this.pos.x + this.size.x / 2, this.pos.y + this.size.y / 2, {
			angle : this.currentAnim.angle,
			checkAgainst : ig.Entity.TYPE.A,
			owner: this
		});
	},

	shootTarget: function() {
		if(this.shooting) return;
		this.shooting = true;
		this.waitBegin(function() { return this.shooting == false });

	},


	update: function() {
		if(this.shooting == true) {
			this.currentAnim = this.anims.fire;
			this.facing = this.angleTo(this.target);
			this.shootChain();
		}
		this.parent();
	}
});

});
