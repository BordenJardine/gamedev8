ig.module(
	'game.entities.smart'
)
.requires(
	'impact.entity',
	'game.entities.routable'
)
.defines(function() {
EntitySmart = EntityRoutable.extend({

	alertLevel: undefined,
	hostile: undefined,
	target: undefined,
	pursuitTimer: undefined,
	recheckTimer: undefined,
	pursuitLimit: undefined,
	recheckLimit: 3,
	minDetectionDistance: undefined,

	init: function(x, y, settings) {
		this.pursuitTimer = new ig.Timer();
		this.recheckTimer = new ig.Timer();
		this.parent(x, y, settings);
	},

	behave: function() {
		this.decideBehavior();

		switch(this.behavior) {
			case 'patrol': this.followRoute(); break;
			case 'pursue': this.pursueTarget(); break;
		}
	},


	decideBehavior: function() {
		if(this.behavior != 'pursue' && this.hostile && this.spotTarget()){
			this.behavior = 'pursue';
			this.alertLevel = 1;
			this.beginPursuit();
		};

		if((this.behavior == 'pursue' || this.behavior == 'search') && this.pursuitTimer.delta() > 0) {
			if(this.route != undefined) {
				this.behavior = 'patrol'
			} else {
				this.behavior = 'wander'
			}
			this.alertLevel = 0;
		};
	},


	beginPursuit: function() {
		this.pursuitTimer.set(this.pursuitLimit);
		this.recheckTimer.set(this.recheckLimit);
	},


	pursueTarget: function(target) {
		if(this.recheckTimer.delta() <= 0) { this.pathToTarget(target); return; }

		if(this.spotTarget(target)){
			this.beginPursuit();
			this.pathToTarget(target);
		} else if(this.path != undefined) {
			this.followAStar();
		} else {
			this.behavior = 'search';
		}
	},


	spotTarget: function(target) {
		if(target == undefined) target = this.target;

		var distance = this.distanceTo(target);
		if (distance > this.fovDistance) return false;
		if (target.inBox) {
			if (distance <= this.minDetectionDistance/3) return true;
		} else {
			if (distance <= this.minDetectionDistance) return true;
		}
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
		this.behave();
		this.parent();
	}
});

});
