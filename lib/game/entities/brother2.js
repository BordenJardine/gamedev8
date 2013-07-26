ig.module(
	'game.entities.brother2'
)
.requires(
	'impact.entity',
	'game.entities.npc'
)
.defines(function(){

EntityBrother2 = EntityNpc.extend({

	health: 999,

	animSheet: new ig.AnimationSheet('media/npc.png', 32, 32),
	alertImage: new ig.AnimationSheet('media/npcalert.png', 5, 14),


	init: function( x, y, settings ) {
		this.parent( x, y, settings );
	},


	ready: function() {
		this.target = ig.game.getEntitiesByType(EntityPlayer)[0];
		this.showAlert = true;
		this.parent();
	},


	check: function(other) {
		if(other && other instanceof EntityPlayer && this.dialogKey != undefined) {
			if(ig.input.state("action") && !this.dialogActive) {
				if(this.dialogKey) this.eventChain = this.eventChainGenerator.getChain(this.dialogKey, this, this.scriptedItemNum);
				this.dialogActive = true;
			}
		}
		this.parent(other);
	},


	followPlayer: function() {
		if (this.target == undefined) this.target = ig.game.getEntitiesByType(EntityPlayer)[0];
		this.pos.x = this.target.pos.x + 12;
		this.pos.y = this.target.pos.y + 12;
		this.facing = this.angleTo(this.target);
		//this.facing = this.headingToRad();
	},


	update: function() {
		if(this.dialogActive) this.eventChain();
		if(this.showAlert) this.alertAnim.update();

		if (this.following) this.followPlayer();

		if(this.vel.x != 0 || this.vel.y != 0) this.currentAnim = this.anims.run;

		this.parent();
	},


	dialogFinished: function() {
		this.collides = ig.Entity.COLLIDES.PASSIVE,
		this.following = true;
		this.dialogKey = undefined;
		this.dialogActive = false;
	}
});

});
