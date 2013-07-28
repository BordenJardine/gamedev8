ig.module(
	'game.entities.laser'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityLaser = ig.Entity.extend({

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NONE,

	preFire: new ig.Timer(),
	fireTime: new ig.Timer(),
	firing: false,
	prefiring: false,

	animSheet: new ig.AnimationSheet( 'media/laser.png', 12, 12 ),

	size: {x:12,y:12},
	friction: { x:0, y:0 },

	init: function( x, y, settings ){
		this.addAnim('idle', 1, [0]);
		this.addAnim('prefire', .5, [1,2,3,4,5]);

		this.currentAnim = this.anims.idle;

		this.parent(x,y,settings);
	},


	ready: function() {
		this.owner = ig.game.getEntitiesByType(EntityPrism)[0];
	},


	fire: function() {
		this.prefiring = true;
		this.preFire.reset(this.owner.health);
	},


	update: function() {
		if (this.firing) {
			this.currentAnim = this.anims.prefire;
			if (this.preFire.delta() >= 0) {
				console.log('firing');
				ig.game.spawnEntity(EntityLaserblast, this.pos.x, this.pos.y, { lifetime: this.owner.health });
				this.prefiring = false;
			}
		}

		this.currentAnim = this.anims.idle;

		this.parent();
	}

});

});
