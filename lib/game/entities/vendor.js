/*
	Checkpoint

	This acts as a player spawner. It simple sets itself as the current checkpoint when the player
	passes over it. Can use this to respawn players when the die / load

	It's also used by the levelChange entity to spawn the player on the next level

*/
ig.module(
	'game.entities.vendor'
)
.requires(
	'impact.entity',
	'game.classes.menu'
)
.defines(function(){

EntityVendor = ig.Entity.extend({
	size: {x: 64, y: 64},

	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,

	animSheet: new ig.AnimationSheet('media/vendor.png', 64, 64),

	items: [
		{name: 'food', image: 3, quantity: 3, price: 10, type: 'consumable'}
	],

	init: function(x,y,settings) {
		this.addAnim( 'idle', 1, [0] );
		this.currentAnim = this.anims.idle;

		this.parent(x,y,settings);
	},

	ready: function() {
		this.menu = new Menu(this.items);
		this.parent();
	},

	check: function( other ) {
		if(other && other instanceof EntityPlayer) {
			if (ig.input.pressed('action') && ig.game.state.flags.indexOf('cart') > -1) {
				this.menu.toggle();
			}
		}
		this.parent(other);
	},

	update: function() {
		this.parent();
		this.menu.display();
	}
});

});
