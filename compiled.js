'use strict';

var _createClass = function() {
    function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor); } } return function(Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

$(function() {
    "use strict";

    var canvas = document.getElementById('canvas');
    var options = {};

    /**
     * Initialize hammer, an touch library
     */
    var canvasHammer = new Hammer.Manager(canvas);
    var pan = new Hammer.Pan();
    canvasHammer.add(pan);

    var game = function() {
        /**
         * 
         * @param {*} canvas 
         */
        function game(canvas) {
            _classCallCheck(this, game);

            this.canvas = canvas;
            this.activePlayers = [];
            this.init();
        }

        /**
         * Initialize game
         */


        _createClass(game, [{
            key: 'init',
            value: function init() {
                var self = this;

                var playerNumber = null;
                var playerGroup = null;

                /**
                 * Pan start
                 */
                canvasHammer.on('panstart', function(ev) {
                    playerGroup = self.initializeGroup(ev);
                    var player = self.getNewPlayer(playerGroup, ev);
                    self.addPlayerToCanvas(player.element);
                    playerNumber = player.number;
                });

                /**
                 * Pan start
                 */
                canvasHammer.on('panmove', function(ev) {
                    var player = self.getNewPlayer(playerGroup, ev);
                    self.addPlayerToCanvas(player.element);
                    playerNumber = player.number;
                });

                /**
                 * Pan start
                 */
                canvasHammer.on('panend', function(ev) {
                    self.setTimeOutForPlayer(playerGroup);
                });
            }
        }, {
            key: 'initializeGroup',
            value: function initializeGroup() {
                var emptyArray = [];
                var playerGroup = this.activePlayers.push(emptyArray);
                return playerGroup;
            }

            /**
             * Get player element
             * @param {object} event
             * @return {object} element
             */

        }, {
            key: 'getNewPlayer',
            value: function getNewPlayer(playerGroup, ev) {
                var number = this.activePlayers[playerGroup - 1].push(ev);
                var element = $(document.createElement('div'));
                $(element).addClass('player');
                $(element).attr('id', 'player_' + playerGroup + '_' + number);
                element = this.setPlayerProperties(ev, $(element));
                return {
                    element: $(element),
                    number: number
                };
            }
        }, {
            key: 'setTimeOutForPlayer',
            value: function setTimeOutForPlayer(playerGroup) {
                var self = this;
                /* remove player after random amount of time */
                setTimeout(function() {
                    $('*[id^="player_' + playerGroup + '"]').remove();
                }, Math.random() * 1400);
            }

            /**
             * Set player properties like location and so on
             * @param {object} ev event 
             */

        }, {
            key: 'setPlayerProperties',
            value: function setPlayerProperties(ev, element) {
                /**
                 * Set element properties
                 */
                element.css({
                    'position': 'absolute',
                    'top': ev.center.y,
                    'left': ev.center.x
                });
                return element;
            }

            /**
             * Add player to canvas
             * @param {object} player 
             */

        }, {
            key: 'addPlayerToCanvas',
            value: function addPlayerToCanvas(player) {
                $(this.canvas).append(player);
            }

            /**
             * 
             * @param {*} number 
             */

        }, {
            key: 'getPlayerElementID',
            value: function getPlayerElementID(number, playerGroup) {
                return 'player_' + playerGroup + '_' + number;
            }

            /**
             * 
             * @param {*} playerElementId 
             */

        }, {
            key: 'removePlayerFromCanvas',
            value: function removePlayerFromCanvas(playerElementId) {
                $(this.canvas).find('#' + playerElementId).remove();
            }
        }]);

        return game;
    }();

    var newGame = new game(canvas);
});