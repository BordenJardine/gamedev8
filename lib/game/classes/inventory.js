
ig.module(
	'game.classes.inventory'
)
.requires(
	'impact.game'
)
.defines(function(){

Inventory = ig.Class.extend({

	itemUses: {
		box: {
			use: function(player) {
				if(!player.inBox) {
					player.inBox = true;
					player.hidden = true;
					player.movementSpeed = player.movementSpeed / (ig.game.state.equipped.itemStrength / 2);
					player.currentAnim = player.anims.boxHide;
				} else {
					player.inBox = false;
					player.hidden = false;
					player.movementSpeed = player.baseMovementSpeed;
					player.currentAnim = player.anims.boxAway;
				}
			}
		},
		gun: {
			use: function(player) {
				var rotated_angle = player.currentAnim.angle;
				x_to_spawn = player.pos.x + (player.size.x/2);
				y_to_spawn = player.pos.y + (player.size.y/2);
				ig.game.spawnEntity(EntityBullet, x_to_spawn, y_to_spawn,{angle:rotated_angle});
			}
		},
		food: {
			use: function(player) {
				ig.game.inventory.removeFromInventory(ig.game.inventory.searchInventory('food'));
				player.eat();
			}
		},
		tincan: {
			use: function(player) {
				ig.game.inventory.removeFromInventory(ig.game.inventory.searchInventory('tincan'));
				player.tossCan();

				can = ig.game.inventory.searchInventory('tincan');
				if(can.quantity == undefined || can.quantity < 1) ig.game.state.equipped = undefined;

			}
		},
		debris: {
			use: function(player) {
				ig.game.inventory.removeFromInventory(ig.game.inventory.searchInventory('debris'));
				player.tossDebris();

				debris = ig.game.inventory.searchInventory('debris');
				if(debris.quantity == undefined || debris.quantity < 1) ig.game.state.equipped = undefined;

			}
		},
		panhandlingcan: {
			use: function(player) {
				var entities = ig.game.getEntitiesByType(EntityNpc);
				for (var i = 0; i < entities.length; i++) {
					if(player.touches(entities[i])) {
						entities[i].requestMoney();
						break;
					}
				}
			}
		},
		leadPipe: {
			use: function(player) {
				var entities = ig.game.getEntitiesByType(EntityBaddy);
				for (var i = 0; i < entities.length; i++) {
					if(player.distanceTo(entities[i]) < 50) {
						entities[i].takeDown();
						break;
					}
				}
			}
		},
    tinfoilhat: {
      use: function(player) {
        if(!player.inTinfoil) {
          ig.game.newPopup("You can feel that your metal state is more focused");
					player.inTinfoil = true;
				} else {
          ig.game .newPopup("Your metal focus dissapates");
					player.inTinfoil = false;
				}
      }
    }
	},


	init: function() {
		this.itemCooldown = new ig.Timer()
		this.cooldownTime = 1;
		this.itemUseCooldown = false;
		this.itemCooldown.set(this.cooldownTime);

		this.clickCooldown = new ig.Timer();
		this.clickCooldown.set(1);
		this.onCooldown = false;
	},


	itemCopy: function(o) {
		var copy = Object.create(o);
		for (prop in o) {
			if (o.hasOwnProperty(prop)) {
				copy[prop] = o[prop];
			}
		}
		return copy;
	},


	addToInventory: function(item, itemGUID){
		if(item.nonInventory == 'true') {
			if(item.name == 'cart') {
				ig.game.state.flags.push('cart');
				ig.game.newPopup('To use the cart, press inventory (I). Items you pick up will go in your cart.')
			}
		} else {
			if(item.name == 'box') {
				ig.game.newPopup('To use the box, equip it by clicking on it in the inventory. To use your currently equipped item, press use (SPACE).')
			} else if(item.name == 'leadPipe') {
				ig.game.newPopup('A lead pipe...with this you could put some NSA agents to sleep if you snuck up close enough.');
			}

			var itemGUI = ig.gui.element.action('getByName', item.name);

			var item = this.itemCopy(item);

			if(itemGUI == undefined) {
				item.quantity = 1;
				ig.game.state.inventory.push(item);
				this.addInventoryGUIButton(item);
			} else {
				var invIdx = this.searchInventoryForIdx(item.name);
				ig.game.state.inventory[invIdx].quantity++;
				itemGUI.title = (parseInt(itemGUI.title) + 1).toString();
			}
		}

		if ( typeof itemGUID !== "undefined") ig.game.itemState.push(itemGUID);
    else if (typeof item.GUID !== "undefined") ig.game.itemState.push(item.GUID);
	},


	trySell: function(item) {
		if(item.sellable === false || item.price == undefined) {
			ig.game.newPopup("This item is not sellable");
			return;
		}

		ig.game.state.money += item.price / 2;
		this.removeFromInventory(item);
	},


	removeFromInventory: function(item){
		var idx = this.searchInventoryForIdx(item.name);
		var guiIdx =  ig.game.inventoryGUI.indexOf(ig.gui.element.action('getByName', item.name));
		var itemGUI = ig.gui.element.action('getByName', item.name);

		if(item.quantity > 1) {
			ig.game.state.inventory[idx].quantity -= 1;
			itemGUI.title = (parseInt(itemGUI.title) - 1).toString();
		} else  {
			ig.gui.element.action('remove', item.name);
			ig.game.state.inventory.splice(idx, 1);
			if(guiIdx > -1) ig.game.inventoryGUI.splice(guiIdx, 1);
		}
	},


	// Returns the items index, or false if it doesn't exist
	searchInventoryForIdx: function(itemName){
		for(var i = 0; i < ig.game.state.inventory.length; i++) {
			if(ig.game.state.inventory[i].name == itemName) {
				return i;
			}
		}

		return false;
	},


	// Returns an item objects, or false if it doesn't exist
	searchInventory: function(itemName){
		var idx = this.searchInventoryForIdx(itemName);

		if(idx !== false)  var item = ig.game.state.inventory[idx];
		if(typeof item !== "undefined") return item;

		return false;
	},


	itemClicked: function(item) {
		if(this.onCooldown) {
			if(this.clickCooldown.delta() > 0) this.onCooldown = false;
			else return;
		}

		var player = ig.game.getEntitiesByType(EntityPlayer)[0];

		if(ig.game.menuImage.open) this.trySell(item);
		else if(item.type == 'equippable' && !this.onCooldown && !player.inBox) this.equipItem(item);
		else if (player.inBox || player.inTinfoil) ig.game.newPopup("You can't equip that with another item active!");
		else if(item.type == 'consumable' && !this.onCooldown) this.useConsumableItem(item);

		this.onCooldown = true;
		this.clickCooldown.reset();
	},


	equipItem: function(item) {
		if(ig.game.state.equipped !== undefined) {
			var equipped = ig.game.state.equipped;
			var guiItem = ig.gui.element.action('getByName', equipped.name);
			guiItem.group = 'invItems';
			ig.game.inventoryGUI.push(guiItem);
			ig.gui.element.action('enable', equipped.name);
			ig.gui.element.action('show', equipped.name);
		}

		var guiItem = ig.gui.element.action('getByName', item.name);
		var guiIdx =  ig.game.inventoryGUI.indexOf(guiItem);

		ig.game.state.equipped = item;
		ig.game.inventoryGUI.splice(guiIdx, 1);
		guiItem.group = 'equipped';
		ig.gui.element.action('disable', item.name);
		ig.gui.element.action('hide', item.name);
	},


	usePressed: function(player) {
		if(this.itemCooldown.delta() > 0) {
			this.itemUseCooldown = false;
		}

		if (ig.game.state.equipped != undefined && !this.itemUseCooldown) {
			var item = ig.game.state.equipped;

			this.itemUseCooldown = true;
			this.itemCooldown.reset();

			this.useItem(item, player);
		}
	},


	useItem: function(item, player) {
		if(this.itemUses[item.name] != undefined) this.itemUses[item.name].use(player);
	},


	useConsumableItem:function(item) {
		var player = ig.game.getEntitiesByType(EntityPlayer)[0];
		if (this.itemUses[item.name] != undefined) this.itemUses[item.name].use(player);
	},


	addInventoryGUIButton: function(item) {
		var self = this;

		ig.gui.element.add({
			name: item.name,
			title: '1',
			showTitle: true,
			font: ig.game.fontsmall,
			group: 'invItems',
			size: { x: 32, y: 32 },
			pos: {x:0, y:0},
			disabled: false,
			state: {
				normal: {
					image: ig.game.invImages,
					tile: item.image,
					tileSize: 32
				},
			},
			click: function() {

				var foundItem = self.searchInventory(item.name)

				if (foundItem) {
					self.itemClicked(foundItem);
				}

			}
		});

		ig.game.inventoryGUI.push(ig.gui.element.action('getByName', item.name));
		ig.gui.element.action('hideGroup', 'invItems');
		ig.gui.element.action('disableGroup', 'invItems');
	},
});

});
