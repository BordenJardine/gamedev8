ig.module(
	'game.entities.smart'
)
.requires(
	'impact.entity',
	'game.classes.route'
)
.defines(function() {
EntitySmart = EntityRoutable.extend({
	target: undefined,
	pursuitTimer: new ig.Timer(),
	minDetectionDistance: 40,

	behave: function() {
		switch(this.behavior) {
			case 'patrol': this.followRoute(); break;
			case 'pursue': this.pursueTarget(); break;
		}
	},


	decideBehavior: function() {
		if(this.behavior != 'pursue' && this.hostile && this.spotTarget()){
			this.behavior = 'pursue';
			this.pursuitTimer.set(3);
		};

		if(this.behavior == 'pursue' && this.pursuitTimer.delta() > 0) {
			console.log(this.pursuitTimer.delta());
			if(this.route != undefined) {
				this.behavior = 'patrol'
			} else {
				this.behavior = 'wander'
			}
		};
	},


	pursueTarget: function(target) {
		this.pathToTarget();
		this.fovColor = "rgba(255,200,200,0.2)";
	},


	spotTarget: function(target) {
		if(target == undefined) target = this.target;

		var distance = this.distanceTo(target);
		if (distance > this.fovDistance) return false;
		if (distance <= this.minDetectionDistance) return true;

		var target_angle = this.angleTo(target);
		var current_angle = this.currentAnim.angle - (90/TO_RADS);  //why the hell do I have to add 90 degrees here?!
		var halfFov = this.fovRads/2;
		var lAngle = current_angle - halfFov,
			rAngle = current_angle + halfFov;
		if(target_angle < lAngle || target_angle > rAngle) return false;

		trace = this.trace(
			this.pos.x + this.size.x / 2,
			this.pos.y + this.size.y / 2,
			target.pos.x + target.size.x / 2,
			target.pos.y + target.size.y / 2
		);
		if (trace.collision.x == false && trace.collision.y == false) return true;

		return false;
	},

	update: function() {
		this.parent();
		// ENEMY AI HERE!
		this.decideBehavior();

		this.behave();

	}
});

});
