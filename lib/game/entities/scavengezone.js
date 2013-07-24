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
	zIndex: 1,

	_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(196, 150, 150, 0.7)',

	spawnRate: 0.5,
	item: undefined,

	scavengeItems: [
		{
			name: 'food',
			image: 3,
			type: 'consumable',
			price: .10
		},
		{
			name: 'tincan',
			image: 4,
			type: 'equippable',
			price: .10
		}
	],

	ready: function() {
		if(Math.random() < this.spawnRate) {
			var possibleItems = this.scavengeItems.length - 1;
			var randomItem = Math.floor(Math.random() * (possibleItems + 1));
			this.item = this.scavengeItems[randomItem];
		}

		this.parent();
	},

	check: function( other ) {
		if(other && other instanceof EntityPlayer) {
			if (ig.input.pressed('action') && ig.game.state.flags.indexOf('cart') > -1) {
				if(this.item != undefined) {
					ig.game.inventory.addToInventory(this.item);
					ig.game.newPopup('You scavenged a ' + this.item.name+', worth $' + (this.item.price/2).toFixed(2)+'!');
					this.item = undefined;
				} else {
					ig.game.newPopup("You didn't find anything");
				}
			}
		}
		this.parent(other);
	}
});

});
