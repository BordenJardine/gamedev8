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
	searchTimer: undefined,
	searchLimit: undefined,
	minDetectionDistance: undefined,
	baseSpeed: 100,
	runSpeed: 150,
	facing: 0,
	rotateSpeed: 0.06,

	init: function(x, y, settings) {
		this.pursuitTimer = new ig.Timer();
		this.recheckTimer = new ig.Timer();
		this.movementSpeed = this.baseSpeed;
		if( settings.facing != undefined) this.currentAnim.angle = settings.facing;
		this.parent(x, y, settings);
	},

	behave: function() {
		this.decideBehavior();

		switch(this.behavior) {
			case 'patrol': this.patrol(); break;
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
				this.beginPatrol();
			} else {
				this.behavior = 'wander'
			}
			this.alertLevel = 0;
		};
	},


	beginPatrol: function() {
		this.movementSpeed = this.baseSpeed;
		this.behavior = 'patrol';
	},


	beginPursuit: function() {
		this.movementSpeed = this.runSpeed;
		this.pursuitTimer.set(this.pursuitLimit);
		this.recheckTimer.set(this.recheckLimit);
	},


	patrol: function() {
		this.followRoute()
		this.facing = this.headingToRad();
	},


	pursueTarget: function(target) {
		if (target == undefined) target = this.target;

		// This check is so they will always be able to follow you for a few seconds/fewer spot calls
		if(this.recheckTimer.delta() <= 0) { 
			 this.pathToTarget(target);
			 this.facing = this.angleTo(target);
			 return;
		 }

		if(this.spotTarget(target)){
			this.beginPursuit();
			this.pathToTarget(target);
			 this.facing = this.angleTo(target);
		} else if(this.path != undefined) {
			this.followAStar();
			 this.facing = this.headingToRad();
		} else {
			this.behavior = 'search';
		}
	},


	spotTarget: function(target) {
		if(target == undefined) target = this.target;

		var distance = this.distanceTo(target);
		var detectionDistance,
			fovDistance;

		if(target.inBox && this.behavior != 'pursue') {
			detectionDistance = this.minDetectionDistance/ig.game.state.equipped.itemStrength;
			fovDistance = this.fovDistance/ig.game.state.equipped.itemStrength;
		} else {
			detectionDistance = this.minDetectionDistance;
			fovDistance = this.fovDistance;
		}


		if (distance <= detectionDistance) return true;
		if (distance > fovDistance) return false;
		var target_angle = this.angleTo(target);
		var current_angle = this.currentAnim.angle;
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


	faceTowards: function(facingRads){
		if (this.currentAnim == undefined) return;

		var max_angle = 360;
		var angle = this.currentAnim.angle*TO_RADS;
		var facing = facingRads*TO_RADS;
		var new_angle;

		if(angle  < 0) angle += max_angle;
		if(angle  > max_angle) angle = angle % max_angle;
		if(facing < 0) facing += max_angle;
		if(facing > max_angle) facing = facing % max_angle;
/*
		var max_angle = 6.28318;
		var angle = this.currentAnim.angle;
		var facing = facingRads;
		if(this.currentAnim.angle  < 0) this.currentAnim.angle += max_angle;
		if(this.currentAnim.angle  > max_rads) this.currentAnim.angle -= max_angle;
		if(facing > max_rads) facing -= max_rads;
		if(facing < 0) facing += max_rads;
*/

		var dist = Math.abs(angle - facing);
		var invDist = max_angle - angle + facing;
		if(this.name == 'Baddy1') console.log(this.behavior + ' ' + angle + ' ' + facing + ' ' + dist + ' ' + invDist);
		if (angle == facing) return;
		//if (dist < .05 || invDist < .05) return;
		if ((angle < facing && invDist > dist) || (angle > facing && invDist < dist)) {
			this.currentAnim.angle += this.rotateSpeed;
			return;
		}
		this.currentAnim.angle -= this.rotateSpeed;
	},


	update: function() {
		this.behave();
		//this.faceTowards(this.facing);
		this.currentAnim.angle = this.facing;
		this.parent();
	}
});

});
