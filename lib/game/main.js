ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',

	'game.entities.player',
	'game.entities.spawnednpc',
	'game.entities.tincan',
	'game.entities.waypoint',

	'game.levels.uberwelt',
	'game.levels.tutorial',
	'game.levels.soupkitchen',
	'game.levels.overworld',
	'game.levels.tutorial2',
	'game.levels.subwaystation',
	'game.levels.subwayleft',
	'game.levels.subwayright',
	'game.levels.subwayhideout',
	'game.levels.ai',
	'game.levels.nsa_hq',


	'plugins.director.director',
	'plugins.scene_manager',
	'plugins.astar-for-entities',

	'game.classes.dialog',
	'game.classes.needs',
	'game.classes.inventory',
	'game.classes.cloudgen',

	'plugins.director.director',
	'plugins.scene_manager',
	'plugins.gui',
	'plugins.screen-fader',
	'plugins.box2d.game',
	'plugins.font',
	'plugins.screenshaker'
)
.defines(function(){

ig.global.TO_RADS = 180/Math.PI,
ig.global.MAX_RADS = 6.28318531,
ig.global.NPC_SCRIPT = [
	'waitForItem',
	'moveToLocation'
],


ParentScreen = ig.Box2DGame.extend({
	sceneManager: new SceneManager(),

	init: function() {
		// Push the menu scene on to the stack
		this.sceneManager.pushScene( new MenuScene() );
	},

	update: function() {
		// Update the current scene
		this.sceneManager.updateScene();
	},

	draw: function() {
		// Draw the current scene
		this.sceneManager.drawScene();
	}
});

MenuScene = Scene.extend({
	init: function( title ) {
		this.parent( 'Menu Scene' );

		this.image = new ig.Image('media/tempmenu.png');

		this.clearColor = '#000';

		this.step = 0;

		this.drawLevel = false;
		this.getSavedLevel();

		ig.input.bind(ig.KEY.ESC, 'esc');

		if(this.menuLevel != undefined) this.drawLevel = true;

	},

	getSavedLevel: function() {
		try {
			this.menuLevel = JSON.parse(localStorage.getItem('state')).currentLevel;
		} catch(e) {
			this.menuLevel = undefined;
		}
	},


	getIntroShown: function() {
		try {
			this.intro = localStorage.getItem('intro');

			if(this.intro === 'true')  return false;
			else return true;
		} catch(e) {
			return true;
		}
	},


	update: function() {
		// Update all entities and backgroundMaps
		this.parent();

		if ( ig.input.pressed( 'mouse1' ) ) {
			ig.input.unbind(ig.KEY.ESC, 'esc');
			var showIntro = this.getIntroShown();

			if(showIntro) {
				window.localStorage.setItem('intro', 'true');
				this.sceneManager.pushScene( new IntroScreen() );
			}
			else this.sceneManager.pushScene( new homeless() );
		} else if(ig.input.pressed('esc')) {
			localStorage.clear();
			this.drawLevel = false;
		}
	},

	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		this.image.draw(0,0);

		this.step++;
		if(this.step > 100) this.step = 0;

		ig.system.context.save();

		ig.system.context.fillStyle = 'white';
		ig.system.context.textAlign = 'center';

		ig.system.context.font = 'bold 14px sans-serif';
		if (((this.step / 20) & 3) !== 0) ig.system.context.fillText( 'Click to play', this.center.x, this.center.y + 40);
		if(this.drawLevel) {
			ig.system.context.fillText( 'Current Level: '+this.menuLevel.substr(5), this.center.x, this.center.y + 120);
			ig.system.context.fillText('To clear your current save, press Escape', this.center.x, this.center.y + 160)
		}
		ig.system.context.restore();
	}
});


IntroScreen = Scene.extend ({
	introScreenImages: ['media/pg1v2.png', 'media/pg2v2.png', 'media/pg3v2.png', 'media/pg4v2.png'],
	init: function() {
		var self = this;

		/*
			this may seem complicated, but to extend or change anything, all you have to touch is the
			introScreenImages array above. the rest is handled automagically
		*/

		this.cutsceneImages = [];   // array that will contain all of the loaded images for the cutscene
		this.cutsceneDraw = []; // array that will hold true or false values for each loaded image
		this.numCutsceneImages = this.introScreenImages.length; // number of cutscene images
		this.cutsceneImagesIdx = 0; // current cutscene image index
		this.sceneLength = 10; // number of seconds to remain on each scene

		// loop through each image
		// load it, then  add false to the 'draw' array in its corresponding location
		for (var i = 0; i < this.numCutsceneImages; i++) {
			this.cutsceneImages.push(new ig.Image(self.introScreenImages[i]));
			this.cutsceneDraw.push(false);
		}

		// set up the EventChain; basically draw the image, wait X seconds, remove that scene and draw a new one
		// note that we're only setting booleans here, the actual drawing happens in the draw function
		this.introChain = EventChain(this)
			.wait(.1)
			.then(function() {
				self.cutsceneDraw[self.cutsceneImagesIdx] = true;
			})
			.wait(self.sceneLength)
			.then(function() {
				self.cutsceneDraw[self.cutsceneImagesIdx] = false;
				self.cutsceneImagesIdx += 1;
				if(self.cutsceneImagesIdx === self.numCutsceneImages) {
					self.sceneManager.pushScene( new homeless() );
				}
			})
			.repeat(self.numCutsceneImages);
	},

	update: function() {
		this.parent();
		// update the chain every frame
		this.introChain();
	},

	draw: function() {
		this.parent()

		// iterates through the array and draws whichever images corresponding boolean is set to true
		for(var j = 0; j < this.numCutsceneImages; j++) {
			if(this.cutsceneDraw[j] === true) {
				this.cutsceneImages[j].draw(0, 0);
			}
		}
	}
});


ClosingScene = Scene.extend({
	init: function( title ) {
		this.parent( 'Closing Scene' );

		this.image = new ig.Image('media/explosion.png');

		this.clearColor = '#000';

		this.step = 0;
		this.move = 0;

		this.startScroll = new ig.Timer();
		this.startScroll.set(5);
	},


	update: function() {
		this.parent();
	},

	draw: function() {
		this.parent();

		if(this.step == 0) this.image.draw(0,0);

		if(this.startScroll.delta() >=0) this.step+=1;
		if (this.step > 50) this.move += 1;

		if(this.move > 0) {
			ig.system.context.save();

			ig.system.context.fillStyle = 'white';
			ig.system.context.textAlign = 'center';

			ig.system.context.font = 'bold 72px sans-serif';
			ig.system.context.fillText( 'THE END', this.center.x, this.center.y + 40 - this.move);

			ig.system.context.font = 'bold 48px sans-serif';
			ig.system.context.fillText("Created By", this.center.x, 1024 - this.move);
			ig.system.context.fillText("Jusion and MSPain", this.center.x, 1124 - this.move);

			ig.system.context.font = 'bold 32px sans-serif';
			ig.system.context.fillText("With art by The White Dragon", this.center.x, 1224 - this.move);
			ig.system.context.fillText("and assistance from HardDisk", this.center.x, 1324 - this.move);

			ig.system.context.restore();
		}
	}
});


/*
	MAIN GAME SCENE

	Globals:
		- ig.game.state
		- ig.game.dialog
		- ig.game.inventory

*/

homeless = Scene.extend({

	gravity: 0,

	font: new ig.Font( 'media/helv.font.png' , { borderColor: '#000' }),
	fontsmall: new ig.Font('media/helv.fontsmall.png', { borderColor: '#000' }),

	dialog: {
		image: new ig.Image('media/gui_dialog.png'),
		pages: [],
		fillPages: new DialogGenerator()
	},
	inventoryHUD: {
		image: new ig.Image('media/gui_inventory.png'),
		pos: {x:0, y:0},
		open: false
	},
	hud: {
		image: new ig.Image('media/gui_hud.png'),
		hpimg: new ig.Image('media/gui_hpbar.png'),
		pos: {x:5, y:5}
	},
	needs_hud: {
		image: new ig.Image('media/gui_needs.png'),
		hungerimg: new ig.Image('media/gui_hungerbar.png'),
		energyimg: new ig.Image('media/gui_energybar.png'),
		pos: {x:5, y: 705}
	},
	map: {
		image: new ig.Image('media/map.png'),
		pos: {x: 0, y: 0},
		open: false
	},
	menuImage: {
		image: new ig.Image('media/gui_menu.png'),
		pos: {
			x: 0,
			y: 0
		},
		open: false
	},

	dialogDrawCounter: 0,
	objectivesDrawCounter: 0,
	lastObjectivesLength: 0,
	popupDrawCounter: 0,
	newPop: false,
	popupTimer: new ig.Timer(),
	popupDisplayTime: 5,
	popupTimerSet:  false,

	fogSpawned: false,

	theScreenShaker: null,

	equipFrame: new ig.Image('media/gui_equipframe.png'),
	invImages: new ig.Image('media/invitems.png'),
	itemImages: new ig.AnimationSheet('media/items.png', 16, 16),
	dialogImages: new ig.Image('media/portraits.png'),
	buttonImages: new ig.Image('media/gui_buttons.png'),

	talker: undefined,

	state: {
		health: 10,
		hunger: 10,
		energy: 10,
		money: 0.00,
		inventory: [],
		currentCheckpoint: undefined,
		currentLevel: undefined,
		equipped: undefined,
		objectives: [],
		flags: []
	},

	init: function() {
		var self = this;

		this.fadeOut();

		this.setupMusic();
		this.bindKeys();
		this.setupGUI();

		this.needs = new Needs();

		this.inventoryGUI = [],
		this.npcState = [];
		this.questNpcState = [];
		this.itemState = [];
		this.inventory = new Inventory();
		this.clouds = new CloudGenerator({repeatTime: 10});

		this.theScreenShaker = new ScreenShaker();

		this.stateObjects = {
			'state': this.state,
			'npcState': this.npcState,
			'questNpcState': this.questNpcState,
			'itemState': this.itemState
		};

		this.levelDirector = new ig.Director(this, [
			LevelTutorial,
			LevelSoupkitchen,
			LevelUberwelt,
			LevelOverworld,
			LevelSubwaystation,
			LevelTutorial2,
			LevelAi,
			LevelNsa_hq,
			LevelSubwayleft,
			LevelSubwayright,
			LevelSubwayhideout
		]);

		if(this.loadGame()) {
			this.state = this.stateObjects['state'];
			this.npcState = this.stateObjects['npcState'];
			this.questNpcState = this.stateObjects['questNpcState'];
			this.itemState = this.stateObjects['itemState'];

			if(this.state.inventory.length > 0) {
				for (var i = 0; i < this.state.inventory.length; i++) {
					this.inventory.addInventoryGUIButton(this.state.inventory[i]);
				}
			}

			if(this.state.currentLevel === undefined) this.levelDirector.firstLevel();
			else this.levelDirector.jumpTo(ig.global[this.state.currentLevel]);


		} else {
			this.levelDirector.firstLevel();
		}
	},


	unbindKeys: function() {
		ig.input.unbind( ig.KEY.A, 'left' );
		ig.input.unbind( ig.KEY.D, 'right' );
		ig.input.unbind( ig.KEY.W, 'up' );
		ig.input.unbind( ig.KEY.S, 'down' );
		ig.input.unbind( ig.KEY.SPACE, 'use');
		ig.input.unbind( ig.KEY.I, 'inventory');
		ig.input.unbind( ig.KEY.M, 'map');
		ig.input.unbind( ig.KEY.F, 'throw');
	},


	bindKeys: function() {
		ig.input.bind( ig.KEY.A, 'left' );
		ig.input.bind( ig.KEY.D, 'right' );
		ig.input.bind( ig.KEY.W, 'up' );
		ig.input.bind( ig.KEY.S, 'down' );
		ig.input.bind( ig.KEY.SPACE, 'use' );
		ig.input.bind( ig.KEY.E, 'action');
		ig.input.bind( ig.KEY.I, 'inventory');
		ig.input.bind( ig.KEY.M, 'map');
		ig.input.bind( ig.KEY.F, 'throw');
		ig.input.initMouse();
	},


	saveGame: function() {
		this.stateObjects = {
			'state': this.state,
			'npcState': this.npcState,
			'questNpcState': this.questNpcState,
			'itemState': this.itemState
		};

		if (!this.isCapable()) return false;

		for (key in this.stateObjects) {
			var obj = this.stateObjects[key];
			try {
				window.localStorage.setItem(key, JSON.stringify(obj));
			} catch(e) {
				if(e == QUOTA_EXCEEDED_ERR) console.log('localStorage quota exceeded');
				return false;
			}
		}

		var changeLevel = this.getEntitiesByType(EntityChangelevel)[0];
		changeLevel.resetLevel();
		this.newPopup("Game saved!");
		return true;
	},


	loadGame: function() {
		if (!this.isCapable()) return false;

		for (key in this.stateObjects) {
			try {
				this.stateObjects[key] = JSON.parse(localStorage.getItem(key));
				if(this.stateObjects[key] === null)  return false
			} catch(e) {
				return false;
			}
		}

		return true;
	},


	isCapable: function() {
		return !(typeof(window.localStorage) === 'undefined');
	},


	fadeOut: function(speed, callback) {
		var fadespeed = (typeof speed === "undefined") ? 3 : speed;
		if(typeof callback === "undefined") this.fader = new ig.ScreenFader ({fade: 'out', speed: fadespeed});
		else this.fader = new ig.ScreenFader ({fade: 'out', speed: fadespeed, callback: callback});
	},


	fadeIn: function(speed, callback) {
		var fadespeed = (typeof speed === "undefined") ? 3 : speed;
		if(typeof callback === "undefined") this.fader = new ig.ScreenFader ({fade: 'in', speed: fadespeed});
		else this.fader = new ig.ScreenFader ({fade: 'in', speed: fadespeed, callback: callback});
	},


	setupGUI: function() {
		var self = this;

		ig.gui.element.add({
			name: 'InventoryOpen',
			title: 'Inventory',
			group: 'inv',
			size: { x: 32, y: 32 },
			pos: { x: (ig.system.width -42), y:  (ig.system.height-42)},
			disabled: false,
			alpha: 0.7,
			toggle: false,
			active: true,
			state: {
				normal: {
					image: ig.game.buttonImages,
					tile: 0,
					tileSize: 32
				},
				hover: {
					image: ig.game.buttonImages,
					tile: 1,
					tileSize: 32
				},
				active: {
					image: ig.game.buttonImages,
					tile: 2,
					tileSize: 32
				}
			},
			click: function() {
				if(ig.game.state.flags.indexOf('cart') > -1) self.inventoryHUD.open = !self.inventoryHUD.open;
				if(!self.inventoryHUD.open){
					ig.gui.element.action('hideGroup', 'invItems');
					ig.gui.element.action('disableGroup', 'invItems');
				}
			}
		});

		// Set up dialog and inventory (GUI, basically) positions
		this.dialog.pos = {
			x: (ig.system.width / 2) - (this.dialog.image.width / 2),
			y: ig.system.height - this.dialog.image.height - 10
		};
		this.inventoryHUD.pos = {
			x: (ig.system.width / 2) - (this.inventoryHUD.image.width / 2),
			y: (ig.system.height / 2) - (this.inventoryHUD.image.height /2)
		};
		this.map.pos = {
			x: (ig.system.width / 2) - (this.map.image.width / 2),
			y:(ig.system.height / 2) - (this.map.image.height /2)
		}
	},


	setupMusic: function() {
		ig.music.add('media/music/main.ogg', 'Main');
		ig.music.volume = 1.0;
		ig.music.loop = true;
		ig.music.play('Main');
	},


	update: function() {
		this.parent();

		//  Get the player entity
		var player = this.getEntitiesByType( EntityPlayer )[0];

		// have the screen following the player, and rotate the players sprite to whereever the mouse is
		if( player ) {
			this.screen.x = player.pos.x - ig.system.width/2;
			this.screen.y = player.pos.y - ig.system.height/2;
		}

		this.checkNeeds();
		this.clouds.emitClouds();
		this.checkKeys();
		this.theScreenShaker.update();
		this.theScreenShaker.shakeScreen(this.screen);
	},


	checkNeeds: function() {
		this.state.hunger = this.needs.checkHunger();
		this.state.energy = this.needs.checkEnergy();
	},


	checkKeys: function(){
		var inv = ig.game.inventoryHUD.open;
		var map = ig.game.map.open;

		if(ig.input.pressed('inventory') && this.state.flags.indexOf('cart') > -1) ig.game.inventoryHUD.open = !inv;
		if(!inv) {
			ig.gui.element.action('disableGroup', 'invItems');
			ig.gui.element.action('hideGroup', 'invItems');
		}
		if(ig.input.pressed('map')) ig.game.map.open = !map;
	},


	newObjective: function(objective) {
		if(this.state.objectives.indexOf(objective) > -1) return;
		this.newObj = objective;
		this.state.objectives.push(objective);
	},


	completedObjective: function(objective) {
		var splice = this.state.objectives.indexOf(objective);
		this.state.objectives.splice(splice, 1);
		this.lastObjectivesLength = this.state.objectives.length;
	},


	drawGUI: function() {

		if(this.menuImage.open) {
			this.menuImage.pos = {
				x: (ig.system.width / 2) - (this.menuImage.image.width / 2),
				y: (ig.system.height / 4) - (this.menuImage.image.height / 2)
			};
			this.menuImage.image.draw(this.menuImage.pos.x, this.menuImage.pos.y);
		}

		// Draw dialog if there's any to draw
		if(this.dialog.pages.length != 0) {
			if(this.dialogDrawCounter != this.wrapLength) {
				this.dialogDrawCounter++;
			}

			this.dialog.pos = {
				x: (ig.system.width / 2) - (this.dialog.image.width / 2),
				y: this.dialog.image.height
			}
			this.dialog.image.draw(this.dialog.pos.x, this.dialog.pos.y);
			this.dialogImages.drawTile(this.dialog.pos.x+this.dialog.image.width-97, this.dialog.pos.y+1, this.talker, 98);

			var wrapper = new WordWrap(ig.game.dialog.pages[0], 37);
			var wrapLength = wrapper.wrap().length;
			this.font.draw(wrapper.wrap().slice(0, this.dialogDrawCounter), this.dialog.pos.x + 8, this.dialog.pos.y + 8, ig.Font.ALIGN.LEFT);
		}

		if(this.inventoryHUD.open) {

			this.inventoryHUD.image.draw(this.inventoryHUD.pos.x, this.inventoryHUD.pos.y);

			// Iterate through the inventory and draw every item
			var columns = Math.ceil((this.inventoryGUI.length)/5);

			for(var col = 0; col < columns; col+=1) {
				for(var row = 0; row < 5; row++) {
					item = this.inventoryGUI[col * 5 + row];
					if(!item) break;
					item.pos = {x: this.inventoryHUD.pos.x + 6 + (32*col), y: this.inventoryHUD.pos.y + 34 + (row*32)};
					ig.gui.element.action('enableGroup', 'invItems');
					ig.gui.element.action('showGroup', 'invItems');
				}
			}
		}


		if(ig.gui.show) ig.gui.draw();

		this.hud.image.draw(this.hud.pos.x, this.hud.pos.y);
		for(var hp = 0; hp < this.state.health; hp++) {
			this.hud.hpimg.draw(this.hud.pos.x + 5 + (hp*this.hud.hpimg.width), (this.hud.pos.y + 13));
		}

		this.needs_hud.image.draw(this.needs_hud.pos.x, this.needs_hud.pos.y);
		for(var hg = 0; hg < this.state.hunger; hg++) {
			this.needs_hud.hungerimg.draw(this.needs_hud.pos.x + 35 + (hg*this.needs_hud.hungerimg.width), (this.needs_hud.pos.y + 8));
		}
		for(var en = 0; en < this.state.energy; en++) {
			this.needs_hud.energyimg.draw(this.needs_hud.pos.x + 35 + (en*this.needs_hud.energyimg.width), (this.needs_hud.pos.y + 38));
		}

		this.equipFrame.draw(ig.system.width - 84, ig.system.height - 42);

		if(this.state.equipped){
			this.invImages.drawTile(ig.system.width - 84, ig.system.height-42, this.state.equipped.image, 32);
		}

		if(this.map.open && this.state.flags.indexOf('map') > -1) {
			this.map.image.draw(this.map.pos.x, this.map.pos.y)
		}

		this.drawObjectives();
		this.drawPopup();

		this.font.draw('$'+this.state.money.toFixed(2), ig.system.width-10, ig.system.height-60,ig.Font.ALIGN.RIGHT);
	},


	drawObjectives: function() {
		var length = this.state.objectives.length;

		if(length > 0) {
			if(this.lastObjectivesLength === 0) {
				this.font.draw('Current Objectives:'.slice(0,this.objectivesDrawCounter), ig.system.width - 10, this.hud.pos.y, ig.Font.ALIGN.RIGHT);
			} else {
				this.font.draw('Current Objectives:', ig.system.width - 10, this.hud.pos.y, ig.Font.ALIGN.RIGHT);
			}
			if(this.lastObjectivesLength != length) {
				for(var i = 0; i < length; i++) {
					if(i === length - 1) {
						this.fontsmall.draw(this.state.objectives[length-1].slice(0, this.objectivesDrawCounter), ig.system.width - 10, this.hud.pos.y+(14*(i+1)), ig.Font.ALIGN.RIGHT);
					}
					else this.fontsmall.draw(this.state.objectives[i], ig.system.width - 10, this.hud.pos.y+(14*(i+1)), ig.Font.ALIGN.RIGHT);
				}
				this.objectivesDrawCounter++;
			} else {
				for(var i = 0; i < length; i++) {
					this.fontsmall.draw(this.state.objectives[i], ig.system.width - 10, this.hud.pos.y+(14*(i+1)), ig.Font.ALIGN.RIGHT);
				}
			}

			if(this.newObj && this.objectivesDrawCounter === this.newObj.length) {
				this.lastObjectivesLength = length;
				this.objectivesDrawCounter = 0;
			}

		}
	},


	newPopup: function(popup) {
		this.popup = popup;
		if(this.popupTimerSet) this.popupTimerSet = false;
		this.newPop = true;
		this.popupDrawCounter = 0;
	},


	drawPopup: function() {
		if(this.popup === undefined || this.newPop === false) return;

		var wrapper = new WordWrap(this.popup, 50);
		var wrapLength = wrapper.wrap().length;

		if(this.popupDrawCounter === this.popup.length) {
			if(this.popupTimerSet == false) {
				this.popupTimer.set(this.popupDisplayTime);
				this.popupTimerSet = true;
			}
			this.font.draw(wrapper.wrap(), ig.system.width / 2,  ig.system.height  / 2, ig.Font.ALIGN.CENTER);
		} else {
			this.font.draw(wrapper.wrap().slice(0, this.popupDrawCounter), ig.system.width / 2,  ig.system.height  / 2, ig.Font.ALIGN.CENTER);
			this.popupDrawCounter++;
		}

		if(this.popupTimerSet && this.popupTimer.delta() >= 0) {
			this.popup = undefined;
			this.newPop = false;
			this.popupTimerSet = false;
		}

	},


	startCountdown: function(selfD) {
		this.drawCountdownOn = true;
		this.sec = 120;
		this.secTimer = new ig.Timer(1);// second counter initialise
	},



	drawCountdown: function() {
		if(this.secTimer.delta() > 0){
			this.sec--;
			this.secTimer.reset() ;
		}

		if (this.sec === 0) {
			this.getEntitiesByType(EntityPlayer)[0].die();
			this.drawCountdownOn = false;
		}

		this.font.draw(ig.game.sec, ig.system.width / 2,  ig.system.height  / 3, ig.Font.ALIGN.CENTER);
	},


	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		this.drawGUI();
		if (this.drawCountdownOn) this.drawCountdown();

		if (this.fader && !this.fader.isCompleted) {
			this.fader.draw();
		}
	}

});

// Start the Game with 60fps, a resolution of 1024x768, scaled
// up by a factor of 1
ig.main('#canvas', ParentScreen, 60, 1024, 768, 1);

});
