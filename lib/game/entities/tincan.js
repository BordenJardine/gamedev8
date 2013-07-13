ig.module(
	'game.entities.tincan'
)
.requires(
	'impact.entity',
	'plugins.box2d.entity'
)
.defines(function(){

EntityTincan = ig.Box2DEntity.extend({
	size: {x: 8, y: 8},
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.NEVER,

	animSheet: new ig.AnimationSheet( 'media/tincan.png', 8, 8 ),
	previousVelocity: undefined,
	vel: 20,
	torque: 15,
	soundThreshold: 5,
	soundRadius: 200,

	init: function( x, y, settings ) {
		this.parent( x, y, settings );
		this.addAnim( 'idle', 1, [0] );
		this.currentAnim.angle = settings.angle;

		var vx = this.vel * Math.cos(settings.angle);
		var vy = this.vel * Math.sin(settings.angle);
		this.body.ApplyImpulse(new b2.Vec2(vx, vy), this.body.GetPosition());
		this.body.ApplyTorque(this.torque);
		this.body.m_linearDamping = 0.7;
		this.body.m_angularDamping = 0.6;

		this.zindex = -10;
		ig.game.sortEntitiesDeferred();
	},

	check: function(other) {
		if(
			other != ig.game.getEntitiesByType(EntityPlayer)[0] ||
			Math.abs(this.body.GetLinearVelocity().x > 5) ||
			Math.abs(this.body.GetLinearVelocity().y > 5)
		) return;

		ig.game.inventory.addToInventory({
			name: 'tincan',
			image: 4,
			type: 'equippable'
		});
		this.kill();
	},
	
	update: function() {
		var vel = this.body.GetLinearVelocity();
		var currentVel = Math.sqrt(Math.pow(vel.x, 2) + Math.pow(vel.y, 2));
		if(
			this.previousVel != undefined &&
			(this.previousVel - currentVel) > this.soundThreshold
		){
			this.makeNoise();
		}
		this.previousVel = currentVel;
		this.parent();
	},

	makeNoise: function() {
		console.log('clang!');
	}
	
});

});
