
ig.module(
	'game.classes.cloudgen'
)
.requires(
	'game.entities.cloud',
	'impact.game'
)
.defines(function(){

CloudGenerator = ig.Class.extend({

	init: function(settings) {
		this.repeatTime = settings.repeatTime;
		this.setupTimer();
	},

	setupTimer: function() {
		this.cloudTimer = new ig.Timer();
		this.cloudTimer.set(this.repeatTime);
	},

	emitClouds: function() {
		if ( this.cloudTimer.delta() > 0){
			ig.game.spawnEntity( EntityCloud, 0, 0);
			this.cloudTimer.reset();
		}
	}
});

});
