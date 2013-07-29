ig.module(
	'game.entities.laserblast'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityLaserblast = ig.Entity.extend({

	  size: { x: 32, y: 1500 },
	  offset: { x:0, y:0 },

	  type: ig.Entity.TYPE.B,
	  checkAgainst: ig.Entity.TYPE.A,
	  collides: ig.Entity.COLLIDES.NEVER,

	  zIndex: 1,

	  laserTimer: new ig.Timer(),

	  init: function( x, y, settings ){
		this.parent( x, y, settings );

		this.owner = settings.owner;

		this.lifetime = settings.lifetime;
		this.laserTimer.set(settings.lifetime);
	},


	update: function(){
		if (this.laserTimer.delta() >= 0){
			 this.owner.down = false;
			 this.kill();
		}

		this.parent();
	},


	check: function(other) {
		if (other && other instanceof EntityPlayer) other.receiveDamage(999, this);

		this.parent(other);
	},


	draw: function() {
		var x = ig.system.getDrawPos(this.pos.x);
		var y = ig.system.getDrawPos(this.pos.y) ;

		var g = 0.05;

		var ctx = ig.system.context;

		for (var i=0;i<3;i++) {
			ctx.save();
			var h = ((this.laserTimer.delta()/3 * 360 + 130) % 360)>>0;
			var y = 0.45;
			var f = i / 3;
			var s = 70;
			var l = ((40 + 60 * f) >> 0);
			var c = "hsl(" + h + "," + s + "%," + l + "%)";

			ctx.fillStyle = c;
			if (this.owner.standalone == true) ctx.fillRect( x - ig.game.screen.x + i * 5.5,  y - ig.game.screen.y +  950, 30 - i * 12, 430);
			else ctx.fillRect( x - ig.game.screen.x + i * 5.5,  y - ig.game.screen.y + 24, 30 - i * 12, 1500);
			ctx.restore();
		}

		this.parent();
	}

});

});
