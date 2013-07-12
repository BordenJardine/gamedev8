ig.module(
	'game.entities.itemparticle'
)
.requires(
	'game.entities.particle',
	'impact.entity'
)
.defines(function(){

EntityItemparticle = EntityParticle.extend({

	 bounciness: 0.5,
	 gravityFactor: 0,
	 vel: null,
	 fadetime: 0.5,

	  init: function( x, y, settings ){

		this.vel = {
			x: (Math.random() < 0.5 ? -.5 : .5)*Math.random()*100,
			y: (Math.random() < 0.5 ? -.5 : .5)*Math.random()*100
		};

		this.parent( x, y, settings );
	},

	update: function() {
		this.vel = {
			x: this.vel.x -= .1,
			y: this.vel.y -= .1
		}
		this.parent()
	},

});

});
