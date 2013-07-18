ig.module(
	'game.entities.baddy'
)
.requires(
	'game.entities.npc'
)
.defines(function() {
EntityBaddy = EntityNpc.extend({

	size: {x: 32, y:32},

	friction: {x: 1000, y: 1000},

	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.ACTIVE,

	animSheet: new ig.AnimationSheet('media/baddy.png', 32, 32),

	// These are our own properties. They are not defined in the base
	health: 5,

	fovRads: 75,
	fovDistance: 200,
	fovDrawDistance: 100,

	alertLevel: 0,
	pursuitLimit: 10,
	searchLimit: 10,
	hostile: true,
	minDetectionDistance: 50,


	init: function(x, y, settings) {
		this.fovRads = this.fovRads/ig.global.TO_RADS,
		this.parent(x, y, settings);
	},


	ready: function() {
		if(this.target == undefined) this.target = ig.game.getEntitiesByType(EntityPlayer)[0];

		this.parent();
	},


	drawFOV: function() {
		var	x = ig.system.getDrawPos(this.pos.x) - ig.game.screen.x + this.size.x/2,
			y = ig.system.getDrawPos(this.pos.y) - ig.game.screen.y + this.size.y/2;

		var fovColor = (this.alertLevel) ? "rgba(255,200,200,0.4)" : "rgba(200,255,200,0.4)";

		var halfFov = this.fovRads/2;
		var angle = this.currentAnim.angle;
		var lx = (Math.cos(angle - halfFov) * this.fovDrawDistance) + x,
			 ly = (Math.sin(angle - halfFov) * this.fovDrawDistance) + y,
			 rx = (Math.cos(angle + halfFov) * this.fovDrawDistance) + x,
			 ry = (Math.sin(angle + halfFov) * this.fovDrawDistance) + y;

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
		var my_gradient=ctx.createRadialGradient(x, y, 0, x, y, this.fovDrawDistance);
		my_gradient.addColorStop(0, fovColor);
		my_gradient.addColorStop(1, "rgba(255,255,255,0.0)");
		ctx.fillStyle=my_gradient;
		ctx.beginPath();
		ctx.lineTo(x, y);
		ctx.lineTo(lx, ly);
		ctx.lineTo(rx, ry);
		ctx.closePath();
		ctx.fill();
	},


	draw: function() {
		this.drawFOV();
		this.parent();
	},


	trace: function(x0, y0, x1, y1) {
		if(ig.game.collisionMap == undefined) return {collision: {x: false, y: false}};
		return ig.game.collisionMap.trace(x0, y0, x1 - x0, y1 - y0, 1, 1);
	},


	update: function() {
		this.parent();
	}
});

});
