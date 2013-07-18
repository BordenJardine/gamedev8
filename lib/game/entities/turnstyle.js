/*
	Basic enemy class

	Doesn't do anything yet
*/
ig.module(
	'game.entities.turnstyle'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityTurnstyle = ig.Entity.extend({

	size: {x: 32, y:16},
	zindex: 2,

	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.BOTH,
	collides: ig.Entity.COLLIDES.FIXED,

	changing: false,
	open: false,
	openSpeed: .1,

	animSheet: new ig.AnimationSheet( 'media/turn.png', 32, 16 ),

	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		this.addAnim( 'idle', 1, [0] );
		this.currentAnim = this.anims.idle;

	},


	check:function(other) {
		if(other && other instanceof EntityPlayer) {
			if(ig.input.released('action') && !this.changing && ig.game.inventory.searchInventory('metrocard')) {
                ig.game.inventory.removeFromInventory(ig.game.inventory.searchInventory('metrocard'));
				this.collides = ig.Entity.COLLIDES.PASSIVE;
				this.changing = true;
			}
		}
		this.parent(other);
	}
});

});
