/*
	HYPERSPACE BETH
*/
ig.module(
	'game.entities.hb2'
)
.requires(
	'impact.entity',
	'game.entities.specialnpc'
)
.defines(function(){

EntityHb2 = EntitySpecialnpc.extend({

	health: 9999,
	animSheet: new ig.AnimationSheet('media/hb.png', 32, 32),

	runspeed: 100,

	pursueLimit: 999999,
	recheckLimit: 1,

	dialogKeys: {
		0: {
			dialog: 32,
			type: 'completeOtherObj',
			objective: 'Infiltrate NSA and rescue Hyperspace Beth'
		},
		1: {
			dialog: 32,
			type: 'flagCompletion',
			flag: 'prismdead',
			objective: 'Kill PRISM'
		},
		2: {
			dialog: 31,
			type: 'flagCompletion',
			flag: 'escape',
			objective: "ESCAPE"
		}
	},



	init: function( x, y, settings ) {
		this.talkImage = 3;
		this.parent( x, y, settings );
	},


	ready: function() {
		this.target = ig.game.getEntitiesByType(EntityPlayer)[0];
		this.showAlert = true;
		this.parent();
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


	finalTalk: function() {
		this.eventChain = this.eventChainGenerator.getChain(31, this);
		this.dialogActive = true;
	},


	check: function(other) {
		if (other && other instanceof EntityPlayer && this.following) {
			this.pos.x = this.lastPos.x;
			this.pos.y = this.lastPos.y;
		}

		this.parent(other);
	},


	update: function() {
		if (this.following) {
			this.followPlayer();
			this.lastPos.x = this.pos.x;
			this.lastPos.y = this.pos.y;
		}
		if (ig.game.state.flags.indexOf('prismfight') > -1) {
			this.following = false;
			this.pos.x = this.lastPos.x;
			this.pos.y = this.lastPos.y;
			console.log('here');
		}
		if (ig.game.state.flags.indexOf('prismdead') > -1 && !this.following) {
			this.showAlert = true;
			this.dialogKey = 31;
			this.following = true;
		}

		this.parent();
	},


	dialogFinished: function() {
		if (!this.following) {
			this.following = true;
			this.dialogKey = undefined;
			this.dialogActive = false;
			this.lastPos = { x: this.pos.x, y: this.pos.y};
		}
		this.parent();
	}


});

});
