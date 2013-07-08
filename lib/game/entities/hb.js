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

	currentWaypoint: undefined,

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
	},

	ready: function() {
		this.route = this.name;
		this.route_type = 'loop';
		this.createRoute();
		this.behavior = 'manual';

		this.parent();
	},

	scriptedMove: function() {
		var target = this.route.currentWaypoint();
		this.pathToTarget(target);

		// Hacky solution
		if(this.vel.x === 0 && this.vel.y === 0) {
			this.route.currentIndex++;
			return true;
		}
		return false;
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
