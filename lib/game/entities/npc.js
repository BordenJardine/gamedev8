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
	'game.entities.smart',
	'game.classes.wordwrap',
	'game.system.eventChain'
)
.defines(function(){

EntityNpc = EntitySmart.extend({

	size: {x: 32, y:32},

	maxVel: {x: 100, y: 100},
	friction: {x: 1000, y: 1000},

	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,

	animSheet: new ig.AnimationSheet('media/npc.png', 32, 32),

	health: 10,
	flipx: false,
	flipy: false,

	// Variable for dialog
	dialogActive: false,
	dialogCompleted: false,
	dialogTimer: undefined,
	alertImage: new ig.AnimationSheet('media/npcalert.png', 5, 14),
	talkImage: new ig.Image('media/hobochat.png', 98, 98),

	init: function( x, y, settings ) {
		// Add the animations
		this.alertAnim = new ig.Animation(this.alertImage, 0.1, [0,1]);
		this.addAnim( 'idle', 1, [0] );

		this.parent( x, y, settings );
	},

	ready: function() {
		var self = this;

		for(var i = 0; i < ig.game.npcState.length; i++) {
			if(ig.game.npcState[i] == self.name) {
				this.dialogCompleted = true;
			}
		}

        // Set up NPC image
        // Here the actual values are set via values set in Weltmeister
        this.animSheet = new ig.AnimationSheet('media/'+this.image+'.png', 32, 32);
        this.addAnim( 'actual', 1, [0] );
        this.currentAnim = this.anims.actual;
        if(this.angle != undefined) this.currentAnim.angle = this.angle;

        if(this.dialogKey) {
			// Set up NPCs dialog chain
			this.dialogs = ig.game.dialog.fillPages.getDialog(this.dialogKey);
			this.numDialogs = this.dialogs.length;
			this.dialogIdx = 0;
			this.dialogTimer = new ig.Timer();

			this.dialogChain = EventChain(this)
				.wait(.1)
				.then(function() {
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
							self.dialogCompleted = true;
							ig.game.npcState.push(self.name);
						}
					}
				})
				.repeat(self.numDialogs)
		}
	this.parent();
	},

	check: function(other) {
		// if player is close AND action button pressed
		// open dialogue
		if(other && other instanceof EntityPlayer && !(this instanceof EntityBaddy)) {
			if(ig.input.state("action")) {
				this.dialogActive = true;
				ig.game.talker = this.talkImage;
			}
		}
		this.parent();
	},

	update: function() {
		if(this.dialogActive) {
			this.dialogChain();
		}
		if(!this.dialogCompleted) {
			this.alertAnim.update();
		}
		this.parent();
	},

	draw: function() {
		if(this.dialogKey > 0 && !this.dialogCompleted) {
			this.alertAnim.draw(this.pos.x - ig.game.screen.x + this.size.x / 2.5, this.pos.y - ig.game.screen.y - this.size.y / 2);
		}
		this.parent();
	}
});

});
