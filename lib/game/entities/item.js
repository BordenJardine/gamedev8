/*
	Item Entity

	This is an entity that can be picked up by the player.

	It's properties are set through Weltmesiter with (key, value) pairs
	Right now valid pairs are:
		- (image, imagename)
		- (itemname, items name)
		-  (itemvalue, items value)

	Should be able to extend to meet all of our item needs

*/
ig.module(
	'game.entities.item'
)
.requires(
	'impact.entity',
	'game.classes.wordwrap',
	'game.system.eventChain'
)
.defines(function(){

EntityItem = ig.Entity.extend({

	size: {x: 16, y:16},

	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,

	// for weltmeister -- needs to have an animation that it can draw
	animSheet: new ig.AnimationSheet('media/weltph.png', 16, 16),

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.addAnim( 'idle', 1, [0] );
	},

	ready: function() {
		for(var i = 0; i < ig.game.itemState.length; i++) {
			if(ig.game.itemState[i] == this.GUID) {
				this.kill();
			}
		}

		if(this.image === undefined) this.image = 0;
		// Here the actual values are set via values set in Weltmeister
		this.animSheet = ig.game.itemImages;
		this.addAnim( 'actual', 1, [this.image] );
		this.currentAnim = this.anims.actual;
	},

	check: function(other) {
		// if player is close AND action button pressed
		// pick up item, and remove itself from the game
		if(other && other instanceof EntityPlayer) {
			if(ig.input.state("action")) {
				var item = {
					name: this.itemname,
					value: this.itemvalue,
					scriptedItemNum: (this.scriptedItemNum !== 'undefined') ? this.scriptedItemNum : 0,
					image: this.image,
					itemStrength: this.itemStrength,
					type: this.type
				};

				if(this.nonInventory == 'true') {
					if(this.itemname == 'cart') {
						ig.game.state.flags.push('cart');
						ig.game.newPopup('To use the cart, press inventory (I). Items you pick up will go in your cart.')
					}
				} else {
					if(this.itemname == 'box') {
						ig.game.newPopup('To use the box, equip it by clicking on it in the inventory. To use your currently equipped item, press use (SPACE).')
					}
					ig.game.state.inventory.push(item);
					var itemTest = ig.gui.element.action('getByName', item.name);
					if(itemTest == undefined) {
						ig.game.addInventoryGUIButton(item);
					} else {
						// TODO - correct this to make icon show 'x2, x3, etc'
						itemTest.title = itemTest.title;
					}
				}

				ig.game.itemState.push(this.GUID);
				this.kill();
			}
		}
	},

	update: function() {
		this.parent();
	},

	draw: function() {
		this.parent();
	}
});

});
