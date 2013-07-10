/*
	HYPERSPACE BETH
*/
ig.module(
	'game.entities.specialnpc'
)
.requires(
	'impact.entity',
	'game.entities.npc'
)
.defines(function(){

EntitySpecialnpc = EntityNpc.extend({

	type: ig.Entity.TYPE.A,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,

	pointReached: false,
	pathInit: true,

	dialogKeys: {
	},

	dialogIdx: 0,
	dialogChangeTrigger: undefined,

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
	},

	ready: function() {
		this.route = this.name;
		this.route_type = 'toPoint';
		this.createRoute();
		this.behavior = 'manual';

		if(this.talkimage === undefined) this.talkimage = 0;

		this.loadFromState();

		if(this.dialogKeys[this.dialogIdx].scriptedItemNum != undefined) this.scriptedItemNum = this.dialogKeys[this.dialogIdx].scriptedItemNum;

		this.parent();
	},

	saveState: function() {
		for (var i = 0; i < ig.game.questNpcState.length; i++) {
			var npc = ig.game.questNpcState[i];
			if (npc.name == this.name) {
				npc.pos.x = this.pos.x;
				npc.pos.y = this.pos.y
				npc.dialogIdx = this.dialogIdx;
				npc.dialogKey = this.dialogKeys[this.dialogIdx].dialog;
				npc.dialogChangeTrigger = this.dialogChangeTrigger;

				return;
			}
		}

		ig.game.questNpcState.push({
			name: this.name,
			pos: {
				x: this.pos.x,
				y: this.pos.y
			},
			dialogIdx: this.dialogIdx,
			dialogKey: this.dialogKeys[this.dialogIdx].dialog,
			dialogChangeTrigger: this.dialogChangeTrigger
		});
	},

	loadFromState: function() {
		for (var i = 0; i < ig.game.questNpcState.length; i++) {
			var npc = ig.game.questNpcState[i];
			if (npc.name == this.name) {
				this.pos.x = npc.pos.x;
				this.pos.y = npc.pos.y;
				this.dialogIdx = npc.dialogIdx;
				this.dialogKey = npc.dialogKey;
				this.dialogChangeTrigger = npc.dialogChangeTrigger;
				return;
			}
		}
	},

	dialogFinished: function() {
		if(this.dialogIdx >= (Object.keys(this.dialogKeys).length - 1) || this.dialogIdx < 0) {
			return;
		} else {
			var nextDialog = this.dialogKeys[this.dialogIdx+1];
			if (nextDialog.scripedItemNum !== undefined) this.scripedItemNum = nextDialog.scriptedItemNum;
			if(nextDialog.hasPopup !== undefined && nextDialog.hasPopup == true) ig.game.newPopup(nextDialog.popup);
			if(nextDialog.setFlag !== undefined) {
				ig.game.state.flags.push(nextDialog.setFlag);
				if(nextDialog.setFlag == 'map') {
					ig.game.newPopup('To use your map, press M');
				}
			}
			if (nextDialog.type === 'default') this.dialogIdx++;
			else {
				ig.game.newObjective(nextDialog.objective);
				if (nextDialog.type === 'itemCompletion') this.dialogChangeTrigger = 'item';
				else if (nextDialog.type === 'flagCompletion') this.dialogChangeTrigger = 'flag';
			}
			this.saveState();
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
		switch(this.dialogChangeTrigger) {
			case 'item':
				var nextDialog = this.dialogKeys[this.dialogIdx+1];
				for(var i = 0; i < ig.game.state.inventory.length; i++) {
					if(ig.game.state.inventory[i].name == nextDialog.questItem) {
						ig.game.completedObjective(nextDialog.objective);
						ig.game.state.inventory.splice(i, 1);
						this.dialogIdx++;
						this.dialogChangeTrigger = undefined;
					}
				}
				break;
			case 'flag':
				var nextDialog = this.dialogKeys[this.dialogIdx+1];
				if(ig.game.state.flags.indexOf(nextDialog.flag) > -1) {
					ig.game.completedObjective(nextDialog.objective);
					this.dialogIdx++;
					this.dialogChangeTrigger = undefined;
				}
			default:
				break;
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
