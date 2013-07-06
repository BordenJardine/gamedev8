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

		// Just so we don't show the alert
		this.dialogCompleted = true;
		this.specialDialogCompleted = false;

		for(var i = 0; i < ig.game.npcState.length; i++) {
			if(ig.game.npcState[i] == self.name) {
				this.specialDialogCompleted = true;
			}
		}

		// Set up NPCs dialog chain
		this.specialDialogs = ig.game.dialog.fillPages.getSpecialDialog(this.specialDialogKey);
		this.numSpecialDialogs = this.specialDialogs.length;
		this.specialDialogIdx = 0;
		this.specialDialogTimer = new ig.Timer();

		this.specialDialogChain = EventChain(this)
			.wait(.1)
			.then(function() {
				ig.game.unbindKeys();
				ig.game.counter = 0;
				ig.game.dialog.pages.push(self.specialDialogs[self.specialDialogIdx]);
				self.specialDialogTimer.set(.5);
			})
			.wait()
			.orUntil(function() {
				if(self.specialDialogTimer.delta() < 0) {
					return false
				} else {
					return ig.input.state('action');
				}
			})
			.then(function() {
				ig.game.dialog.pages.pop();
				self.specialDialogIdx += 1;
				if(self.specialDialogIdx === self.numSpecialDialogs) {
					self.specialDialogActive = false;
					if(!self.specialDialogCompleted){
						ig.game.bindKeys();
						self.specialDialogCompleted = true;
						ig.game.npcState.push(self.name);
					}
				}
			})
			.repeat(self.numSpecialDialogs)

			this.parent();
	},

	update: function() {
		if(!this.specialDialogCompleted) {
			this.specialDialogChain();
		}
		this.parent();
	},

	draw: function() {
		this.parent();
	}
});

});
