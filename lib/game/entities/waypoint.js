ig.module(
	'game.entities.waypoint'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityWaypoint = ig.Entity.extend({
	size: {x: 4, y: 4},

	//_wmScalable: true,
	_wmDrawBox: true,
	_wmBoxColor: 'rgba(255, 255, 0, 0.7)',

	checkAgainst: ig.Entity.TYPE.B,

	waypoint_index: 0,
	route: undefined,

	init: function(x, y, settings) {
		// Add the animations
		if(settings.route){
			this.route = ig.game.getOrCreateRoute(settings.route);
			this.route.pushWaypoint(this);
		}


		this.parent(x, y, settings);
	},


	check: function(that) {if(that == this.route.owner) console.log(that); this.visit();},


	visit: function() {
		this.route.reachWaypoint(this);
		alert(this.route.currentIndex);
	},


	update: function() {
		this.parent();
	}
});

});
