TO_RADS = 180/Math.PI;

ig.module(
	'game.entities.baddy'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityBaddy = ig.Entity.extend({

	size: {x: 32, y:32},

	movementSpeed: 100,
	friction: {x: 1000, y: 1000},

	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.ACTIVE,

	animSheet: new ig.AnimationSheet('media/baddy.png', 32, 32),


	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	accel_default: 400,
	health: 5,
	facing: 0,
	route: undefined,
	route_type: undefined,
	behavior: undefined,
	target: undefined,

	init: function(x, y, settings) {

		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'run', 0.07, [0,1,2] );

		this.parent( x, y, settings );
	},



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


	ready: function() {
		this.createRoute();
		if (this.target != undefined) this.target = ig.game.getEntityByName(this.target);
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
	},


	update: function() {
		if( this.vel.x != 0 || this.vel.y != 0 ) {
			this.currentAnim = this.anims.run;
		} else {
			this.currentAnim = this.anims.idle;
		}

		// ENEMY AI HERE!
		if(this.behavior == 'patrol') this.followRoute(this.route);
		if(this.behavior == 'pursue') this.pathToTarget(this.target);

		this.currentAnim.angle = this.facing;
		this.parent();
	}
});

});
