ig.module(
	'game.entities.keycard'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityKeycard = ig.Entity.extend({

	size: {x: 10, y:10},
	zindex: 2,

	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,

	_wmScalable: false,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 200, 200, 0.7)',

	open: false,


	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		if (settings.spawned) this.ready();
	},


	ready: function() {
		if (ig.game.state.flags.indexOf(this.color) > -1) this.kill();
		this.parent();
	},


	check:function(other) {
		if(other && other instanceof EntityPlayer) {
			if(ig.input.released('action')) {
				ig.game.state.flags.push(this.color);
				ig.game.newPopup("You picked up a " + this.color + " keycard");
				this.kill();
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
