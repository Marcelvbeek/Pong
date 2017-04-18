$(function() {
    "use strict"

    let canvas = document.getElementById('canvas');
    let options = {

    };

    /**
     * Initialize hammer, an touch library
     */
    let canvasHammer = new Hammer.Manager(canvas);
    let pan = new Hammer.Pan();
    let press = new Hammer.Press();
    let tap = new Hammer.Tap();
    canvasHammer.add(pan);
    canvasHammer.add(press);
    canvasHammer.add(tap);

    class game {
        /**
         * 
         * @param {*} canvas 
         */
        constructor(canvas) {
            this.canvas = canvas;
            this.activePlayers = [];
            this.init();
        }

        /**
         * Initialize game
         */
        init() {
            let self = this;

            var playerNumber = null;
            var playerGroup = null;
            var alreadyInGroup = false;
            var startingPoint = 0;
            var swipeGroup = [];
            /**
             * Pan start
             */
            canvasHammer.on('panstart', function(ev) {
                if (self.checkIfAlreadyInGroup(ev)) {
                    console.log(ev);
                    alreadyInGroup = true;
                    startingPoint = ev;
                } else {
                    alreadyInGroup = false;
                    playerGroup = self.initializeGroup(ev);
                    let player = self.getNewPlayer(playerGroup, ev);
                    self.addPlayerToCanvas(player.element);
                    playerNumber = player.number;
                }
            });


            /**
             * Pan start
             */
            canvasHammer.on('panmove', function(ev) {
                if (!alreadyInGroup) {
                    let player = self.getNewPlayer(playerGroup, ev);
                    self.addPlayerToCanvas(player.element);
                    playerNumber = player.number;
                } else {
                    swipeGroup.push(ev);

                }
            });

            /**
             * Pan start
             */
            canvasHammer.on('panend', function(ev) {
                if (!alreadyInGroup) {
                    var groupSize = self.setTotalGroupSize(self.activePlayers[playerGroup - 1].players);
                    self.activePlayers[playerGroup - 1].size = groupSize;
                } else {
                    swipeGroup.push(ev);

                    var dist = 30;
                    var angle = self.getAngle(startingPoint, ev);
                    var x = Math.cos(angle * Math.PI / -180) * dist;
                    var y = Math.sin(angle * Math.PI / -180) * dist;

                    var element = $(document.createElement('div'));
                    $(element).addClass('player');
                    $(self.canvas).append($(element));

                    $(element).css({
                        'position': 'absolute',
                        'top': ev.center.y,
                        'left': ev.center.x
                    });

                    setInterval(function() {
                        $(element).animate({ 'left': '+=' + x + 'px', 'top': '+=' + -y + 'px' }, 100);
                    }, 10);

                }
            });

            // Bij het indrukken ook een simpele animatie, tonen van een afbeelding naar keuze 
            canvasHammer.on('tap', function(ev) { 
                var element = $(document.createElement('div'));
                $(element).addClass('pong');
                $(self.canvas).append($(element));

                $(element).css({
                    'position': 'absolute',
                    'top': ev.center.y,
                    'left': ev.center.x
                });

            });

        }

        getAngle(begin, endpoint) {
            return Math.atan2(endpoint.center.y - begin.center.y, endpoint.center.x - begin.center.x) * 180 / Math.PI;
        }

        checkIfAlreadyInGroup(ev) {
            var self = this;
            var alreadyInGroup = false;
            if (self.activePlayers) {
                self.activePlayers.forEach(function(group) {
                    if (group.size) {
                        if ((ev.center.x < group.size.right) && (ev.center.x > group.size.left) && (ev.center.y > group.size.bottom) && (ev.center.y < group.size.top)) {
                            alreadyInGroup = true;
                        }
                    }
                });
            }
            console.log(alreadyInGroup);
            return alreadyInGroup;
        }

        setTotalGroupSize(arrayOfPlayers) {
            var coordinates = {
                left: 8000,
                right: 0,
                top: 0,
                bottom: 8000
            }
            arrayOfPlayers.forEach(player => {
                if (player.center.x > coordinates.right) {
                    coordinates.right = player.center.x
                }
                if (player.center.x < coordinates.left) {
                    coordinates.left = player.center.x
                }
                if (player.center.y > coordinates.top) {
                    coordinates.top = player.center.y
                }
                if (player.center.y < coordinates.bottom) {
                    coordinates.bottom = player.center.y
                }
            });

            return coordinates;
        }

        initializeGroup() {
            var emptyArray = [];
            var playerGroup = this.activePlayers.push(emptyArray);
            this.activePlayers[playerGroup - 1].players = [];
            return playerGroup;
        }

        /**
         * Get player element
         * @param {object} event
         * @return {object} element
         */

        getNewPlayer(playerGroup, ev) {
            var number = this.activePlayers[playerGroup - 1].players.push(ev);
            var element = $(document.createElement('div'));
            $(element).addClass('player');
            $(element).attr('id', 'player_' + playerGroup + '_' + number);
            element = this.setPlayerProperties(ev, $(element));
            return {
                element: $(element),
                number: number
            }
        }


        setTimeOutForPlayer(playerGroup) {
            let self = this;
            /* remove player after random amount of time */
            setTimeout(function() {
                $('*[id^="player_' + playerGroup + '"]').remove();
            }, (Math.random() * 1400));
        }

        /**
         * Set player properties like location and so on
         * @param {object} ev event 
         */
        setPlayerProperties(ev, element) {
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
        addPlayerToCanvas(player) {
            $(this.canvas).append(player);
        }

        /**
         * 
         * @param {*} number 
         */
        getPlayerElementID(number, playerGroup) {
            return 'player_' + playerGroup + '_' + number
        }

        /**
         * 
         * @param {*} playerElementId 
         */
        removePlayerFromCanvas(playerElementId) {
            $(this.canvas).find('#' + playerElementId).remove();
        }
    }

    let newGame = new game(canvas);
});