
ig.module(
	'game.entities.baddy'
)
.requires(
	'impact.entity',
	'game.classes.route'
)
.defines(function(){

EntityBaddy = EntityRoutable.extend({

	size: {x: 32, y:32},

	movementSpeed: 100,
	friction: {x: 1000, y: 1000},

	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.ACTIVE,

	animSheet: new ig.AnimationSheet('media/baddy.png', 32, 32),

	// These are our own properties. They are not defined in the base
	health: 5,

	fovRads: 45,
	fovDistance: 100,

	init: function(x, y, settings) {

		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'run', 0.07, [0,1,2] );

		this.parent(x, y, settings);
	},




	drawFOV: function(){
		var x = ig.system.getDrawPos(this.pos.x) - ig.game.screen.x + this.size.x/2,
			y = ig.system.getDrawPos(this.pos.y) - ig.game.screen.y + this.size.y/2;

		var halfFov = this.fovRads/2;
		var angle = this.currentAnim.angle + (90/TO_RADS); //why the hell do I have to add 90 degrees here?!
		var lx = (Math.cos(angle - halfFov) * this.fovDistance) + x,
			 ly = (Math.sin(angle - halfFov) * this.fovDistance) + y,
			 rx = (Math.cos(angle + halfFov) * this.fovDistance) + x,
			 ry = (Math.sin(angle + halfFov) * this.fovDistance) + y;

		ig.system.context.strokeStyle = "lightgreen";
		ig.system.context.beginPath();
		ig.system.context.moveTo(x, y);
		ig.system.context.lineTo(lx, ly);
		ig.system.context.moveTo(x, y);
		ig.system.context.lineTo(rx, ry);
		ig.system.context.stroke();
	},


	draw: function(){
		this.drawFOV();
		this.parent();
	},


	update: function(){
		if( this.vel.x != 0 || this.vel.y != 0 ) {
			this.currentAnim = this.anims.run;
		} else {
			this.currentAnim = this.anims.idle;
		}

		// ENEMY AI HERE!
		if(this.behavior == 'patrol') this.followRoute();
		if(this.behavior == 'pursue') this.pathToTarget();

		this.currentAnim.angle = this.facing;
		this.parent();
	}
});

});
