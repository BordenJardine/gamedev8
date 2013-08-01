
ig.module(
	'game.entities.prism'
)
.requires(
	'impact.entity',
	'game.entities.npc',
	'plugins.screenshaker',
	'game.entities.door',
	'game.entities.keycard',
	'game.classes.particleemitter'
)
.defines(function(){

EntityPrism = EntityNpc.extend({

	size: {x: 128, y:128},

	maxVel: {x: 100, y: 100},
	friction: {x: 1000, y: 1000},

	type: ig.Entity.TYPE.B,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.FIXED,

	talkImage: 7,

	health: 10,

	animSheet: new ig.AnimationSheet('media/prism.png', 128, 128),

	laserTimer: new ig.Timer(),

	eventChain: undefined,
	eventChainGenerator: undefined,
	showAlert: false,
	dialogOverwrite: false,

	active: false,
	triggered: false,


	init: function(x, y, settings) {
		this.parent(x, y, settings);
	},


	ready: function() {
		this.killDialog = 27;
		this.showAlert = false;

		this.lasers = ig.game.getEntitiesByType(EntityLaser);
		this.arms = ig.game.getEntitiesByType(EntityArm);

		this.addAnim( 'idle', .75, [0] );
		this.currentAnim = this.anims.idle;

		this.talkImage = 7;

		this.parent();
	},


	check: function(other) {
		this.parent(other);
	},


	activate: function() {
		this.triggered = true;
		ig.game.state.flags.push('prismfight');
		ig.game.spawnEntity(EntityDoor, this.pos.x  + 20, this.pos.y + 580, {color:'black', width: 100, height: 16, spawned: true});
		this.eventChain = this.eventChainGenerator.getChain(25, this);
		this.dialogActive = true;
	},


	laugh: function() {
		console.log('haha');
		this.eventChain = this.eventChainGenerator.getChain(26, this);
		this.dialogActive = true;
	},


	getDamaged: function() {
		this.health--;
		this.emitter = new ParticleEmitter({
			x: this.pos.x + 25,
			y: this.pos.y + 25,
			ttl: 1,
			qty: 50,
			repeat: false,
			type: 'item',
			zIndex: 10
		});
	},


	update: function() {
		var self = this;

		if (this.active && !this.dead) {
			if (this.health < 5) this.arms.forEach(function(item) {
				item.move()
			});


			if (this.laserTimer.delta() >= 0) {
				var numLasers = Math.floor(Math.random() * 5) + 1;

				for (var i = 0; i < numLasers; i++) {
					var laserIdx = Math.floor(Math.random() * 5);

					this.lasers[laserIdx].fire();
				}

				this.laserTimer.set(this.health/2 + Math.random() * 5);
			}
		}


		if (this.health <= 0 && !this.dead) this.die();
		if (this.dead) {
			this.selfDestruct();
		}

		if (this.emitter && !this.emitter.finished) this.emitter.emitParticles();

		this.armCount = ig.game.getEntitiesByType(EntityArm).length;

		this.parent();
	},


	die: function() {
		this.eventChain = this.eventChainGenerator.getChain(30, this);
		this.dialogActive = true;
		this.dead = true;
		this.selfD = new ig.Timer();
		ig.game.startCountdown();
		this.selfD.set(10);
		this.step = 0;
		ig.game.state.flags.push('prismdead');

		ig.game.spawnEntity(EntityKeycard, this.pos.x  + 20, this.pos.y + 250, {color:'black', width: 10, height: 10, spawned: true});
	},


	selfDestruct: function() {
		if (this.selfD.delta() >= 0) {
			ig.game.theScreenShaker.timedShake(100, 5);
			this.selfD.reset();
		}
	},


	dialogFinished: function() {
		this.dialogActive = false;
		this.dialogCompleted = true;
		this.dialogKey = undefined;
		this.active = true;
	},


	draw: function() {
		this.step++;
		if(this.step > 100) counter = 0;


		if (this.dead && (((this.step / 20) & 3) !== 0)) {
			var ctx = ig.system.context;
			ctx.save();

			ctx.fillStyle = "rgba(188,24,9,.5)";
			ctx.fillRect(0, 0, ig.system.width, ig.system.height);

			ctx.restore();
		}

		this.parent();
	}

});

});
