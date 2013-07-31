ig.module(
	'game.entities.routable'
)
.requires(
	'impact.entity'
)
.defines(function() {

EntityRoutable = ig.Entity.extend({
	route: undefined,
	route_type: undefined,
	behavior: undefined,
	target: undefined,

	ready: function() {
		this.createRoute();
		if (typeof this.target === 'string') this.target = ig.game.getEntityByName(this.target);

		this.parent();
	},


	createRoute: function() {
		if (this.route == undefined) return;
		if (this.behavior == undefined) this.behavior = 'patrol';

		var route_name = this.route;
		var waypoints = ig.game.getEntitiesByType(EntityWaypoint);
		this.route = new Route(this, route_name, this.route_type);

		for (var i = waypoints.length - 1; i >= 0; i--) {
			if(waypoints[i].route == route_name) this.route.addWaypoint(waypoints[i]);
		}
		this.route.sort();
	},


	headingToRad: function(heading) {
		if (heading == undefined) heading = this.headingDirection;
		var rad;
		switch(this.headingDirection) {
			case 1:
				rad = 3.9; break;
			case 2:
				rad = 3.1; break;
			case 3:
				rad = 2.4; break;
			case 4:
				rad = 4.7; break;
			case 5:
				rad = 1.6; break;
			case 6:
				rad = 5.5; break;
			case 7:
				rad = 0; break;
			case 8:
				rad = .79; break;
			default:
				rad = 0; break;

		}
		return rad;
	},


	pathToTarget: function(target) {
		if (target == undefined) target = this.target;
		if (target == undefined) {
			this.path == undefined;
			return;
		}

		if (this.pathTimer == undefined) this.pathTimer = new ig.Timer();

		if (this.path == undefined ||  this.pathTimer.delta() >= 0) {
			this.pathTimer.set(1);
			this.getAStar(target);
		}

		this.followAStar(target);
	},


	getAStar: function(target) {
	//	this.getPath(target.pos.x, target.pos.y, true, ['EntityCrate', 'EntitySmart'], []);
		this.getPath(target.pos.x, target.pos.y, true, ['EntityCrate'], []);

	},


	followRoute: function(route) {
		if (route == undefined) route = this.route;
		if (route == undefined) {
			this.path == undefined;
			return;
		}

		if (this.path == undefined) this.getAStar(waypoint = route.currentWaypoint());
		this.followAStar();
	},


	followAStar: function() {
		this.followPath(this.movementSpeed, true);
	}
});


Route = ig.Class.extend({

	owner: undefined,
	waypoints: [],
	currentIndex: 0,
	name: undefined,
	route_type: 'reverse', //reverse or loop
	order_ascending: true,

	init: function(owner, name, type) {
		this.owner = owner;
		this.name = name;
		if (type != undefined) this.route_type = type;
	},


	addWaypoint: function(waypoint) {
		this.waypoints.push(waypoint);
		waypoint.routeObj = this;
		waypoint.active = true;
	},


	currentWaypoint: function() {
		return this.waypoints[this.currentIndex];
	},


	patrolReverse: function() {
		if(this.currentIndex <= 0) this.order_ascending = true;
		if(this.currentIndex >= this.waypoints.length - 1) this.order_ascending = false;

		(this.order_ascending) ? this.currentIndex++ : this.currentIndex--;
	},


	patrolLoop: function() {
		if(this.currentIndex >= (this.waypoints.length - 1) || this.currentIndex < 0) {
			(this.order_ascending) ? //ugly?
				this.currentIndex = 0 :
				this.currentIndex = this.waypoints.lenth - 1;
		} else {
			(this.order_ascending) ? this.currentIndex++ : this.currentIndex--;
		}
	},


	patrolToPoint: function() {
		if(this.currentIndex >= (this.waypoints.length - 1) || this.currentIndex < 0) {
			return;
		} else {
			(this.order_ascending) ? this.currentIndex++ : this.currentIndex--;
		}
	},


	reachWaypoint: function(waypoint) {
		if(waypoint.route_index != this.currentIndex) return;

		if(typeof(this.owner.reachWaypoint) === 'function') this.owner.reachWaypoint(waypoint);

		if(this.route_type == 'reverse') {
			this.patrolReverse();
		} else if (this.route_type == 'loop') {
			this.patrolLoop();
		} else if (this.route_type == 'toPoint') {
			this.patrolToPoint();
		}
	},


	sort: function() { //could be way prettier but we dont expect huge numbers here
		var waypoints = this.waypoints;
		var buffer, wi, wj;
		for (var i = 0; i < waypoints.length; i++) {
			for (var j = i + 1; j < waypoints.length; j++) {
				wi = waypoints[i];
				wj = waypoints[j];
				if (wi.route_index > wj.route_index) {
					buffer = wi;
					waypoints[i] = wj;
					waypoints[j] = buffer;
				}
			}
		}
	}
});

});

