ig.module(
	'game.entities.emitter'
)
.requires(
	'game.classes.particleemitter',
	'impact.entity'
)
.defines(function(){

EntityEmitter = ig.Entity.extend({

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NONE,

	size: {x:3,y:3},
	friction: { x:0, y:0 },

	init: function( x, y, settings ){
		this.parent(x,y,settings);

		this.particles = new ParticleEmitter({
			x: this.pos.x + this.size.x / 2,
			y: this.pos.y + this.size.y / 2,
			type: 'item',
			ttl: 1,
			qty: 5,
			repeat: true,
			repeatTime: .5
		})
	},

	update: function() {
		if(this.particles) this.particles.emitParticles();
		this.parent();
	}

});

});
