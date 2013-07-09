ig.module(
	'game.entities.shootybaddy'
)
.requires(
	'game.entities.baddy',
	'game.system.eventChain'
)
.defines(function() {
EntityShootybaddy = EntityBaddy.extend({

	animSheet: new ig.AnimationSheet('media/baddy.png', 32, 32),
	shootChain: undefined,
	shooting: false,

	init: function(x, y, settings) {

		this.shootChain = EventChain(this)
			.wait(1)
			.then(function() {
				this.fire();
			});

		this.parent(x, y, settings);
	},


	decideBehavior: function() {
		if(this.hostile && this.behavior == 'pursue' || this.previousBehavior == 'pursue' && this.spotTarget()){
			this.shootTarget();
		}
		this.parent();
	},


	fire: function() {
		console.log('bang');
		this.shooting = false;
	},


	shootTarget: function() {
		if(this.shooting) return;
		this.shooting = true;
		this.waitBegin(function() { return this.shooting == false });

	},


	update: function() {
		if(this.shooting == true) {
			this.facing = this.angleTo(this.target);
			this.shootChain();
		}

		this.parent();
	}
});

});
