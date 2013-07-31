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

		if(this.talkimage === undefined) this.talkimage = 2;

		this.loadFromState();

		if(this.dialogKeys[this.dialogIdx].scriptedItemNum != undefined) this.scriptedItemNum = this.dialogKeys[this.dialogIdx].scriptedItemNum;
		if(this.dialogKeys[this.dialogIdx].type === 'othersItemCompletion') this.dialogChangeTrigger =  'initialItem';
		if(this.dialogKeys[this.dialogIdx].type === 'completeOtherObj') this.dialogChangeTrigger =  'complete';

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
		if(this.dialogIdx >= (Object.keys(this.dialogKeys).length - 1) || this.dialogIdx < 0) return;
		else {
			var nextDialog = this.dialogKeys[this.dialogIdx+1];

			if (nextDialog.scripedItemNum !== undefined) this.scripedItemNum = nextDialog.scriptedItemNum;
			if (nextDialog.hasPopup == true) ig.game.newPopup(nextDialog.popup);
			if (nextDialog.setFlag !== undefined) ig.game.state.flags.push(nextDialog.setFlag);

           			 // Shitty, can probably remove this
			if(nextDialog.setFlag == 'map') {
				ig.game.newPopup('To use your map, press M');
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
				var item = ig.game.inventory.searchInventory(nextDialog.questItem);
				if(item) {
					ig.game.completedObjective(nextDialog.objective);
					if(item.removeOnCompletion == true) ig.game.inventory.removeFromInventory(item)
					this.dialogIdx++;
					this.dialogChangeTrigger = undefined;
				}
				break;
			case 'flag':
				var nextDialog = this.dialogKeys[this.dialogIdx+1];
				if(ig.game.state.flags.indexOf(nextDialog.flag) > -1) {
					ig.game.completedObjective(nextDialog.objective);
					this.dialogIdx++;
					this.dialogChangeTrigger = undefined;
				}
				break;
			case 'initialItem':
				var firstDialog = this.dialogKeys[this.dialogIdx];
				var item = ig.game.inventory.searchInventory(firstDialog.questItem);
				if(item) {
					ig.game.completedObjective(firstDialog.objective);
					if(item.removeOnCompletion == true) ig.game.inventory.removeFromInventory(item);
					this.dialogChangeTrigger = undefined;
				}
				break;
			case 'complete':
				var firstDialog = this.dialogKeys[this.dialogIdx];
				ig.game.completedObjective(firstDialog.objective);
				this.dialogChangeTrigger = undefined;
				break;
			default:
				break;
		}

		this.dialogKey = this.dialogKeys[this.dialogIdx].dialog;

		this.parent(other);
	},


	update: function() {
		if(this.vel.x != 0 || this.vel.y != 0) this.facing = this.headingToRad();
		else if(this.dialogActive) this.facing = this.angleTo(ig.game.getEntitiesByType(EntityPlayer)[0]);
		this.parent();
	}
});

});
