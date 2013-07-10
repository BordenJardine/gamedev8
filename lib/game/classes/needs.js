
ig.module(
	'game.classes.needs'
)
.requires(
	'impact.game'
)
.defines(function(){

Needs = ig.Class.extend({
	hunger: 10,
	energy: 10,
	hungerMax: 10,
	energyMax: 10,
	hungerTimer: undefined,
	energyTimer: undefined,
	hungerTimeLimit: 120,
	energyTimeLimit: 360,

	init: function() {
		this.hungerTimer = new ig.Timer();
		this.energyTimer = new ig.Timer();
		this.hungerTimer.set(this.hungerTimeLimit);
		this.energyTimer.set(this.energyTimeLimit);
	},

	update: function() {
		this.checkHunger();
		this.checkEnergy();
	},

	checkHunger: function(){
		if(this.hungerTimer.delta() > 0){
			this.hunger--;
			this.setHungerTimer();
		}
	},

	checkEnergy: function(){
		if(this.hungerTimer.delta() > 0){
			this.energy--;
			this.setEnergyTimer();
		}
	},

	setHungerTimer: function(time){
		if(time == undefined) time = this.hungerTimeLimit;
		hungerTimer.set(time);

	},

	setEnergyTimer: function(time){
		if(time == undefined) time = this.energyTimeLimit;
		energyTimer.set(time);

	}
});

});
