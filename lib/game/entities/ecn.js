ig.module(
	'game.entities.ecn'
)
.requires(
	'game.entities.baddy'
)
.defines(function() {
EntityEcn = EntityBaddy.extend({

	animSheet: new ig.AnimationSheet('media/ecn.png', 32, 32),

	other: undefined,

	init: function(x, y, settings) {
		this.parent(x, y, settings);
		this.dialogKey = 21;
		this.showAlert = false;

		this.baseSpeed = 100;
		this.runSpeed = 250;
		
	},

	ready: function() {
		this.talkImage = (this.talkImage == undefined) ? 6 : this.talkImage;
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
