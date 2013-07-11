/*
	Basic enemy class

	Doesn't do anything yet
*/
ig.module(
	'game.entities.door'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityDoor = ig.Entity.extend({

	size: {x: 8, y:40},
	zindex: 2,

	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.BOTH,
	collides: ig.Entity.COLLIDES.FIXED,

	changing: false,
	open: false,
	openSpeed: .1,

	animSheet: new ig.AnimationSheet( 'media/simpledoor.png', 8, 40 ),

	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		this.addAnim( 'idle', 1, [0] );
		this.currentAnim = this.anims.idle;

		this.startingAngle = this.currentAnim.angle;
		this.endingAngle = this.currentAnim.angle + (Math.PI/2);
	},

	ready: function() {
		this.currentAnim.pivot.x = 0;
		this.currentAnim.pivot.y = 0;
	},

	check:function(other) {
		if(other && other instanceof EntityPlayer) {
			if(ig.input.released('action') && !this.changing) {
				this.collides = ig.Entity.COLLIDES.PASSIVE;
				this.changing = true;
			}
		}
		this.parent(other);
	},

	update: function() {
		this.parent();
		if(this.changing) {
			if(this.open) this.currentAnim.angle -= this.openSpeed;
			else this.currentAnim.angle += this.openSpeed;

			if(this.currentAnim.angle >= this.endingAngle) {
				this.changing = false;
				this.open = true;
			} else if(this.currentAnim.angle <= this.startingAngle) {
				this.changing = false;
				this.open = false;
				this.collides = ig.Entity.COLLIDES.FIXED;
			}
		}
	}
});

});
