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
	'game.classes.eventchains'
)
.defines(function(){

EntityNpc = EntitySmart.extend({

	size: {x: 32, y:32},

	maxVel: {x: 100, y: 100},
	friction: {x: 1000, y: 1000},

	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,

	health: 10,
	flipx: false,
	flipy: false,

	animSheet: new ig.AnimationSheet('media/npc.png', 32, 32),
	alertImage: new ig.AnimationSheet('media/npcalert.png', 5, 14),
	talkImage: new ig.Image('media/hobochat.png', 98, 98),

	eventChain: undefined,
	eventChainGenerator: undefined,
	showAlert: true,

	init: function( x, y, settings ) {
		this.alertAnim = new ig.Animation(this.alertImage, 0.1, [0,1]);
		this.addAnim( 'idle', 1, [0] );

		this.parent( x, y, settings );
	},

	ready: function() {
		if(ig.game.npcState.indexOf(self.name) > -1) this.dialogCompleted = true;

		this.eventChainGenerator = new EventGenerator(this.questItemNum);

		if(this.triggeredDialogKey) {
			this.eventChain = this.eventChainGenerator.getChain(this.triggeredDialogKey, this);
			this.dialogActive = true;
			this.dialogCompleted = true;
		}
		else if (this.dialogKey) this.eventChain = this.eventChainGenerator.getChain(this.dialogKey, this);

		this.animSheet = new ig.AnimationSheet('media/'+this.image+'.png', 32, 32);
		this.addAnim( 'actual', 1, [0] );
		this.currentAnim = this.anims.actual;

		this.parent();
	},

	check: function(other) {
		if(other && other instanceof EntityPlayer && !(this instanceof EntityBaddy)) {
			if(ig.input.state("action") && !this.dialogActive) {
				if(this.dialogKey) this.eventChain = this.eventChainGenerator.getChain(this.dialogKey, this);
				this.dialogActive = true;
			}
		}
		this.parent(other);
	},

	update: function() {
		if(this.dialogActive) this.eventChain();
		if(!this.showAlert) this.alertAnim.update();

		this.parent();
	},

	draw: function() {
		if(this.dialogKey > 0 && this.showAlert) {
			this.alertAnim.draw(this.pos.x - ig.game.screen.x + this.size.x / 2.5, this.pos.y - ig.game.screen.y - this.size.y / 2);
		}
		this.parent();
	}
});

});
