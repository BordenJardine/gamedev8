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
		this.parent(x, y, settings);
		this.dialogKey = 6;
		this.showAlert = false;
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
		if(this.dialogCompleted) {
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
