ig.module(
	'game.entities.soupemployee'
)
.requires(
	'game.entities.baddy'
)
.defines(function() {
EntitySoupemployee = EntityBaddy.extend({

	animSheet: new ig.AnimationSheet('media/baddy.png', 32, 32),

	other: undefined,

	init: function(x, y, settings) {

		this.specialDialogKey = 3;
		this.triggerOnEntry = false;

		this.parent(x, y, settings);
	},


	ready: function() {
		if(this.target == undefined) this.target = ig.game.getEntitiesByType(EntityPlayer)[0];
		this.parent();
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
			this.stopPursuit();
		}
		this.parent(other);
	},

	update: function() {
		if(this.specialDialogCompleted) {
			this.other.pos.x = ig.game.state.currentCheckpoint.pos.x;
			this.other.pos.y = ig.game.state.currentCheckpoint.pos.y;
			this.specialDialogCompleted = false;
		}

		console.log(this.route.waypoints.length);
		this.parent();
	}
});

});
