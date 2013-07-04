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
	mode: undefined,

	init: function( x, y, settings ) {
		// Add the animations
		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'run', 0.07, [0,1,2] );

		this.parent( x, y, settings );
	},



	createRoute: function(){
		if (this.route == undefined) return;
		if (this.mode == undefined) this.mode = 'patrol';

		var route_name = this.route;
		var waypoints = ig.game.getEntitiesByType(EntityWaypoint);
		this.route = new Route(this, route_name, this.route_type);

		for (var i = waypoints.length - 1; i >= 0; i--){
			if(waypoints[i].route == route_name) this.route.addWaypoint(waypoints[i]);
		}
		this.route.sort();
	},


	ready: function() {
		this.createRoute();
	},


	pathToWaypoint: function() {
		if (this.mode != 'patrol' || this.route == undefined) {
			this.path == undefined;
			return false;
		}
		var waypoint = this.route.currentWaypoint();
		
		if (this.path == undefined) this.getPath(waypoint.pos.x, waypoint.pos.y, true, [], []);

		this.followPath(this.movementSpeed, true);

		//this.currentAnim.angle = Math.atan2(this.vel.x, this.vel.y)/TO_RADS;
		switch(this.headingDirection) {
			case 1:
				this.facing = 315/TO_RADS; break;
			case 2:
				this.facing = 270/TO_RADS; break;
			case 3:
				this.facing = 225/TO_RADS; break;
			case 4:
				this.facing = 0/TO_RADS; break;
			case 5:
				this.facing = 180/TO_RADS; break;
			case 6:
				this.facing = 45/TO_RADS; break;
			case 7:
				this.facing = 90/TO_RADS; break;
			case 8:
				this.facing = 135/TO_RADS; break;
			default:
				this.facing = 0/TO_RADS; break;
		}
	},


	update: function() {
		if( this.vel.x != 0 || this.vel.y != 0 ) {
			this.currentAnim = this.anims.run;
		}
		else {
			this.currentAnim = this.anims.idle;
		}

		// ENEMY AI HERE!
		if(this.mode == 'patrol') this.pathToWaypoint();

		this.currentAnim.angle = this.facing;
		this.parent();
	}
});

});
