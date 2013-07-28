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

	runspeed: 100,

	pursueLimit: 999999,
	recheckLimit: 1,


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

		this.pursue(this.target);

	},


	pursueBegin: function() {
		this.movementSpeed = this.runSpeed;
		this.pursuitTimer.set(this.pursuitLimit);
		this.behavior = 'pursue';
	},


	pursue: function(target) {
		this.pursueBegin();
		this.pathToTarget(this.target);
		this.facing = this.angleTo(this.target);
	},


	update: function() {
		if(this.dialogActive) this.eventChain();
		if(this.showAlert) this.alertAnim.update();

		if (this.following) this.followPlayer();

		if(this.vel.x != 0 || this.vel.y != 0 || this.following) this.currentAnim = this.anims.run;

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
