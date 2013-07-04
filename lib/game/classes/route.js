ig.module(
	'game.classes.route'
)
.requires(
	'impact.game',
	'impact.entity'
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

ig.Entity.inject({
	facing: 0,
	route: undefined,
	route_type: undefined,
	behavior: undefined,
	target: undefined,

	createRoute: function(){
		if (this.route == undefined) return;
		if (this.behavior == undefined) this.behavior = 'patrol';

		var route_name = this.route;
		var waypoints = ig.game.getEntitiesByType(EntityWaypoint);
		this.route = new Route(this, route_name, this.route_type);

		for (var i = waypoints.length - 1; i >= 0; i--){
			if(waypoints[i].route == route_name) this.route.addWaypoint(waypoints[i]);
		}
		this.route.sort();
	},


	headingToRad: function(heading){
		var rad;
		switch(this.headingDirection) {
			case 1:
				rad = 315/TO_RADS; break;
			case 2:
				rad = 270/TO_RADS; break;
			case 3:
				rad = 225/TO_RADS; break;
			case 4:
				rad = 0/TO_RADS; break;
			case 5:
				rad = 180/TO_RADS; break;
			case 6:
				rad = 45/TO_RADS; break;
			case 7:
				rad = 90/TO_RADS; break;
			case 8:
				rad = 135/TO_RADS; break;
			default:
				rad = 0/TO_RADS; break;
		}
		return rad;
	},


	pathToTarget: function(target) {
		if (target == undefined) {
			this.path == undefined;
			return false;
		}

		if (this.pathTimer == undefined) this.pathTimer = new ig.Timer();

		if (this.path == undefined ||  this.pathTimer.delta() >= 0) {
			this.pathTimer.set(1);
			this.getPath(target.pos.x, target.pos.y, true, [], []);
		}

		this.followAStar(target);
	},


	followRoute: function(route) {
		if (this.route == undefined) {
			this.path == undefined;
			return false;
		}
		var waypoint = route.currentWaypoint();

		if (this.path == undefined) this.getPath(waypoint.pos.x, waypoint.pos.y, true, [], []);
		this.followAStar(waypoint);
	},


	followAStar: function(target_obj){
		this.followPath(this.movementSpeed, true);
		//this.currentAnim.angle = Math.atan2(this.vel.x, this.vel.y)/TO_RADS;
		this.facing = this.headingToRad(this.headingDirection);
	}
});

});
