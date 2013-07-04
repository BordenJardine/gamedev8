ig.module(
	'game.entities.waypoint'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityWaypoint = ig.Entity.extend({
	size: {x: 8, y: 8},

	//_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(255, 255, 0, 0.7)',

	checkAgainst: ig.Entity.TYPE.B,

	route_index: 0,
	route: undefined,


	visit: function(){
		this.route.reachWaypoint(this);
	},


	update: function() {
		//check if it's the target is close, rather than colliding to get around the astar pathing limitations
		if (this.distanceTo(this.route.owner) < ig.game.collisionMap.tilesize) this.visit();
		this.parent();
	}
});

});
