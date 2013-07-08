/*
    Dialog generator class

    This class simply holds all of the dialog scenes in an object,
    and returns them to the dialog GUI update in main.js when the
    NPC with the corresponding dialogKey is activated

*/
ig.module(
	'game.classes.eventchains'
)
.requires(
	'impact.game',
    'game.system.eventChain'
)
.defines(function(){

     EventGenerator = ig.Class.extend({

        init: function (questItemNum) {
            this.questItemNum = typeof questItemNum !== undefined ? questItemNum : undefined;
        },

        getBasicChain:function(dialogKey, callback, entity){
            var self = this;

            var dialogs = ig.game.dialog.fillPages.getDialog(dialogKey);
            var numDialogs = dialogs.length;
            var dialogIdx = 0;
            var dialogTimer = new ig.Timer();
            var actionTime = false;

            var dialogChain = EventChain()
                .then(function() {
                    if(ig.global.NPC_SCRIPT.indexOf(dialogs[dialogIdx]) > -1) actionTime = true;

                    if(actionTime) ig.game.bindKeys();
                    else {
                        ig.game.unbindKeys();
                        ig.game.counter = 0;
                        ig.game.dialog.pages.push(dialogs[dialogIdx]);
                        dialogTimer.set(.5);
                    }
                })
                .wait()
                .orUntil(function() {
                    if(actionTime) {
                        var action = dialogs[dialogIdx];
                        if (action == 'waitForItem') {
                            for(var i = 0; i < ig.game.state.inventory.length; i++) {
                                if(ig.game.state.inventory[i].questItemNum == self.questItemNum) {
                                    return true;
                                }
                            }
                        } else if (action == 'moveToLocation') {

                        } else {
                            console.log('ERROR: NO SUCH ACTION DEFINED');
                        }
                    } else {
                        if(dialogTimer.delta() < 0) {
                            return false
                        } else {
                            return ig.input.state('action');
                        }
                    }
                })
                .then(function() {
                    if(actionTime) actionTime = false;
                    } else {
                        ig.game.dialog.pages.pop();
                    }

                    dialogIdx += 1;
                    if(dialogIdx === numDialogs) {
                        self.finished(entity);
                    }
                })
                .repeat(numDialogs)

            return dialogChain;
        },

        finished: function(entity) {
            ig.game.bindKeys();
            entity.dialogActive = false;
            entity.dialogCompleted = true;
            ig.game.npcState.push(entity.name);
        },

        getAdvChain: function() {

        }

    });

});
