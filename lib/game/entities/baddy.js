
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
	hostile: true,
	target: undefined,

	fovRads: 90/TO_RADS,
	fovDistance: 200,
	fovColor: "rgba(200,255,200,0.2)",
	minDetectionDistance: 40,

	init: function(x, y, settings) {

		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'run', 0.07, [0,1,2] );

		this.parent(x, y, settings);
	},


	ready: function() {
		if(this.target == undefined) this.target = ig.game.getEntitiesByType(EntityPlayer)[0];

		this.parent();
	},


	drawFOV: function(){
		var x = ig.system.getDrawPos(this.pos.x) - ig.game.screen.x + this.size.x/2,
			y = ig.system.getDrawPos(this.pos.y) - ig.game.screen.y + this.size.y/2;

		var halfFov = this.fovRads/2;
		var angle = this.currentAnim.angle - (90/TO_RADS);  //why the hell do I have to add 90 degrees here?!
		var lx = (Math.cos(angle - halfFov) * this.fovDistance) + x,
			 ly = (Math.sin(angle - halfFov) * this.fovDistance) + y,
			 rx = (Math.cos(angle + halfFov) * this.fovDistance) + x,
			 ry = (Math.sin(angle + halfFov) * this.fovDistance) + y;

		var lTrace = this.trace(
			x + ig.game.screen.x,
			y + ig.game.screen.y,
			lx + ig.game.screen.x,
			ly + ig.game.screen.y
		);
		var rTrace = this.trace(
			x + ig.game.screen.x,
			y + ig.game.screen.y,
			rx + ig.game.screen.x,
			ry + ig.game.screen.y
		);

		if(lTrace.collision.x || lTrace.collision.y) {
			 lx = lTrace.pos.x - ig.game.screen.x;
			 ly = lTrace.pos.y - ig.game.screen.y;
		}
		if(rTrace.collision.x || rTrace.collision.y) {
			 rx = rTrace.pos.x - ig.game.screen.x;
			 ry = rTrace.pos.y - ig.game.screen.y;
		}

		var ctx = ig.system.context;
		var my_gradient=ctx.createRadialGradient(x, y, 0, x, y, this.fovDistance);
		my_gradient.addColorStop(0, this.fovColor);
		my_gradient.addColorStop(1, "rgba(255,255,255,0.0)");
		ctx.fillStyle=my_gradient;
		ctx.beginPath();
		ctx.lineTo(x, y);
		ctx.lineTo(lx, ly);
		ctx.lineTo(rx, ry);
		ctx.closePath();
		ctx.fill();
	},


	draw: function(){
		this.drawFOV();
		this.parent();
	},


	pursueTarget: function(target){
		if(target != undefined) this.target = target;
		this.behavior = 'pursue';
	},


	spotTarget: function(target){
		if(target == undefined) target = this.target;

		var distance = this.distanceTo(target);
		if (distance > this.fovDistance) return false;
		if (distance <= this.minDetectionDistance) return true;

		var target_angle = this.angleTo(target);
		var current_angle = this.currentAnim.angle - (90/TO_RADS);  //why the hell do I have to add 90 degrees here?!
		var halfFov = this.fovRads/2;
		var lAngle = current_angle - halfFov,
			rAngle = current_angle + halfFov;
		if(target_angle < lAngle || target_angle > rAngle) return false;

		trace = this.trace(
			this.pos.x + this.size.x / 2,
			this.pos.y + this.size.y / 2,
			target.pos.x + target.size.x / 2,
			target.pos.y + target.size.y / 2
		);
		if (trace.collision.x == false && trace.collision.y == false) return true;

		return false;
	},

	trace: function(x0, y0, x1, y1){
		return ig.game.collisionMap.trace(x0, y0, x1 - x0, y1 - y0, 1, 1);
	},


	update: function(){
		if( this.vel.x != 0 || this.vel.y != 0 ) {
			this.currentAnim = this.anims.run;
		} else {
			this.currentAnim = this.anims.idle;
		}
		this.currentAnim.angle = this.facing;

		// ENEMY AI HERE!
		if(this.behavior == 'patrol') this.followRoute();
		if(this.behavior == 'pursue') {
			this.pathToTarget();
			this.fovColor = "rgba(255,200,200,0.2)";
		}

		if(this.behavior != 'pursue' && this.hostile && this.spotTarget()) this.pursueTarget();

		this.parent();
	}
});

});
