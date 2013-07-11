
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
	hungerTimeLimit: 60,
	energyTimeLimit: 180,

	init: function() {
		this.hunger = ig.game.state.hunger;
		this.energy = ig.game.state.energy;
		this.hungerTimer = new ig.Timer();
		this.energyTimer = new ig.Timer();
		this.hungerTimer.set(this.hungerTimeLimit);
		this.energyTimer.set(this.energyTimeLimit);
	},


	addHunger: function(amt){
		if(!amt) amt = 1;
		if(amt + this.hunger > this.hungerMax) this.hunger =  this.hungerMax;
		else this.hunger += amt;
	},


	addEnergy: function(amt){
		if(!amt) amt = 1;
		if(amt + this.energy > this.energyMax) this.energy =  this.energyMax;
		else this.energy += amt;
	},


	checkHunger: function(){
		if(this.hungerTimer.delta() > 0){
			this.hunger--;
			this.setHungerTimer();
		}
		return this.hunger;
	},

	checkEnergy: function(){
		if(this.energyTimer.delta() > 0){
			this.energy--;
			this.setEnergyTimer();
		}
		return this.energy;
	},

	setHungerTimer: function(time){
		if(time == undefined) time = this.hungerTimeLimit;
		this.hungerTimer.set(time);

	},

	setEnergyTimer: function(time){
		if(time == undefined) time = this.energyTimeLimit;
		this.energyTimer.set(time);

	}
});

});
