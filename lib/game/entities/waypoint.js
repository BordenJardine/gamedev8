/* TODO

	add a system for modifying behavior at each waypoint e.g. look_around(), wait(), etc.
*/
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

	checkAgainst: ig.Entity.TYPE.BOTH,

	route_index: 0,
	route: undefined,
	routeObj: undefined,
	active: false,

	visit: function(){
		this.routeObj.reachWaypoint(this);
	},


	update: function() {
		if(this.active) {
		//check if it's the target is close, rather than colliding to get around the astar pathing limitations
		//if (this.distanceTo(this.route.owner) < ig.game.collisionMap.tilesize) this.visit();
			if (this.routeObj.owner != undefined)  {
				if (this.distanceTo(this.routeObj.owner) < 32) this.visit();
			}
			this.parent();
		}
	}
});

});
