ig.module(
	'game.entities.soupemployee'
)
.requires(
	'game.entities.baddy'
)
.defines(function() {
EntitySoupemployee = EntityBaddy.extend({

	animSheet: new ig.AnimationSheet('media/baddy.png', 32, 32),

	hostile: false,
	other: undefined,

	init: function(x, y, settings) {

		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'run', .05, [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15] );

		this.specialDialogKey = 3;
		this.triggerOnEntry = false;

		this.fovRads = this.fovRads/ig.global.TO_RADS,
		this.parent(x, y, settings);
	},


	ready: function() {
		if(this.target == undefined) this.target = ig.game.getEntitiesByType(EntityPlayer)[0];
		this.parent();
	},


	drawFOV: function() {
		return;
	},


	draw: function() {
		this.drawFOV();
		this.parent();
	},

	behave: function() {
		this.patrol();
	},

	trace: function(x0, y0, x1, y1) {
		if(ig.game.collisionMap == undefined) return {collision: {x: false, y: false}};
		return ig.game.collisionMap.trace(x0, y0, x1 - x0, y1 - y0, 1, 1);
	},

	check: function(other) {
		if(other && other instanceof EntityPlayer) {
			//kick player out and say something
			this.other = other;

			if(!this.specialDialogActive) this.specialDialogActive = true;
			else {
				other.pos.x = ig.game.state.currentCheckpoint.pos.x;
				other.pos.y = ig.game.state.currentCheckpoint.pos.y;
			}
		}
		this.parent(other);
	},

	update: function() {
		if(this.specialDialogCompleted) {
			this.other.pos.x = ig.game.state.currentCheckpoint.pos.x;
			this.other.pos.y = ig.game.state.currentCheckpoint.pos.y;
			this.specialDialogCompleted = false;
		}

		if( this.vel.x != 0 || this.vel.y != 0 ) {
			this.currentAnim = this.anims.run;
		} else {
			this.currentAnim = this.anims.idle;
		}

		this.behave();
		this.parent();
	}
});

});
