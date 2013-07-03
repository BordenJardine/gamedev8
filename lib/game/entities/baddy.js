ig.module(
	'game.entities.baddy'
)
.requires(
	'impact.entity',
	'plugins.route'
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

	init: function( x, y, settings ) {

		if(settings.route) this.route = ig.game.getOrCreateRoute(settings.route);
		
		// Add the animations
		this.addAnim( 'idle', 1, [0] );
		this.addAnim( 'run', 0.07, [0] );

		this.parent( x, y, settings );
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

		this.parent();
	}
});

});
