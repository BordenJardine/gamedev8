ig.module(
	'game.entities.spawnednpc'
)
.requires(
	'game.entities.npc'
)
.defines(function(){

EntitySpawnednpc = EntityNpc.extend({

	init: function( x, y, settings ) {
		this.spawner = settings.owner;
		this.route = settings.route;
		this.image = "npc2";

		this.parent( x, y, settings );

		this.fakeReady();
	},

	fakeReady: function()
	{
		if(this.collidable == 'true') this.collides = ig.Entity.COLLIDES.FIXED;
		if(this.hideAlert == 'true') this.showAlert = false;
		if(this.talkImage === undefined) this.talkImage = 2;

		this.canPanhandle = "true";

		this.eventChainGenerator = new EventGenerator();

		this.animSheet = new ig.AnimationSheet('media/'+this.image+'.png', 32, 32);
		this.addAnim( 'run', .11, [12,13,14,15,16,17,18,19,21,21,22,23] );
		this.addAnim( 'idle', .75, [0,1,2,3,4,5,6,7,8,9,10,11,12] );
		this.currentAnim = this.anims.idle;

		this.createRoute();
	},

	despawn: function() {
		this.spawner.npcSpawned = false;
		this.kill();
	}
});

});
