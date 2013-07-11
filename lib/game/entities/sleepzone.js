/*
	Checkpoint

	This acts as a player spawner. It simple sets itself as the current checkpoint when the player
	passes over it. Can use this to respawn players when the die / load

	It's also used by the levelChange entity to spawn the player on the next level

*/
ig.module(
	'game.entities.sleepzone'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntitySleepzone = ig.Entity.extend({
	size: {x: 32, y: 32},
	target: {},
	checkAgainst: ig.Entity.TYPE.A,
	name: '',

	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 100, 100, 0.7)',

	check: function( other ) {
		if(other && other instanceof EntityPlayer) {
			if (other.inBox && ig.input.pressed('action')) {
				other.sleep();
			}
		}
	},

	draw: function() {
		x = ig.system.getDrawPos(this.pos.x);
		y = ig.system.getDrawPos(this.pos.y) ;

		var ctx = ig.system.context;
		ctx.beginPath();
		ctx.fillStyle="rgba(200,100,50,0.4)";
		ctx.strokeStyle="rgba(200,100,50,0.8)";
		ctx.rect(x-ig.game.screen.x, y-ig.game.screen.y,this.size.x,this.size.y);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		this.parent();
	}
});

});
