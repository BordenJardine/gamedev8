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

	animSheet: new ig.AnimationSheet('media/npc.png', 32, 32),
	alertImage: new ig.AnimationSheet('media/npcalert.png', 5, 14),
	talkImage: new ig.Image('media/hobochat.png', 98, 98),

	pointReached: false,
	pathInit: true,

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
	},

	ready: function() {
		this.route = this.name;
		this.route_type = 'toPoint';
		this.createRoute();
		this.behavior = 'manual';

		this.parent();
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
		this.parent(other);
	},

	update: function() {
		this.facing = this.headingToRad();
		this.parent();
	}
});

});
