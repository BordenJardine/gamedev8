/*
	Basic enemy class

	Doesn't do anything yet
*/
ig.module(
	'game.entities.cloud'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityCloud = ig.Entity.extend({

	size: {x: 0, y:0},
	zindex: 50,

	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.NONE,
	collides: ig.Entity.COLLIDES.NEVER,

	animSheet: new ig.AnimationSheet( 'media/testcloud.png', 500, 100 ),

	speed: {
		x: Math.floor((Math.random()*55) + 25),
		y: Math.floor((Math.random()*10) + 1)
	},

	init: function( x, y, settings ) {
		var x = -520;
		var y = Math.floor((Math.random()*768) + 1);

		// Add the animations
		cloud = Math.floor(Math.random()*4);

		this.addAnim( 'idle', 1, [cloud] );
		this.currentAnim = this.anims.idle;
		this.parent( x, y, settings );
	},


	update: function() {

		this.vel.x = this.speed.x;
		this.vel.y = this.speed.y;

		this.parent();
	},

	handleMovementTrace: function(res) {
	    this.pos.x += this.vel.x * ig.system.tick;
	    this.pos.y += this.vel.y * ig.system.tick;
	}
});

});
