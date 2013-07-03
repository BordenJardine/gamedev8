ig.module( 
	'plugins.route' 
)
.requires(
	'impact.game'
)
.defines(function(){
	
ig.Game.inject({
	routes: {},
	
	addRoute: function(name){
		var route = new Route();
		this.routes[name] = route;
	},


	getOrCreateRoute: function(name){
		if(this.routes[name] == undefined) this.addRoute(name);
		return this.routes[name];
	}
	
});

Route = ig.Class.extend({
	
	owner: null,
	waypoints: [],
	currentIndex: 0,
	route_type: 'reverse', //reverse or loop
	order_ascending: true,
	
	init: function(owner){
		this.owner = owner;	
	},


	currentWaypoint: function(){
		return this.waypoints[this.currentIndex];
	},


	iterateReverse: function(){
		if (this.currentIndex >= this.waypoints.length || this.currentIndex < 0){
			this.order_ascending = !this.order_ascending;
		}
		(this.order_ascending) ? this.currentIndex++ : this.currentIndex--;
	},


	iterateLoop: function(){
		if(this.currentIndex >= this.waypoints.length || this.currentIndex < 0){
			(this.order_ascending) ? //let me know if you hate this syntax MBJ
				 this.currentIndex = 0 :
				 this.currentIndex = this.waypoints.lenth - 1;
		} else {
			(this.order_ascending) ? this.currentIndex++ : this.currentIndex--;
		}
	},
	

	pushWaypoint: function(waypoint){
		this.waypoints.push(waypoint);
	},


	reachWaypoint: function(waypoint){
		if(waypoint.waypoint_index != this.currentIndex) return false;

		if(this.route_type == 'reverse') {
			 this.iterateReverse();
		} else if (this.route_type == 'loop'){
			 this.iterateLoop();
		}
	}

});
});
