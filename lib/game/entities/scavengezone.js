/*
	Checkpoint

	This acts as a player spawner. It simple sets itself as the current checkpoint when the player
	passes over it. Can use this to respawn players when the die / load

	It's also used by the levelChange entity to spawn the player on the next level

*/
ig.module(
	'game.entities.scavengezone'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityScavengezone = ig.Entity.extend({
	size: {x: 32, y: 32},
	target: {},
	checkAgainst: ig.Entity.TYPE.A,
	name: '',

	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 150, 150, 0.7)',

	spawnRate: 0.5,
	item: undefined,

	ready: function() {
		if(Math.random() < this.spawnRate) {
			var possibleItems = ig.global.SCAVENGE_ITEMS.length - 1;
			var randomItem = Math.floor(Math.random() * (possibleItems + 1));
			this.item = ig.global.SCAVENGE_ITEMS[randomItem];
		}

		this.parent();
	},

	check: function( other ) {
		if(other && other instanceof EntityPlayer) {
			if (ig.input.pressed('action')) {
				if(this.item != undefined) {
					ig.game.state.inventory.push(this.item);
					ig.game.addInventoryGUIButton(this.item);
					ig.game.newPopup('You scavenged a ' + this.item.itemname);
					this.item = undefined;
				}
			}
		}
		this.parent(other);
	},

	draw: function() {
		x = ig.system.getDrawPos(this.pos.x);
		y = ig.system.getDrawPos(this.pos.y) ;

		var ctx = ig.system.context;
		ctx.beginPath();
		ctx.fillStyle="rgba(200,150,150,0.4)";
		ctx.strokeStyle="rgba(200,150,150,0.8)";
		ctx.rect(x-ig.game.screen.x, y-ig.game.screen.y,this.size.x,this.size.y);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();

		this.parent();
	}
});

});
