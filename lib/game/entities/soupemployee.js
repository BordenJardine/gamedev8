ig.module(
	'game.entities.soupemployee'
)
.requires(
	'game.entities.baddy'
)
.defines(function() {
EntitySoupemployee = EntityBaddy.extend({

	animSheet: new ig.AnimationSheet('media/soupemp.png', 32, 32),

	other: undefined,

	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.dialogKey = 6;
		this.showAlert = false;

		// Worse vision than baddies
		this.fovRads = 60;
		this.fovDistance = 100;
		this.fovDrawDistance = 100;

		// Slower than baddies
		this.baseSpeed = 50;
		this.runSpeed = 100;
	},

	ready: function() {
		this.talkImage = (this.talkImage == undefined) ? 1 : this.talkImage;
		this.parent();
	},

	check: function(other) {
		if(other && other instanceof EntityPlayer) {
			this.other = other;
			this.stopPursuit();

			if(!this.dialogActive) {
				this.eventChain = this.eventChainGenerator.getChain(this.dialogKey, this);
				this.dialogActive = true;
			}

		}
		this.parent(other);
	},


	update: function() {
		if(this.dialogCompleted && this.other != undefined) {
			var cp = ig.game.getEntityByName(ig.game.state.currentCheckpoint);
			this.other.pos.x = cp.pos.x;
			this.other.pos.y = cp.pos.y;
			this.dialogActive = false;
			this.dialogCompleted = false;
		}

		this.parent();
	}
});

});
