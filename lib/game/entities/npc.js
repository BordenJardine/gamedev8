/*
	NPC Entity

	If dialog needed, add dialogKey value to NPC in WM (the value of which is determined in /lib/game/classes/dialog.js.

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

	// everything should be able to pass through a tile width, no?
	size: {x: 30, y:30},

	maxVel: {x: 100, y: 100},
	friction: {x: 1000, y: 1000},

	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,

	health: 10,
	panhandled: false,

	animSheet: new ig.AnimationSheet('media/npc.png', 32, 32),
	alertImage: new ig.AnimationSheet('media/npcalert.png', 5, 14),

	eventChain: undefined,
	eventChainGenerator: undefined,
	showAlert: false,
	dialogOverwrite: false,


	init: function( x, y, settings ) {
		this.alertAnim = new ig.Animation(this.alertImage, 0.1, [0,1]);
		this.addAnim( 'idle', .75, [0,1,2,3,4,5,6,7,8,9,10,11,12] );
		this.addAnim( 'run', .11, [12,13,14,15,16,17,18,19,21,21,22,23] );
		this.currentAnim = this.anims.idle;

		this.parent( x, y, settings );
	},


	ready: function() {
		// If we've already talk to the NPC, we shut off triggered dialog, and set
		// dialogCompleted to true
		if(ig.game.npcState.indexOf(this.name) > -1) {
			this.dialogCompleted = true;
			this.showAlert = false;
			this.triggeredDialogKey = undefined;
		}

		if(this.collidable == 'true') this.collides = ig.Entity.COLLIDES.FIXED;
		if(this.hideAlert == 'false') this.showAlert = true;
		if(this.talkImage === undefined) this.talkImage = 2;

		this.eventChainGenerator = new EventGenerator();

		if(this.triggeredDialogKey !== undefined) {
			this.eventChain = this.eventChainGenerator.getChain(this.triggeredDialogKey, this);
			this.dialogActive = true;
			this.dialogCompleted = true;
		}
		else if (this.dialogKey) this.eventChain = this.eventChainGenerator.getChain(this.dialogKey, this, this.scriptedItemNum);

		if(this.image !== undefined) {
			this.animSheet = new ig.AnimationSheet('media/'+this.image+'.png', 32, 32);
			this.addAnim( 'run', .11, [12,13,14,15,16,17,18,19,21,21,22,23] );
			this.addAnim( 'idle', .75, [0,1,2,3,4,5,6,7,8,9,10,11,12] );
			this.currentAnim = this.anims.idle;
		}

		this.parent();
	},


	check: function(other) {
		if(other && other instanceof EntityPlayer && this.dialogKey != undefined && !this.following) {
			if(ig.input.state("action") && !this.dialogActive) {
				if(this.dialogKey) this.eventChain = this.eventChainGenerator.getChain(this.dialogKey, this, this.scriptedItemNum);
				this.dialogActive = true;
			}
		}
		this.parent(other);
	},


	requestMoney: function() {
		if (this.canPanhandle === "true" && !this.panhandled) {
			var hasMoney = (Math.random() > .3) ? true : false;
			if (hasMoney && Math.random() < .1) ig.game.state.money += .50;
			else if(hasMoney) ig.game.state.money += Math.random() * .25 + .10;

			this.panhandled = true;
		} else{
			hasMoney = false;
		}
		var panHandleDialog = (hasMoney) ? 18 : 19;
		this.eventChain = this.eventChainGenerator.getChain(panHandleDialog, this, this.scriptedItemNum);
		this.dialogActive = true;
	},


	update: function() {
		if(this.dialogActive) this.eventChain();
		if(this.showAlert) this.alertAnim.update();

		if(this.vel.x != 0 || this.vel.y != 0) this.currentAnim = this.anims.run;
		else if(!this.shooting) this.currentAnim = this.anims.idle;

		this.parent();
	},


	dialogFinished: function() {
		if(this.killDialog !== undefined) {
			var player = ig.game.getEntitiesByType(EntityPlayer)[0];
			player.deathFade();
		}
	},


	draw: function() {
		if(this.dialogKey > 0 && this.showAlert) {
			this.alertAnim.draw(this.pos.x - ig.game.screen.x + this.size.x / 2.5, this.pos.y - ig.game.screen.y - this.size.y / 2);
		}
		this.parent();
	}
});

});
