ig.module(
	'game.entities.door'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityDoor = ig.Entity.extend({

	size: {x: 20, y:20},
	zindex: 2,

	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.BOTH,
	collides: ig.Entity.COLLIDES.FIXED,

	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 200, 200, 0.7)',

	open: false,


	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		if (settings.spawned) this.ready();
	},


	ready: function() {
		this.size.x = this.width;
		this.size.y = this.height;

		this.parent();
	},


	check:function(other) {
		if(other && other instanceof EntityPlayer && !this.open) {
			if(ig.input.pressed('action') && (ig.game.state.flags.indexOf(this.color) > -1)) {
				this.collides = ig.Entity.COLLIDES.PASSIVE;
				this.open = true;
			}  else if (ig.game.state.flags.indexOf(this.color) < 0) {
				ig.game.newPopup("You need a " + this.color+" keycard to open this door.")
			}
		}
		this.parent(other);
	},


	draw: function() {
		if(!this.open) {
			x = ig.system.getDrawPos(this.pos.x);
			y = ig.system.getDrawPos(this.pos.y) ;

			var ctx = ig.system.context;
			ctx.beginPath();
			ctx.fillStyle="rgba(200,100,50,0.4)";
			if(this.color != undefined) ctx.fillStyle = this.color;
			ctx.strokeStyle="rgba(200,100,50,0.8)";
			ctx.rect(x-ig.game.screen.x, y-ig.game.screen.y,this.width,this.height);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
		}

		this.parent();
	}

});

});
