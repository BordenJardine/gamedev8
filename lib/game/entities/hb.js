/*
	HYPERSPACE BETH
*/
ig.module(
	'game.entities.hb'
)
.requires(
	'impact.entity',
	'game.entities.npc'
)
.defines(function(){

EntityHb = EntityNpc.extend({

	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,

	health: 9999,

	pointReached: false,
	pathInit: true,

	dialogKeys: {
		0: {
			dialog: 7,
			type: 'default',
			questItem: undefined
		},
		1: {
			dialog: 8,
			type: 'default',
			questItem: undefined
		},
		2: {
			dialog: 9,
			type: 'itemCompletion',
			questItem: 'Orgone'
		}
	},
	dialogIdx: 0,
	checkForItem: false,

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.talkImage = 3;
	},

	ready: function() {
		this.route = this.name;
		this.route_type = 'toPoint';
		this.createRoute();
		this.behavior = 'manual';

		this.showAlert = false;

		this.parent();
	},

	dialogFinished: function() {
		if(this.dialogIdx >= (Object.keys(this.dialogKeys).length - 1) || this.dialogIdx < 0) {
			return;
		} else {
			var nextDialog = this.dialogKeys[this.dialogIdx+1];
			if (nextDialog.type === 'default') this.dialogIdx++;
			else if (nextDialog.type === 'itemCompletion') {
				this.checkForItem = true;
			}
		}
	},

	scriptedMove: function() {
		if(this.pathInit) {
			this.pointReached = false;
			this.pathInit = false;
		}

		var target = this.route.currentWaypoint();
		this.pathToTarget(target);

		return this.pointReached;
	},

	reachWaypoint: function(waypoint){
		this.pointReached = true;
	},

	check: function(other) {
		if(this.checkForItem) {
			var nextDialog = this.dialogKeys[this.dialogIdx+1];
			for(var i = 0; i < ig.game.state.inventory.length; i++) {
				if(ig.game.state.inventory[i].name == nextDialog.questItem) {
					this.dialogIdx++;
					this.checkForItem = false;
				}
			}
		}
		this.dialogKey = this.dialogKeys[this.dialogIdx].dialog;

		this.parent(other);
	},

	update: function() {
		this.facing = this.headingToRad();
		this.parent();
	}
});

});
