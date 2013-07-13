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
	vel: 20,
	torque: 15,
	type: ig.Entity.TYPE.NONE,
	checkAgainst: ig.Entity.TYPE.B, // Check Against B - our evil enemy group
	collides: ig.Entity.COLLIDES.NEVER,

	animSheet: new ig.AnimationSheet( 'media/tincan.png', 8, 8 ),

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
	}
});

});
