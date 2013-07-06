/*
	NPC Entity

	Placed via Weltmeister (WM)
	If dialog needed, add dialogKey value to NPC in WM (the value of which is determined in /lib/game/classes/dialog.js.

	TODO - allow level designer to change NPC image by using image property in Welt (easy)
	TODO - hook up with Matt's enemy pathing code

*/
ig.module(
	'game.entities.specialnpc'
)
.requires(
	'game.entities.npc',
	'game.classes.wordwrap',
	'game.system.eventChain'
)
.defines(function(){

EntitySpecialnpc = EntityNpc.extend({

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
	},

	ready: function() {
		var self = this;

		for(var i = 0; i < ig.game.npcState.length; i++) {
			if(ig.game.npcState[i] == self.name) {
				this.dialogCompleted = true;
			}
		}
		/*
		// Set up NPCs dialog chain
		this.dialogs = ig.game.dialog.fillPages.getDialog(this.dialogKey);
		this.numDialogs = this.dialogs.length;
		this.dialogIdx = 0;
		this.dialogTimer = new ig.Timer();

		this.dialogChain = EventChain(this)
			.wait(.1)
			.then(function() {
				ig.game.unbindKeys();
				ig.game.counter = 0;
				ig.game.dialog.pages.push(self.dialogs[self.dialogIdx]);
				self.dialogTimer.set(.5);
			})
			.wait()
			.orUntil(function() {
				if(self.dialogTimer.delta() < 0) {
					return false
				} else {
					return ig.input.state('action');
				}
			})
			.then(function() {
				ig.game.dialog.pages.pop();
				self.dialogIdx += 1;
				if(self.dialogIdx === self.numDialogs) {
					self.dialogActive = false;
					if(!self.dialogCompleted){
						ig.game.bindKeys();
						self.dialogCompleted = true;
						ig.game.npcState.push(self.name);
					}
				}
			})
			.repeat(self.numDialogs)
			*/
			this.parent();
	},

	check: function(other) {
		this.parent();
	},

	update: function() {
		this.parent();
	},

	draw: function() {
		this.parent();
	}
});

});
