/*
    Dialog generator class

    This class simple holds all of the dialog scenes in an object,
    and returns them to the dialog GUI update in main.js when the
    NPC with the corresponding dialogKey is activated

*/
ig.module(
	'game.classes.dialog'
)
.requires(
	'impact.game',
	'impact.font'
)
.defines(function(){

     DialogGenerator = ig.Class.extend({

        /* global place to store dialog - could store separately in
            a text file, but FileReader() might not be supported in all browsers
            that Impact supports...not sure
        */
        dialog: {
            1: ['this is my dialog', 'it is a test', 'i have 3 things I want to say']
        },

        init:function () {
        },

        getDialog:function(number){
            return this.dialog[number];
        }

    });

});
