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
	pursuitLimit: undefined,
	recheckTimer: undefined,
	recheckLimit: 3,
	waitCondition: undefined,
	waitTimer: undefined,
	waitLimit: 2,
	searchTimer: undefined,
	searchLimit: undefined,
	minDetectionDistance: undefined,
	wanderRadius: 200,
	baseSpeed: 75,
	runSpeed: 150,
	facing: 0,
	rotateSpeed: 0.006,
	hitLeft: false,
	zIndex: 1,

	init: function(x, y, settings) {
		this.pursuitTimer = new ig.Timer();
		this.waitTimer = new ig.Timer();
		this.recheckTimer = new ig.Timer();
		this.movementSpeed = this.baseSpeed;
		if( settings.facing != undefined) this.currentAnim.angle = settings.facing;

		this.startingAngle = this.currentAnim.angle;
		this.endingAngle = this.currentAnim.angle + (Math.PI/2);

		this.parent(x, y, settings);
	},


	behave: function() {
		this.decideBehavior();
		if (typeof this[this.behavior] == 'function') this[this.behavior]();
	},


	decideBehavior: function() {
		if(this.behavior == 'wait') return;
		if(this.hostile && this.behavior != 'pursue' && this.spotTarget()){
			this.behavior = 'pursue';
			this.alertLevel = 1;
			this.pursueBegin();
		} else if((this.behavior == 'pursue' || this.behavior == 'search') && this.pursuitTimer.delta() > 0) {
			this.stopPursuit();
		};
	},


	investigateBegin: function(fake_target){
		if(this.alertLevel > 0) return;
		this.previousBehavior = this.behavior;
		this.fake_target = fake_target;
		this.behavior = 'investigate';
	},


	investigate: function(fake_target) {
		if (fake_target == undefined) fake_target = this.fake_target;
		if(this.spotTarget(fake_target)){
			this.investigateEnd();
			return;
		}
		this.pathToTarget(fake_target);
		this.facing = this.headingToRad();
	},


	investigateEnd: function(){
		this.behavior = this.previousBehavior;
		this.waitBegin(1);
	},


	patrolBegin: function() {
		this.movementSpeed = this.baseSpeed;
		this.behavior = 'patrol';
		this.alertLevel = 0;
	},


	patrol: function() {
		this.followRoute()
		this.facing = this.headingToRad();
	},


	pursueBegin: function() {
		this.movementSpeed = this.runSpeed;
		this.pursuitTimer.set(this.pursuitLimit);
		this.recheckTimer.set(this.recheckLimit);
		this.behavior = 'pursue';
		this.alertLevel = 1;
	},


	pursue: function(target) {
		if (target == undefined) target = this.target;

		// This check is so they will always be able to follow you for a few seconds/fewer spot calls
		if(this.recheckTimer.delta() <= 0) {
			this.pathToTarget(target);
			this.facing = this.angleTo(target);
			return;
		}

		if(this.spotTarget(target)){
			this.pursueBegin();
			this.pathToTarget(target);
			this.facing = this.angleTo(target);
		} else if(this.path != undefined) {
			this.followAStar();
		} else {
			this.searchBegin();
		}
	},


	searchBegin: function() {
		this.behavior = 'search';
	},


	search: function() {
		if(this.path != undefined) {
			this.followAStar();
			this.facing = this.headingToRad();
			return;
		}

		this.moveRandomly();

	},


	searchEnd: function() {

	},


	waitBegin: function(condition) {
		if(typeof condition != 'function') {
			this.waitTimer.set((typeof condition == 'number') ? condition : this.waitLimit);
			condition = function() {
				return this.waitTimer.delta() >= 0;
			};
		}

		this.waitCondition = condition;
		this.previousBehavior = this.behavior;
		this.behavior = 'wait';
	},


	wait: function() {
		if(this.waitCondition()) this.waitEnd();
	},


	waitEnd: function() {
		this.func = this[this.previousBehavior + 'Begin'];
		if(typeof func == 'function') func();
	},


	wanderBegin: function() {
		this.movementSpeed = this.baseSpeed;
		this.behavior = 'wander';
		this.alertLevel = 0;
	},


	wander: function() {
		if(this.path != undefined) {
			this.followAStar();
			this.facing = this.headingToRad();
			return;
		}

		if (Math.random() > 0.5) {
			 this.waitBegin();
			 return;
		}

		this.moveRandomly();
	},


	moveRandomly: function() {
		var	rand_x,
			rand_y,
			from_x = this.pos.x - this.wanderRadius,
			from_y = this.pos.y - this.wanderRadius,
			to = this.wanderRadius * 2;

		try {
			while(this.path == undefined) {
				rand_x = Math.floor((Math.random() * to) + from_x);
				rand_y = Math.floor((Math.random() * to) + from_y);
				this.getAStar({'pos': {'x': rand_x, 'y': rand_y}});
			}
		} catch(e) {}
	},


	spotTarget: function(target) {
		if(target == undefined) target = this.target;
		if(target == undefined) return false;

		var distance = this.distanceTo(target);
		var detectionDistance,
			fovDistance;

		if(target.hidden && this.behavior != 'pursue') {
            if(ig.game.state.equipped != undefined ){
                detectionDistance = this.minDetectionDistance/ig.game.state.equipped.itemStrength;
                fovDistance = this.fovDistance/ig.game.state.equipped.itemStrength;
            } else {
                detectionDistance = this.minDetectionDistance/15;
                fovDistance = this.fovDistance/15;
            }
		} else {
			detectionDistance = this.minDetectionDistance;
			fovDistance = this.fovDistance;
		}

		if (distance <= detectionDistance) return true;
		if (distance > fovDistance) return false;
		var target_angle = this.angleTo(target);
		var current_angle = this.currentAnim.angle;
		target_angle = (target_angle >= 0) ? target_angle : target_angle + ig.global.MAX_RADS;
		current_angle = (current_angle >= 0) ? current_angle : current_angle + ig.global.MAX_RADS;
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


	faceTowards: function(){
		if (this.facing == undefined || this.currentAnim.angle == this.facing) return;
		this.currentAnim.angle = this.facing;

		if(this.type == 'rotating'){


			if(this.hitLeft) this.facing -= this.rotateSpeed;
			else this.facing += this.rotateSpeed;

			if(this.currentAnim.angle >= this.endingAngle) {
				this.hitLeft = true;
			} else if(this.currentAnim.angle <= this.startingAngle) {
				this.hitLeft = false;
			}
		}

	},


	stopPursuit: function() {
		if(this.route != undefined) {
			this.patrolBegin();
		} else {
			this.wanderBegin();
		}
	},


	update: function() {
		this.behave();
		this.faceTowards();
		this.parent();
	}
});

});
