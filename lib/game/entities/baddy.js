ig.module(
	'game.entities.baddy'
)
.requires(
	'impact.entity'
)
.defines(function(){

EntityBaddy = ig.Entity.extend({

	size: {x: 16, y:16},

	movementSpeed: 100,
	friction: {x: 1000, y: 1000},

	type: ig.Entity.TYPE.B, // Evil enemy group
	checkAgainst: ig.Entity.TYPE.A, // Check against friendly
	collides: ig.Entity.COLLIDES.ACTIVE,

	animSheet: new ig.AnimationSheet( 'media/baddy.png', 16, 16 ),


	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	accel_default: 400,
	health: 5,
	route: undefined,
	route_type: undefined,

	init: function( x, y, settings ) {
		// Add the animations
		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'run', 0.07, [0] );

		this.parent( x, y, settings );
	},



	createRoute: function(){
		if (this.route == undefined) return;

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
		if (this.route == undefined) {
			this.path == undefined;
			return false;
		}
		var waypoint = this.route.currentWaypoint();
		
		if (this.path == undefined) this.getPath(waypoint.pos.x, waypoint.pos.y, true, [], []);

		this.followPath(this.movementSpeed, true);
	},


	update: function() {

		// ENEMY AI HERE!
		this.pathToWaypoint();
	
		if( this.vel.x != 0 || this.vel.y != 0 ) {
			this.currentAnim = this.anims.run;
		}
		else {
			this.currentAnim = this.anims.idle;
		}

		this.parent();
	}
});

});
