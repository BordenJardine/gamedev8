ig.module(
	'game.entities.laser'
)
.requires(
	'impact.entity',
	'game.entities.laserblast',
	'game.entities.item'
)
.defines(function(){

EntityLaser = ig.Entity.extend({

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER,

	preFire: new ig.Timer(),
	fireTime: new ig.Timer(),
	firing: false,
	prefiring: false,
	initialMove: false,
	down: false,

	zIndex: 2,

	animSheet: new ig.AnimationSheet( 'media/laser.png', 32, 32 ),

	size: {x:32,y:32},
	friction: { x:0, y:0 },

	init: function( x, y, settings ){
		this.addAnim('idle', 1, [0]);
		this.addAnim('prefire', 1, [1,2,3,4,5], 1);

		this.currentAnim = this.anims.idle;

		this.parent(x,y,settings);
	},


	ready: function() {
		this.owner = ig.game.getEntitiesByType(EntityPrism)[0];

		if (this.standalone === 'true') {
			this.standalone = true;
			this.standaloneTimer = new ig.Timer();
			this.standaloneTimer.set(Math.floor(Math.random() * 15) + 7);
		}

		this.originalX = this.pos.x;
	},


	fire: function() {
		if (!this.down) {
			this.firing = true;
			this.preFire.reset(this.owner.health);
		}
	},


	knockDebris: function() {
		var itemsOut  = ig.game.getEntitiesByType(EntityItem);
		var debrisOut = 0;

		for (var i = 0; i < itemsOut.length; i++) {
			if (itemsOut[i].name === 'debris') debrisOut++;
		}

		if (debrisOut < 10) {
			var numPieces = Math.floor(Math.random() * 1 + 1);

			for (var i = 0; i < numPieces; i++) {
				var x = Math.floor(Math.random() * ((this.pos.x + 100) - this.pos.x + 1)) + this.pos.x;
				var y = Math.floor(Math.random() * ((this.pos.y + 450) - this.pos.y + 50)) + this.pos.y + 50;

				ig.game.spawnEntity(EntityItem, x, y, { image: 'tincan', type: 'equippable', name: 'debris' });
			}
		}
	},


	move: function() {
		if (!this.initialMove) {
			this.dir = Math.random() > .5 ? 'left' : 'right';
			this.initialMove = true;
		}

		if (this.dir === 'left' && (this.pos.x - this.originalX) >= -50) this.pos.x -= this.owner.health;
		else if (this.dir === 'left') this.dir = 'right';
		else if (this.dir === 'right' &&  (this.pos.x - this.originalX) <= 50 ) this.pos.x += 1;
		else if (this.dir === 'right') this.dir = 'left';
	},


	update: function() {
		if (this.firing) {
			this.currentAnim = this.anims.prefire;
			if (this.preFire.delta() >= 0) {
				ig.game.spawnEntity(EntityLaserblast, this.pos.x, this.pos.y, { lifetime: this.owner.health, owner: this });
				if (!this.standalone) this.knockDebris();
				ig.game.sortEntitiesDeferred();
			 	this.firing = false;
			 	this.down = true;
			 	if (this.standalone)  this.standaloneTimer.reset();
			 }
		} else {
			this.currentAnim = this.anims.idle;
		}

		if (this.standalone && !this.firing) {
			if (this.standaloneTimer.delta() >= 0) {
				this.fire();
			}

		}


		if (this.owner.health < 5) {
			this.move();
		}

		this.parent();
	}

});

});
