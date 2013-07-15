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
	'game.system.eventChain',
	'game.classes.particleemitter'
)
.defines(function(){

EntityItem = ig.Entity.extend({

	size: {x: 16, y:16},

	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,

	zIndex: 1,
	// for weltmeister -- needs to have an animation that it can draw
	animSheet: new ig.AnimationSheet('media/weltph.png', 16, 16),

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.addAnim( 'idle', 1, [0] );
	},

	ready: function() {
		if(ig.game.itemState.indexOf(this.GUID) > -1) this.kill();

		if(this.image === undefined) this.image = 0;
		// Here the actual values are set via values set in Weltmeister
		this.animSheet = ig.game.itemImages;
		this.addAnim( 'actual', 1, [this.image] );
		this.currentAnim = this.anims.actual;

		this.particles = new ParticleEmitter({
			x: this.pos.x + this.size.x / 2,
			y: this.pos.y + this.size.y / 2,
			type: 'item',
			ttl: 2,
			qty: 3,
			repeat: true,
			repeatTime: 2
		})
	},

	check: function(other) {
		// if player is close AND action button pressed
		// pick up item, and remove itself from the game
		if(other && other instanceof EntityPlayer) {
			if(ig.input.state("action") && (ig.game.state.flags.indexOf('cart') > -1 || this.name == 'cart')) {
				var item = {
					name: this.name,
					value: this.itemvalue,
					scriptedItemNum: (this.scriptedItemNum !== 'undefined') ? this.scriptedItemNum : 0,
					image: this.image,
					itemStrength: this.itemStrength,
					type: this.type,
					removeOnCompletion: this.removeOnCompletion,
					nonInventory: this.nonInventory
				};

				ig.game.inventory.addToInventory(item, this.GUID);
				this.kill();
			}
		}
	},

	update: function() {
		if(this.particles) this.particles.emitParticles();
		this.parent();
	},

	draw: function() {
		this.parent();
	}
});

});
