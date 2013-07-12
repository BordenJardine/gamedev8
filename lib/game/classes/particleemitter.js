
ig.module(
	'game.classes.particleemitter'
)
.requires(
	'game.entities.particle',
	'game.entities.itemparticle',
	'impact.game'
)
.defines(function(){

ParticleEmitter = ig.Class.extend({

	init: function(settings) {
		this.x = settings.x;
		this.y = settings.y;
		this.type = settings.type == undefined ? 'default' : settings.type
		this.ttl = settings.ttl == undefined ? 1: settings.ttl;
		this.qty = settings.qty == undefined ? 50: settings.qty;
		this.repeat = settings.repeat == undefined ? false : settings.repeat
		this.repeatTime = settings.repeatTime == undefined ? 10 : settings.repeatTime;
		if(this.repeat) this.setupTimer()
		this.finished = false;
	},

	setupTimer: function() {
		this.partTimer = new ig.Timer();
		this.partTimer.set(this.repeatTime);
	},

	emitParticles: function() {
		if ( this.partTimer.delta() > 0 || !this.finished ){
			for (var i = 0; i <= this.qty; i++){
				switch (this.type) {
					case 'item':
						ig.game.spawnEntity( EntityItemparticle, this.x, this.y, {ttl: this.ttl});
						break;
					default:
						ig.game.spawnEntity( EntityParticle, this.x, this.y, {ttl: this.ttl});
						break;
				}
			}
			this.partTimer.reset();
			if(!this.finished) this.finished = true;
		}
	}
});

});
