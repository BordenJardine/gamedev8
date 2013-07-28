
ig.module(
	'game.entities.prism'
)
.requires(
	'impact.entity',
	'game.entities.npc'
)
.defines(function(){

EntityPrism = EntityNpc.extend({

	size: {x: 128, y:128},

	maxVel: {x: 100, y: 100},
	friction: {x: 1000, y: 1000},

	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.FIXED,

	health: 10,

	animSheet: new ig.AnimationSheet('media/prism.png', 128, 128),

	laserTimer: new ig.Timer(),

	eventChain: undefined,
	eventChainGenerator: undefined,
	showAlert: false,
	dialogOverwrite: false,

	ready: function() {
		this.killDialog = 27;
		this.showAlert = false;

		this.lasers = ig.game.getEntitiesByType(EntityLaser);
		this.arms = ig.game.getEntitiesByType(EntityArm);

		this.addAnim( 'idle', .75, [0] );
		this.currentAnim = this.anims.idle;

		this.parent();
	},


	check: function(other) {
		this.parent(other);
	},


	triggerDialog: function() {

	},


	update: function() {
		if (this.health < 5) this.arms.forEach(function(item) {
			item.move()
		});

		if (this.laserTimer.delta() >= 0) {
			this.lasers.forEach(function(laser) {
				if ((Math.random() * this.health) < 1) laser.fire();
			});

			this.laserTimer.reset(this.health);
		}

		this.parent();
	},


	dialogFinished: function() {
	},

});

});
