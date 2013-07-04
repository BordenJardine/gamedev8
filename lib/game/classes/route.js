ig.module( 
	'game.classes.route' 
)
.requires(
	'impact.game'
)
.defines(function(){
	
Route = ig.Class.extend({
	
	owner: undefined,
	waypoints: [],
	currentIndex: 0,
	name: undefined,
	route_type: 'reverse', //reverse or loop
	order_ascending: true,
	
	init: function(owner, name, type){
		this.owner = owner;	
		this.name = name;
		if (type != undefined) this.route_type = type;
	},


	addWaypoint: function(waypoint){
		this.waypoints.push(waypoint);
		waypoint.route = this;
	},


	currentWaypoint: function(){
		return this.waypoints[this.currentIndex];
	},


	patrolReverse: function(){
		if(this.currentIndex <= 0) this.order_ascending = true;
		if(this.currentIndex >= this.waypoints.length - 1) this.order_ascending = false;

		(this.order_ascending) ? this.currentIndex++ : this.currentIndex--;
	},


	patrolLoop: function(){
		if(this.currentIndex >= (this.waypoints.length - 1) || this.currentIndex < 0){
			(this.order_ascending) ? //ugly?
				this.currentIndex = 0 :
				this.currentIndex = this.waypoints.lenth - 1;
		} else {
			(this.order_ascending) ? this.currentIndex++ : this.currentIndex--;
		}
	},
	

	reachWaypoint: function(waypoint){
		if(waypoint.route_index != this.currentIndex) return false;

		if(this.route_type == 'reverse') {
			this.patrolReverse();
		} else if (this.route_type == 'loop'){
			this.patrolLoop();
		}
	},

	
	sort: function() { //could be way prettier but we dont expect huge numbers here
		var waypoints = this.waypoints;
		var buffer, wi, wj;
		for (var i = 0; i < waypoints.length; i++){
			for (var j = i + 1; j < waypoints.length; j++){
				wi = waypoints[i];
				wj = waypoints[j];
				if (wi.route_index > wj.route_index){
					buffer = wi;
					waypoints[i] = wj;
					waypoints[j] = buffer;
				}
			}
		}
	}
});
});
