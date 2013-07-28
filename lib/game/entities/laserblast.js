ig.module(
	'game.entities.particle'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityLaserblast = ig.Entity.extend({

	  size: { x: 500, y: 48 },
	  offset: { x:0, y:0 },

	  type: ig.Entity.TYPE.B,
	  checkAgainst: ig.Entity.TYPE.A,
	  collides: ig.Entity.COLLIDES.LITE,

	  laserTime: new ig.Timer(),

	  init: function( x, y, settings ){
		this.parent( x, y, settings );

		this.lifetime = settings.lifetime;
		this.laserTimer.set(15 - settings.lifetime);
	},

	update: function(){
		if(this.laserTimer.delta() > this.lifetime){
			 this.kill();
			 return;
		}

		this.parent();
	},

	draw: function() {
		var ctx = ig.system.context;
		var my_gradient=ctx.createLinearGradient(x, y, 0, x, y, 500);
		my_gradient.addColorStop(0, red);
		my_gradient.addColorStop(1, "rgba(255,255,255,0.0)");
		ctx.fillStyle=my_gradient;
		ctx.beginPath();
		ctx.rect(x, y, 500, 48);
		ctx.closePath();
		ctx.fill();

		this.parent();
	}

});

});
