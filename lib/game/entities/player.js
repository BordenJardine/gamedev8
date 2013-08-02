/*
	Main Player Entity -- DO NOT PLACE VIA WELTMEISTER
*/
ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity',
	'game.entities.debris'
)
.defines(function(){

EntityPlayer = ig.Entity.extend({

	size: {x: 30, y:30},

	baseMovementSpeed: 200,
	movementSpeed: 200,
	friction: {x: 1000, y: 1000},

	type: ig.Entity.TYPE.A, // Player friendly group
	checkAgainst: ig.Entity.TYPE.A,
	collides: ig.Entity.COLLIDES.PASSIVE,
	name: 'player',

	animSheet: new ig.AnimationSheet('media/player.png', 32, 32),

	// These are our own properties. They are not defined in the base
	// ig.Entity class. We just use them internally for the Player
	health: 10,
	healthMax: 10,
	sleepEnergyBoost: 7,
	needs: undefined,
	inBox: false,
  inTinfoil: false,
	itemUseCooldown: false,
	cooldownTimer: new ig.Timer(),
	cooldownTime: .5,

  tinfoilParticles: [],

	beingFollowed: false,

	zIndex: 2,


	init: function( x, y, settings ) {
		this.parent( x, y, settings );

		this.addAnim( 'idle', .75, [0,1,2,3,4,5,6,7,8,9,10,11] );
		this.addAnim( 'run', 0.1, [48,49,50,51,52,53,54,55,56,57,58,59] );
		this.addAnim( 'boxHide', 5, [144], true);
		this.addAnim( 'boxIdle', 1, [144]);
		this.addAnim( 'boxAway', 2, [144], true);
		this.addAnim( 'die', 2, [155], true);

		if(ig.game.state.health <= 0) this.resetPlayer();

		this.movementSpeed = this.baseMovementSpeed;

		if(settings.needs == undefined) {
			ig.game.needs = new Needs();
			this.needs = ig.game.needs;
		}
	},


	eat: function(hp, hg) {
		if(hp == undefined) hp = 2;
		if(hg == undefined) hg = 5;
		health = ig.game.state.health;
		(hp + ig.game.state.health > this.healthMax) ? this.health = this.heathMax : ig.game.state.health += hp;
		this.needs.addHunger(hg);
	},


	sleep: function() {
		ig.game.saveGame();
		this.needs.addEnergy(this.sleepEnergyBoost);
	},


	receiveDamage: function(amount, entity) {
		ig.game.state.health -= amount;
		ig.game.state.energy -= amount * 0.5

		if (ig.game.state.health <= 0) this.die(entity);
	},


	die: function(killer) {
		this.dead = true;
		this.currentAnim = this.anims.die;
		this.type =  ig.Entity.TYPE.NONE;
		ig.game.unbindKeys();

		if (killer != undefined) {
			// Here we can have the killer say something if they have dialog
			if(killer.killDialog !== undefined) {
				killer.eventChain = killer.eventChainGenerator.getChain(killer.killDialog, killer);
				killer.dialogActive = true;
			}
			else if (killer.owner !== undefined && killer.owner.killDialog !== undefined) {
				killer.owner.eventChain = killer.owner.eventChainGenerator.getChain(killer.owner.killDialog, killer.owner);
				killer.owner.dialogActive = true;
			} else this.deathFade();
		} else this.deathFade();
	},


	deathFade: function() {
		ig.game.unbindKeys();
		ig.game.fadeIn(1, this.dieCallback);
	},


	dieCallback: function() {
		ig.game.levelDirector.reloadLevel();
	},


	resetPlayer: function() {
		this.type =  ig.Entity.TYPE.A;
		ig.game.bindKeys();
		ig.game.state.health = 10;
		ig.game.state.energy = 10;
		ig.game.state.hunger = 10;
	},


	tossCan: function() {
		ig.game.spawnEntity(
			EntityTincan,
			 this.pos.x + this.size.x / 2,
			 this.pos.y + this.size.y / 2,
			 { angle: this.currentAnim.angle }
		);
	},


	tossDebris: function() {
		ig.game.spawnEntity(
			EntityDebris,
			 this.pos.x + this.size.x / 2,
			 this.pos.y + this.size.y / 2,
			 { angle: this.currentAnim.angle }
		);
	},


	ready: function() {
		this.parent();
		ig.game.sortEntitiesDeferred();
	},


	check: function(other) {
		if(other && other instanceof EntityBush) {
			this.hidden = true;
			this.hider = other;
		}
	},


	update: function() {

		if(this.hidden && this.hider != undefined) if(!this.touches(this.hider)) this.hidden = false;

		// movement
		var speed = this.movementSpeed;
		var tired = ig.game.state.energy <= 0 ? true : false;
		var hungry = ig.game.state.hunger <= 0 ? true : false;

		if (hungry && ig.game.state.flags.indexOf('hunger') < 0) {
			ig.game.state.flags.push('hunger');
			ig.game.newPopup("You're dizzy from hunger! Eat something to make things right again!");
		}

		if (tired && ig.game.state.flag.indexOf('sleepy') < 0) {
			ig.game.state.flags.push('sleepy');
			ig.game.newPopup("You're tired. Get some rest to speed up.")
		}

		if (tired) speed = this.movementSpeed * 0.5;

		if((ig.input.state('left') || ig.input.state('left')) &&
			 (ig.input.state('up') || ig.input.state('up'))) {
			speed = Math.sqrt(Math.pow(speed, 2) / 2);
		}

		if( ig.input.state('left') ) {
			this.vel.x = -speed;

		} else if( ig.input.state('right') ) {
			this.vel.x = speed;
		} else {
			this.vel.x = 0;
		}

		if (ig.input.state('up')) {
			this.vel.y = -speed;
		} else if(ig.input.state('down')) {
			this.vel.y = speed;
		} else {
			this.vel.y = 0;
		}

		// If hungry, reverse movement
		if(hungry) {
			this.vel.y *= -1;
			this.vel.x *= -1;
		}

		// set the current animation
		if( this.vel.x != 0 || this.vel.y != 0 ) {
			this.currentAnim = this.anims.run;
			if(this.inBox) this.currentAnim = this.anims.boxIdle;
		}
		else {
			if(!this.dead) this.currentAnim = this.anims.idle;
			if(this.inBox) this.currentAnim = this.anims.boxIdle;
		}

		// figure out where the mouse is
		var rotate_to_x = ig.input.mouse.x + ig.game.screen.x;
		var rotate_to_y = ig.input.mouse.y + ig.game.screen.y;
		this.currentAnim.angle = Math.atan2((rotate_to_y-this.pos.y), (rotate_to_x-this.pos.x));

		if(this.itemUseCooldown) {
			if(this.cooldownTimer.delta() >= 0) {
				this.itemUseCooldown = false;
			}
		}

		if(ig.input.pressed('use')) ig.game.inventory.usePressed(this);

		this.parent();
	},

  draw: function() {
    var self = this;

    if (this.inTinfoil) {
      if (self.tinfoilParticles.length < 15) var particle_count = 1
      for(var i = 0; i < particle_count; i++)
      {
        self.tinfoilParticles.push(new particle());
      }

      var ctx = ig.system.context;

      for(var i = 0; i < self.tinfoilParticles.length; i++)
      {
        var p = self.tinfoilParticles[i];
        ctx.beginPath();

        p.opacity = Math.round(p.remaining_life/p.life*100)/100

        var gradient = ctx.createRadialGradient(p.location.x, p.location.y, 0, p.location.x, p.location.y, p.radius);
        gradient.addColorStop(0, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
        gradient.addColorStop(0.5, "rgba("+p.r+", "+p.g+", "+p.b+", "+p.opacity+")");
        gradient.addColorStop(1, "rgba("+p.r+", "+p.g+", "+p.b+", 0)");
        ctx.fillStyle = gradient;
        ctx.arc(p.location.x, p.location.y, p.radius, Math.PI*2, false);
        ctx.fill();

        p.remaining_life--;
        p.radius--;
        p.location.x += p.speed.x;
        p.location.y += p.speed.y;

        if(p.remaining_life < 0 || p.radius < 0)
        {
          self.tinfoilParticles[i] = new particle();
        }
      }
    }

    function particle()
    {
      var xdir = (Math.random() < .5) ? -1 : 1;
      var ydir = (Math.random() < .5) ? -1 : 1;

      this.speed = {x: xdir*2.5+Math.random()*1, y: ydir*3+Math.random()*1};

      var	drawx = ig.system.getDrawPos(self.pos.x) - ig.game.screen.x + self.size.x/2,
          drawy = ig.system.getDrawPos(self.pos.y) - ig.game.screen.y + self.size.y/2;
      this.location = {x: drawx, y: drawy};

      //radius range = 10-30
      this.radius = 1+Math.random()*5;
      //life range = 20-30
      this.life = 25+Math.random()*15;
      this.remaining_life = this.life;

      this.r = Math.round(Math.random()*255);
      this.g = Math.round(Math.random()*255);
      this.b = Math.round(Math.random()*255);
    }

    this.parent();
  }
});


});
