ig.module(
	'game.entities.arm'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityArm = ig.Entity.extend({

	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.FIXED,

	zIndex: 2,
	initialMove: false,

	animSheet: new ig.AnimationSheet( 'media/arm.png', 32, 32 ),

	size: {x:32,y:32},
	friction: { x:0, y:0 },


	init: function( x, y, settings ){
		this.addAnim( 'idle', .11, [0] );
		this.currentAnim = this.anims.idle;

		this.parent(x,y,settings);
	},


	ready: function() {
		this.owner = ig.game.getEntitiesByType(EntityPrism)[0];
		if (this.rightarm === 'true') this.currentAnim.angle = 3.14;
		this.originalY = this.pos.y;
	},


	move: function() {
		if (!this.initialMove) {
			this.dir = Math.random() > .5 ? 'up' : 'down';
			this.initialMove = true;
		}

		if (this.dir === 'up' && (this.pos.y - this.originalY) >= -50) this.pos.y -= (6-this.owner.health);
		else if (this.dir === 'up') this.dir = 'down';
		else if (this.dir === 'down' &&  (this.pos.y - this.originalY) <= 150 ) this.pos.y += (6-this.owner.health);
		else if (this.dir === 'down') this.dir = 'up';
	},


	getDamaged: function() {
		this.owner.getDamaged();
		if (this.owner.health < 5 && this.owner.armCount == 2) this.kill();
		if (this.owner.health <= 0) this.kill();
	},


	draw: function() {
		this.parent();
	},


	update: function() {
		if (this.owner.health < 7) {
			this.move();
		}

		this.parent();
	}

});

});
