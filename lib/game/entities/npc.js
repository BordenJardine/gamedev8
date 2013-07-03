/*
	NPC Entity

	Placed via Weltmeister (WM)
	If dialog needed, add dialogKey value to NPC in WM (the value of which is determined in /lib/game/classes/dialog.js.

	TODO - allow level designer to change NPC image by using image property in Welt (easy)
	TODO - hook up with Matt's enemy pathing code

*/
ig.module(
	'game.entities.npc'
)
.requires(
	'impact.entity',
	'game.classes.wordwrap',
	'game.system.eventChain'
)
.defines(function(){

EntityNpc = ig.Entity.extend({

	size: {x: 16, y:16},

	maxVel: {x: 100, y: 100},
	friction: {x: 1000, y: 1000},

	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,

	animSheet: new ig.AnimationSheet( 'media/npc.png', 16, 16 ),

	health: 10,
	flipx: false,
	flipy: false,

	// Variable for dialog
	dialogActive: false,
	dialogCompleted: false,
	dialogTimer: undefined,
	alertImage: new ig.AnimationSheet('media/npcalert.png', 3, 14),

	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		// Add the animations
		this.alertAnim = new ig.Animation(this.alertImage, 0.1, [0,1]);
		this.addAnim( 'idle', 1, [0] );
	},

	ready: function() {
		var self = this;

		// Set up NPCs dialog chain
		this.dialogs = ig.game.dialog.fillPages.getDialog(this.dialogKey);
		this.numDialogs = this.dialogs.length;
		this.dialogIdx = 0;
		this.dialogTimer = new ig.Timer();

		/*
		    NOTE: Will probably need to set up a separate EventChain if
		                   we want the user to be able to select responses / input.
		                   I don't think it would be too hard -- would just need an
		                   if statement here and another flag on NPCS (e.g. key: reponse, value: 1 or 0)
		*/
		this.dialogChain = EventChain(this)
			.wait(.1)
			.then(function() {
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
					self.dialogCompleted = true;
				}
			})
			.repeat(self.numDialogs)
	},

	check: function(other) {
		// if player is close AND action button pressed
		// open dialogue
		if(other && other instanceof EntityPlayer) {
			if(ig.input.state("action")) {
				this.dialogActive = true;
			}
		}
	},

	update: function() {
		if(this.dialogActive) {
			this.dialogChain();
		}
		this.alertAnim.update();
		this.parent();
	},

	draw: function() {
		this.parent();
		if(this.dialogKey > 0 && !this.dialogCompleted) {
			this.alertAnim.draw(this.pos.x-ig.game.screen.x +6, this.pos.y-ig.game.screen.y-16);
		}
	}
});

});
