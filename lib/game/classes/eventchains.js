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

        owner: undefined,

        init: function (entity) {
            this.owner = entity;
        },

        getBasicChain:function(dialogKey, callback, entity){
            var self = this;

            var dialogs = ig.game.dialog.fillPages.getDialog(dialogKey);
            var numDialogs = dialogs.length;
            var dialogIdx = 0;
            var dialogTimer = new ig.Timer();

            var dialogChain = EventChain()
                .wait(.1)
                .then(function() {
                    ig.game.counter = 0;
                    ig.game.dialog.pages.push(dialogs[dialogIdx]);
                    dialogTimer.set(.5);
                })
                .wait()
                .orUntil(function() {
                    if(dialogTimer.delta() < 0) {
                        return false
                    } else {
                        return ig.input.state('action');
                    }
                })
                .then(function() {
                    ig.game.dialog.pages.pop();
                    dialogIdx += 1;
                    if(dialogIdx === numDialogs) {
                        self.finished(entity);
                    }
                })
                .repeat(numDialogs)

            return dialogChain;
        },

        finished: function(entity) {
            entity.dialogActive = false;
            entity.dialogCompleted = true;
            ig.game.npcState.push(entity.name);
        },

        getAdvChain: function() {

        }

    });

});
