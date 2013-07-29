ig.module(
	'game.entities.laserblast'
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
	  collides: ig.Entity.COLLIDES.PASSIVE,

	  laserTimer: new ig.Timer(),

	  init: function( x, y, settings ){
		this.parent( x, y, settings );

		this.owner = settings.owner;

		this.lifetime = settings.lifetime;
		this.laserTimer.set(12 - settings.lifetime);
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
		x = ig.system.getDrawPos(this.pos.x);
		y = ig.system.getDrawPos(this.pos.y) ;

		var ctx = ig.system.context;
		ctx.beginPath();
		ctx.fillStyle="rgba(200,100,50,0.4)";
		if(this.color != undefined) ctx.fillStyle = this.color;
		ctx.strokeStyle="rgba(200,100,50,0.8)";
		ctx.rect(x-ig.game.screen.x, y-ig.game.screen.y, 48, 500);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		this.parent();
	}

});

});
