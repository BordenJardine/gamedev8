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

	ready: function() {
		if(this.target == undefined) this.target = ig.game.getEntitiesByType(EntityPlayer)[0];
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
		if(this.dialogCompleted) {
			this.other.pos.x = ig.game.state.currentCheckpoint.pos.x;
			this.other.pos.y = ig.game.state.currentCheckpoint.pos.y;
			this.dialogActive = false;
			this.dialogCompleted = false;
		}

		this.parent();
	}
});

});
