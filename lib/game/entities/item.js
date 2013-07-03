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

	// for weltmeister
	animSheet: new ig.AnimationSheet( 'media/itemplaceholder.png', 16, 16 ),

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.addAnim( 'idle', 1, [0] );
	},

	ready: function() {
		// Here the actual values are set via values set in Weltmeister
		this.animSheet = new ig.AnimationSheet('media/'+this.image+'.png', 16, 16);
		this.addAnim( 'actual', 1, [0] );
		this.currentAnim = this.anims.actual;
	},

	check: function(other) {
		// if player is close AND action button pressed
		// open dialogue
		if(other && other instanceof EntityPlayer) {
			if(ig.input.state("action")) {
				var item = {
					name: this.itemname,
					value: this.itemvalue
				}
				ig.game.state.inventory.push(item)
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