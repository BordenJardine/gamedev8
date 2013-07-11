
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
					player.movementSpeed = player.movementSpeed / ig.game.state.equipped.itemStrength;
					player.currentAnim = player.anims.boxHide;
				} else {
					player.inBox = false;
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
				player.eat();
			}
		}
	},

	init: function() {

	},


	addToInventory: function(item, itemGUID){
		var itemGUID = typeof itemGUID !== "undefined" ? itemGUID : 0;

		if(item.nonInventory == 'true') {
			if(item.name == 'cart') {
				ig.game.state.flags.push('cart');
				ig.game.newPopup('To use the cart, press inventory (I). Items you pick up will go in your cart.')
			}
			return;
		} else {
			if(item.name == 'box') {
				ig.game.newPopup('To use the box, equip it by clicking on it in the inventory. To use your currently equipped item, press use (SPACE).')
			}

			var itemGUI = ig.gui.element.action('getByName', item.name);
			if(itemGUI == undefined) {
				ig.game.state.inventory.push(item);
				this.addInventoryGUIButton(item);
			} else {
				itemGUI.title = (parseInt(itemGUI.title) + 1).toString();
			}
		}

		ig.game.itemState.push(itemGUID);
	},


	removeFromInventory: function(item){
		var idx = this.searchInventoryForIdx(item.name);
		var guiIdx =  ig.game.inventoryGUI.indexOf(ig.gui.element.action('getByName', item.name));
		var itemGUI = ig.gui.element.action('getByName', item.name);

		ig.game.state.inventory.splice(idx, 1);

		if(foundItem > 1) {
			foundItem.quantity -= 1;
			itemGUI.title = (parseInt(itemGUI.title) - 1).toString();
		} else ig.game.inventoryGUI.splice(guiIdx, 1);
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
		if(idx) var item = ig.game.state.inventory[idx];
		if(typeof(item) != undefined) return item;

		return false;
	},

	itemClicked: function(item) {
		if(item.type == 'equippable') ig.game.state.equipped = item;
		if(item.type == 'consumable') this.useItem(item);
	},

	useItem: function(item) {
		console.log(item);
		console.log(this.itemUses[item.name], this.itemUses[0]);
		var player = ig.game.getEntitiesByType( EntityPlayer )[0];
		if(this.itemUses[item.name] != undefined) this.itemUses[item.name].use(player);
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

				var foundItem = self.searchInventory(this.name)
				if (foundItem) {
					self.itemClicked(foundItem);
				}

				// Hide everything when something was clicked
				// or equipped
				ig.gui.element.action('disableGroup', 'invItems');
				ig.gui.element.action('hideGroup', 'invItems');
				ig.game.inventory.open = false;
			}
		});
		ig.game.inventoryGUI.push(ig.gui.element.action('getByName', item.name));
		ig.gui.element.action('hideGroup', 'invItems');
		ig.gui.element.action('disableGroup', 'invItems');
	},
});

});
