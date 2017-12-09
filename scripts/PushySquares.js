/**
 * @version 1.0.6545.9324
 * @copyright mulangsu
 * @compiler Bridge.NET 16.5.0
 */
Bridge.assembly("PushySquares", function ($asm, globals) {
    "use strict";

    Bridge.define("PushySquares.ArrayExtensions", {
        statics: {
            methods: {
                ItemAt: function (T, array, pos) {
                    return array.get([pos.X, pos.Y]);
                },
                SetItemAt: function (T, array, pos, value) {
                    array.set([pos.X, pos.Y], value);
                },
                PositionsOf$1: function (array, tile) {
                    var list = new (System.Collections.Generic.List$1(PushySquares.Position)).ctor();
                    for (var x = 0; x < System.Array.getLength(array, 0); x = (x + 1) | 0) {
                        for (var y = 0; y < System.Array.getLength(array, 1); y = (y + 1) | 0) {
                            if (array.get([x, y]) === tile) {
                                list.add(new PushySquares.Position.$ctor1(x, y));
                            }
                        }
                    }
                    return list;
                },
                PositionsOf: function (array, color) {
                    return PushySquares.ArrayExtensions.PositionsOf$1(array, PushySquares.TileExtensions.FromColor(color));
                }
            }
        }
    });

    Bridge.define("PushySquares.Color", {
        $kind: "enum",
        statics: {
            fields: {
                Color1: 1,
                Color2: 2,
                Color3: 3,
                Color4: 4,
                Grey: 0
            }
        }
    });

    Bridge.define("PushySquares.Direction", {
        $kind: "enum",
        statics: {
            fields: {
                Up: 0,
                Down: 1,
                Left: 2,
                Right: 3
            }
        }
    });

    Bridge.define("PushySquares.Game", {
        statics: {
            fields: {
                PlayerCountToTurnsUntilNewSquare: null
            },
            ctors: {
                init: function () {
                    this.PlayerCountToTurnsUntilNewSquare = function (_o1) {
                            _o1.add(2, 2);
                            _o1.add(3, 4);
                            _o1.add(4, 4);
                            return _o1;
                        }(new (System.Collections.Generic.Dictionary$2(System.Int32,System.Int32))());
                }
            }
        },
        fields: {
            Board: null,
            Spawnpoints: null,
            Players: null,
            currentPlayerIndex: 0,
            Delegate: null
        },
        props: {
            CurrentPlayer: {
                get: function () {
                    return this.Players.getItem(this.currentPlayerIndex);
                }
            }
        },
        ctors: {
            init: function () {
                this.currentPlayerIndex = 0;
            },
            $ctor1: function (map, playerCount, lives) {
                if (lives === void 0) { lives = 5; }

                this.$initialize();
                this.Board = map.Board;
                this.Spawnpoints = map.Spawnpoints;
                this.Players = new (System.Collections.Generic.List$1(PushySquares.Player)).ctor();
                if (playerCount === 4) {
                    this.Players.add(new PushySquares.Player(PushySquares.Game.PlayerCountToTurnsUntilNewSquare.get(playerCount), lives, PushySquares.Color.Color4));
                    this.SpawnNewSquare(PushySquares.Color.Color4);
                }
                if (playerCount >= 3) {
                    this.Players.add(new PushySquares.Player(PushySquares.Game.PlayerCountToTurnsUntilNewSquare.get(playerCount), lives, PushySquares.Color.Color2));
                    this.SpawnNewSquare(PushySquares.Color.Color2);
                }
                this.Players.add(new PushySquares.Player(PushySquares.Game.PlayerCountToTurnsUntilNewSquare.get(playerCount), lives, PushySquares.Color.Color1));
                this.SpawnNewSquare(PushySquares.Color.Color1);
                this.Players.add(new PushySquares.Player(PushySquares.Game.PlayerCountToTurnsUntilNewSquare.get(playerCount), lives, PushySquares.Color.Color3));
                this.SpawnNewSquare(PushySquares.Color.Color3);
                this.Players.sort$2(function (x, y) {
                    return Bridge.compare(x.Color, Bridge.box(y.Color, PushySquares.Color, System.Enum.toStringFn(PushySquares.Color)));
                });
                if (playerCount < 4) {
                    this.Spawnpoints.remove(PushySquares.Color.Color4);
                }
                if (playerCount < 3) {
                    this.Spawnpoints.remove(PushySquares.Color.Color2);
                }

                this.CurrentPlayer.TurnsUntilNewSquare = (this.CurrentPlayer.TurnsUntilNewSquare - 1) | 0;
            },
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            MoveDown: function () {
                this.Move(function (x) {
                    return x.Below;
                }, function (x, y) {
                    return Bridge.compare(y.Y, x.Y);
                }, PushySquares.Direction.Down);
            },
            MoveUp: function () {
                this.Move(function (x) {
                    return x.Above;
                }, function (x, y) {
                    return Bridge.compare(x.Y, y.Y);
                }, PushySquares.Direction.Up);
            },
            MoveRight: function () {
                this.Move(function (x) {
                    return x.Right;
                }, function (x, y) {
                    return Bridge.compare(y.X, x.X);
                }, PushySquares.Direction.Right);
            },
            MoveLeft: function () {
                this.Move(function (x) {
                    return x.Left;
                }, function (x, y) {
                    return Bridge.compare(x.X, y.X);
                }, PushySquares.Direction.Left);
            },
            toString: function () {
                var builder = new System.Text.StringBuilder();
                var dict = function (_o1) {
                        _o1.add(PushySquares.Tile.SquareColor1, "🚹");
                        _o1.add(PushySquares.Tile.SquareColor2, "🚺️");
                        _o1.add(PushySquares.Tile.SquareColor3, "🚼");
                        _o1.add(PushySquares.Tile.SquareColor4, "❇️️ ");
                        return _o1;
                    }(new (System.Collections.Generic.Dictionary$2(PushySquares.Tile,System.String))());
                builder.appendLine(System.String.format("Current Turn: {0}", [dict.get(PushySquares.TileExtensions.FromColor(this.CurrentPlayer.Color))]));
                builder.append("Lives: ");
                this.Players.forEach(function (x) {
                    builder.append(System.String.format("{0} ", [Bridge.box(x.Lives, System.Int32)]));
                });
                builder.appendLine();
                builder.appendLine(System.String.format("New Square In: {0}", [Bridge.box(this.CurrentPlayer.TurnsUntilNewSquare, System.Int32)]));
                for (var y = 0; y < System.Array.getLength(this.Board, 1); y = (y + 1) | 0) {
                    for (var x = 0; x < System.Array.getLength(this.Board, 0); x = (x + 1) | 0) {
                        switch (this.Board.get([x, y])) {
                            case PushySquares.Tile.Empty: 
                                builder.append("⬜️");
                                break;
                            case PushySquares.Tile.Void: 
                                builder.append("  ");
                                break;
                            case PushySquares.Tile.Wall: 
                                builder.append("🔲");
                                break;
                            case PushySquares.Tile.SquareGrey: 
                                builder.append("ℹ️️ ");
                                break;
                            case PushySquares.Tile.SquareColor1: 
                                builder.append("🚹");
                                break;
                            case PushySquares.Tile.SquareColor2: 
                                builder.append("🚺️");
                                break;
                            case PushySquares.Tile.SquareColor3: 
                                builder.append("🚼️");
                                break;
                            case PushySquares.Tile.SquareColor4: 
                                builder.append("❇️️ ");
                                break;
                        }
                    }
                    builder.appendLine();
                }
                return builder.toString();
            },
            CreateCopy: function () {
                var copy = new PushySquares.Game.ctor();
                copy.Board = Bridge.cast(System.Array.clone(this.Board), System.Array.type(PushySquares.Tile, 2));
                copy.Spawnpoints = new (System.Collections.Generic.Dictionary$2(PushySquares.Color,PushySquares.Position))(this.Spawnpoints);
                copy.currentPlayerIndex = this.currentPlayerIndex;
                copy.Players = System.Linq.Enumerable.from(this.Players).select(function (x) {
                        return x.CreateCopy();
                    }).toList(PushySquares.Player);
                return copy;
            },
            SpawnNewSquare: function (c) {
                PushySquares.ArrayExtensions.SetItemAt(Bridge.global.PushySquares.Tile, this.Board, this.Spawnpoints.get(c), PushySquares.TileExtensions.FromColor(c));
            },
            NextTurn: function () {
                var retVal = null;
                if (!System.Linq.Enumerable.from(this.Players).any(function (x) {
                        return x.Lives > 0;
                    })) {
                    return PushySquares.Color.Grey;
                }
                do {
                    this.currentPlayerIndex = this.currentPlayerIndex === ((this.Players.Count - 1) | 0) ? 0 : ((this.currentPlayerIndex + 1) | 0);
                } while (this.CurrentPlayer.Lives === 0);
                this.CurrentPlayer.TurnsUntilNewSquare = (this.CurrentPlayer.TurnsUntilNewSquare - 1) | 0;
                if (this.CurrentPlayer.TurnsUntilNewSquare === 0) {
                    if (PushySquares.ArrayExtensions.ItemAt(Bridge.global.PushySquares.Tile, this.Board, this.Spawnpoints.get(this.CurrentPlayer.Color)) === PushySquares.Tile.Empty) {
                        this.SpawnNewSquare(this.CurrentPlayer.Color);
                        retVal = this.CurrentPlayer.Color;
                    }
                    this.CurrentPlayer.TurnsUntilNewSquare = (PushySquares.Game.PlayerCountToTurnsUntilNewSquare.get(this.Players.Count) + 1) | 0;
                }
                return retVal;
            },
            HandleDeaths: function (destroyedSquarePositions) {
                var $t, $t1;
                var retVal = new (System.Collections.Generic.List$1(PushySquares.Position)).ctor();
                $t = Bridge.getEnumerator(this.Players);
                try {
                    while ($t.moveNext()) {
                        var player = { v : $t.Current };
                        var destroyedSquares = System.Linq.Enumerable.from(destroyedSquarePositions).where((function ($me, player) {
                                return Bridge.fn.bind($me, function (x) {
                                    return PushySquares.ArrayExtensions.ItemAt(Bridge.global.PushySquares.Tile, this.Board, x) === PushySquares.TileExtensions.FromColor(player.v.Color);
                                });
                            })(this, player));
                        player.v.Lives = (player.v.Lives - (destroyedSquares.count())) | 0;
                        if (player.v.Lives === 0) {
                            $t1 = Bridge.getEnumerator(PushySquares.ArrayExtensions.PositionsOf(this.Board, player.v.Color));
                            try {
                                while ($t1.moveNext()) {
                                    var pos = $t1.Current;
                                    retVal.add(pos);
                                    PushySquares.ArrayExtensions.SetItemAt(Bridge.global.PushySquares.Tile, this.Board, pos, PushySquares.Tile.SquareGrey);
                                }
                            } finally {
                                if (Bridge.is($t1, System.IDisposable)) {
                                    $t1.System$IDisposable$dispose();
                                }
                            }}
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$dispose();
                    }
                }return retVal;
            },
            Move: function (displacement, sorter, direction) {
                var $step = 0,
                    $jumpFromFinally, 
                    allSquarePositions, 
                    newSquareColor, 
                    $t, 
                    movingSquaresPositions, 
                    beingDestroyedSquaresPositions, 
                    $t1, 
                    position, 
                    pushedPositions, 
                    $t2, 
                    sortedPositions, 
                    greyedOutSquaresPositions, 
                    $t3, 
                    position1, 
                    tile, 
                    newSquareColor1, 
                    $t4, 
                    $asyncBody = Bridge.fn.bind(this, function () {
                        for (;;) {
                            $step = System.Array.min([0,1,2,3,4,5,6,7,8,9,10,11,12], $step);
                            switch ($step) {
                                case 0: {
                                    allSquarePositions = PushySquares.ArrayExtensions.PositionsOf(this.Board, this.CurrentPlayer.Color);
                                    if (allSquarePositions.Count === 0) {
                                        newSquareColor = this.NextTurn();
                                        !Bridge.staticEquals(($t = this.Delegate), null) ? $t(direction, new (System.Collections.Generic.List$1(PushySquares.Position)).ctor(), new (System.Collections.Generic.List$1(PushySquares.Position)).ctor(), new (System.Collections.Generic.List$1(PushySquares.Position)).ctor(), newSquareColor) : null;
                                        return;
                                    }

                                    movingSquaresPositions = new (System.Collections.Generic.List$1(PushySquares.Position)).ctor();
                                    beingDestroyedSquaresPositions = new (System.Collections.Generic.List$1(PushySquares.Position)).ctor();
                                    $t1 = Bridge.getEnumerator(allSquarePositions);
                                    $step = 1;
                                    continue;
                                }
                                case 1: {
                                    if ($t1.moveNext()) {
                                        position = { v : $t1.Current };
                                        $step = 2;
                                        continue;
                                    }
                                    $step = 12;
                                    continue;
                                }
                                case 2: {
                                    pushedPositions = (function ($me, position) {
                                        return function (_o1) {
                                            _o1.add(position.v);
                                            return _o1;
                                        };
                                    })(this, position)(new (System.Collections.Generic.List$1(PushySquares.Position)).ctor());
                                    
                                    $step = 3;
                                    continue;
                                }
                                case 3: {
                                    if ( true ) {
                                        $step = 4;
                                        continue;
                                    } 
                                    $step = 10;
                                    continue;
                                }
                                case 4: {
                                    $t2 = PushySquares.ArrayExtensions.ItemAt(Bridge.global.PushySquares.Tile, this.Board, displacement(System.Linq.Enumerable.from(pushedPositions).last()));
                                    if ($t2 === PushySquares.Tile.Empty) {
                                        $step = 5;
                                        continue;
                                    }
                                    else if ($t2 === PushySquares.Tile.Wall) {
                                        $step = 6;
                                        continue;
                                    }
                                    else if ($t2 === PushySquares.Tile.Void) {
                                        $step = 7;
                                        continue;
                                    }
                                    else if ($t2 === PushySquares.Tile.SquareColor1 || $t2 === PushySquares.Tile.SquareColor2 || $t2 === PushySquares.Tile.SquareColor3 || $t2 === PushySquares.Tile.SquareColor4 || $t2 === PushySquares.Tile.SquareGrey) {
                                        $step = 8;
                                        continue;
                                    }
                                    $step = 9;
                                    continue;
                                }
                                case 5: {
                                    $step = 11;
                                    continue;
                                }
                                case 6: {
                                    pushedPositions.clear();
                                    $step = 11;
                                    continue;
                                }
                                case 7: {
                                    beingDestroyedSquaresPositions.add(System.Linq.Enumerable.from(pushedPositions).last());
                                    $step = 11;
                                    continue;
                                }
                                case 8: {
                                    pushedPositions.add(displacement(System.Linq.Enumerable.from(pushedPositions).last()));
                                    $step = 9;
                                    continue;
                                }
                                case 9: {
                                    
                                    $step = 3;
                                    continue;
                                }
                                case 10: {

                                }
                                case 11: {
                                    movingSquaresPositions.addRange(pushedPositions);
                                    $step = 1;
                                    continue;
                                }
                                case 12: {
                                    sortedPositions = System.Linq.Enumerable.from(movingSquaresPositions).distinct().toList(PushySquares.Position);
                                    sortedPositions.sort$2(sorter);
                                    beingDestroyedSquaresPositions = System.Linq.Enumerable.from(beingDestroyedSquaresPositions).distinct().toList(PushySquares.Position);
                                    greyedOutSquaresPositions = this.HandleDeaths(beingDestroyedSquaresPositions);
                                    $t3 = Bridge.getEnumerator(sortedPositions);
                                    try {
                                        while ($t3.moveNext()) {
                                            position1 = $t3.Current;
                                            tile = PushySquares.ArrayExtensions.ItemAt(Bridge.global.PushySquares.Tile, this.Board, position1);
                                            PushySquares.ArrayExtensions.SetItemAt(Bridge.global.PushySquares.Tile, this.Board, position1, PushySquares.Tile.Empty);
                                            if (!beingDestroyedSquaresPositions.contains(position1)) {
                                                PushySquares.ArrayExtensions.SetItemAt(Bridge.global.PushySquares.Tile, this.Board, displacement(position1), tile);
                                            }
                                        }
                                    } finally {
                                        if (Bridge.is($t3, System.IDisposable)) {
                                            $t3.System$IDisposable$dispose();
                                        }
                                    }newSquareColor1 = this.NextTurn();
                                    !Bridge.staticEquals(($t4 = this.Delegate), null) ? $t4(direction, movingSquaresPositions, beingDestroyedSquaresPositions, greyedOutSquaresPositions, newSquareColor1) : null;
                                    return;
                                }
                                default: {
                                    return;
                                }
                            }
                        }
                    }, arguments);

                return $asyncBody();
            }
        }
    });

    Bridge.define("PushySquares.GameAI", {
        fields: {
            gameStates: null,
            wSelfLife: 0,
            wDiffLives: 0,
            wSquareThreshold: 0,
            wSelfSpreadBelowThreshold: 0,
            wSelfSpreadAboveThreshold: 0,
            wOpponentSpread: 0,
            wSelfInDanger: 0,
            wOpponentInDangerBelowThreshold: 0,
            wOpponentInDangerAboveThreshold: 0,
            myColor: 0
        },
        props: {
            CurrentGame: {
                get: function () {
                    return this.gameStates.peek();
                }
            }
        },
        ctors: {
            init: function () {
                this.gameStates = new (System.Collections.Generic.Stack$1(PushySquares.Game)).ctor();
            },
            ctor: function (game, myColor, wSelfLife, wDiffLives, wSquareThreshold, wSelfSpreadBelowThreshold, wSelfSpreadAboveThreshold, wOpponentSpread, wSelfInDanger, wOpponentInDangerBelowThreshold, wOpponentInDangerAboveThreshold) {
                this.$initialize();
                this.gameStates.push(game);
                this.myColor = myColor;
                this.wSelfLife = wSelfLife;
                this.wDiffLives = wDiffLives;
                this.wSquareThreshold = wSquareThreshold;
                this.wSelfSpreadBelowThreshold = wSelfSpreadBelowThreshold;
                this.wSelfSpreadAboveThreshold = wSelfSpreadAboveThreshold;
                this.wOpponentSpread = wOpponentSpread;
                this.wSelfInDanger = wSelfInDanger;
                this.wOpponentInDangerBelowThreshold = wOpponentInDangerBelowThreshold;
                this.wOpponentInDangerAboveThreshold = wOpponentInDangerAboveThreshold;
            }
        },
        methods: {
            EvaluateHeuristics: function () {
                var $t;
                var livingPlayers = System.Linq.Enumerable.from(this.CurrentGame.Players).where(function (x) {
                        return x.Lives > 0;
                    }).toList(PushySquares.Player);
                var me = PushySquares.GameExtensions.GetPlayer(this.CurrentGame, this.myColor);
                if (me.Lives === 0) {
                    return -2147483648;
                }
                if (livingPlayers.Count === 1 && me.Lives > 0) {
                    return 2147483647;
                }
                if (livingPlayers.Count === 0) {
                    return 0;
                }
                var finalSelfLives = me.Lives;
                var opponents = PushySquares.GameExtensions.OpponentsOf(this.CurrentGame, this.myColor);
                var finalDiffLives = 0;
                if (livingPlayers.Count === 2) {
                    finalDiffLives = (me.Lives - PushySquares.GameExtensions.GetPlayer(this.CurrentGame, System.Linq.Enumerable.from(opponents).first()).Lives) | 0;
                }
                var mySquares = PushySquares.ArrayExtensions.PositionsOf(this.CurrentGame.Board, this.myColor);
                var finalSelfSpread = (-this.GetSpread(mySquares, this.CurrentGame.Spawnpoints.get(this.myColor))) | 0;
                var finalOpponentSpread = (Bridge.Int.div(System.Linq.Enumerable.from(opponents).select(Bridge.fn.bind(this, function (x) {
                        return this.GetSpread(PushySquares.ArrayExtensions.PositionsOf(this.CurrentGame.Board, x), this.CurrentGame.Spawnpoints.get(x));
                    })).sum(), opponents.Count)) | 0;
                var selfInDanger = System.Linq.Enumerable.from(mySquares).select(Bridge.fn.bind(this, function (x) {
                        return this.IsInDanger(x, this.IsEdge(x), this.myColor);
                    })).where(function (x) {
                    return x;
                }).count();
                if (selfInDanger >= me.Lives) {
                    return -2147483648;
                }
                var finalSelfInDanger = (-selfInDanger) | 0;
                var opponentInDanger = 0;
                $t = Bridge.getEnumerator(opponents);
                try {
                    while ($t.moveNext()) {
                        var opponent = { v : $t.Current };
                        opponentInDanger = (opponentInDanger + (System.Linq.Enumerable.from(PushySquares.ArrayExtensions.PositionsOf(this.CurrentGame.Board, opponent.v)).select((function ($me, opponent) {
                                return Bridge.fn.bind($me, function (x) {
                                    return this.IsInDanger(x, this.IsEdge(x), opponent.v);
                                });
                            })(this, opponent)).where(function (x) {
                            return x;
                        }).count())) | 0;
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$dispose();
                    }
                }var finalOpponentInDanger = opponentInDanger;
                return ((((((((((Bridge.Int.mul(finalSelfLives, this.wSelfLife) + Bridge.Int.mul(finalDiffLives, this.wDiffLives)) | 0) + Bridge.Int.mul(finalSelfSpread, (mySquares.Count < this.wSquareThreshold ? this.wSelfSpreadBelowThreshold : this.wSelfSpreadAboveThreshold))) | 0) + Bridge.Int.mul(finalOpponentSpread, this.wOpponentSpread)) | 0) + Bridge.Int.mul(finalSelfInDanger, this.wSelfInDanger)) | 0) + Bridge.Int.mul(finalOpponentInDanger, (mySquares.Count < this.wSquareThreshold ? this.wOpponentInDangerBelowThreshold : this.wOpponentInDangerAboveThreshold))) | 0);
            },
            NextMove: function () {
                return this.Minimax(6, this.myColor).item2;
            },
            GetSpread: function (positions, pivot) {
                var maxX = System.Linq.Enumerable.from(positions).select(function (x) {
                        return Math.abs(((x.X - pivot.X) | 0));
                    });
                var maxY = System.Linq.Enumerable.from(positions).select(function (x) {
                        return Math.abs(((x.Y - pivot.Y) | 0));
                    });
                if (maxX.count() !== 0 && maxY.count() !== 0) {
                    return Math.max(maxX.max(), maxY.max());
                }
                return 0;
            },
            IsEdge: function (position) {
                var edges = new (System.Collections.Generic.List$1(PushySquares.Direction)).ctor();
                if (PushySquares.ArrayExtensions.ItemAt(Bridge.global.PushySquares.Tile, this.CurrentGame.Board, position.Above) === PushySquares.Tile.Void) {
                    edges.add(PushySquares.Direction.Up);
                }
                if (PushySquares.ArrayExtensions.ItemAt(Bridge.global.PushySquares.Tile, this.CurrentGame.Board, position.Below) === PushySquares.Tile.Void) {
                    edges.add(PushySquares.Direction.Down);
                }
                if (PushySquares.ArrayExtensions.ItemAt(Bridge.global.PushySquares.Tile, this.CurrentGame.Board, position.Left) === PushySquares.Tile.Void) {
                    edges.add(PushySquares.Direction.Left);
                }
                if (PushySquares.ArrayExtensions.ItemAt(Bridge.global.PushySquares.Tile, this.CurrentGame.Board, position.Right) === PushySquares.Tile.Void) {
                    edges.add(PushySquares.Direction.Right);
                }
                return edges;
            },
            IsInDanger: function (position, edges, c) {
                var $t;
                $t = Bridge.getEnumerator(edges);
                try {
                    while ($t.moveNext()) {
                        var edge = $t.Current;
                        var translate = null;
                        switch (edge) {
                            case PushySquares.Direction.Down: 
                                translate = function (x) {
                                    return x.Above;
                                };
                                break;
                            case PushySquares.Direction.Up: 
                                translate = function (x) {
                                    return x.Below;
                                };
                                break;
                            case PushySquares.Direction.Left: 
                                translate = function (x) {
                                    return x.Right;
                                };
                                break;
                            case PushySquares.Direction.Right: 
                                translate = function (x) {
                                    return x.Left;
                                };
                                break;
                        }
                        var curr = position;
                        while (true) {
                            curr = translate(curr);
                            var tile = PushySquares.ArrayExtensions.ItemAt(Bridge.global.PushySquares.Tile, this.CurrentGame.Board, curr);
                            if (tile === PushySquares.Tile.Empty || tile === PushySquares.Tile.Void || tile === PushySquares.Tile.Wall) {
                                break;
                            }
                            if (tile !== PushySquares.TileExtensions.FromColor(c)) {
                                return true;
                            }
                        }
                    }
                } finally {
                    if (Bridge.is($t, System.IDisposable)) {
                        $t.System$IDisposable$dispose();
                    }
                }return false;
            },
            Minimax: function (depth, color) {
                var $t, $t1;
                var bestScore = color === this.myColor ? -2147483648 : 2147483647;
                var currentScore;
                var bestDirection = null;
                if (System.Linq.Enumerable.from(this.CurrentGame.Players).where(function (x) {
                        return x.Lives > 0;
                    }).count() < 2 || depth === 0) {
                    bestScore = this.EvaluateHeuristics();
                } else {
                    var squareCount = PushySquares.ArrayExtensions.PositionsOf(this.CurrentGame.Board, color).Count;
                    var moves = squareCount === 0 ? System.Array.init([PushySquares.Direction.Up], PushySquares.Direction) : System.Array.init([PushySquares.Direction.Up, PushySquares.Direction.Down, PushySquares.Direction.Left, PushySquares.Direction.Right], PushySquares.Direction);
                    $t = Bridge.getEnumerator(moves);
                    try {
                        while ($t.moveNext()) {
                            var move = $t.Current;
                            var gameCopy = this.CurrentGame.CreateCopy();
                            PushySquares.GameExtensions.Move(gameCopy, move);
                            this.gameStates.push(gameCopy);
                            if (color === this.myColor) {
                                currentScore = this.Minimax(((depth - 1) | 0), this.CurrentGame.CurrentPlayer.Color).item1;
                                if (currentScore > bestScore) {
                                    bestScore = currentScore;
                                    bestDirection = move;
                                }
                            } else {
                                currentScore = this.Minimax(((depth - 1) | 0), this.CurrentGame.CurrentPlayer.Color).item1;
                                if (currentScore < bestScore) {
                                    bestScore = currentScore;
                                    bestDirection = move;
                                }
                            }
                            this.gameStates.pop();
                        }
                    } finally {
                        if (Bridge.is($t, System.IDisposable)) {
                            $t.System$IDisposable$dispose();
                        }
                    }}
                return { item1: bestScore, item2: ($t1 = bestDirection, $t1 != null ? $t1 : PushySquares.Direction.Left) };
            }
        }
    });

    Bridge.define("PushySquares.GameExtensions", {
        statics: {
            methods: {
                GetPlayer: function (game, color) {
                    return System.Linq.Enumerable.from(game.Players).where(function (x) {
                            return x.Color === color;
                        }).first();
                },
                OpponentsOf: function (game, color) {
                    return System.Linq.Enumerable.from(game.Players).where(function (x) {
                            return x.Color !== color;
                        }).select(function (x) {
                        return x.Color;
                    }).toList(PushySquares.Color);
                },
                Move: function (game, direction) {
                    switch (direction) {
                        case PushySquares.Direction.Down: 
                            game.MoveDown();
                            break;
                        case PushySquares.Direction.Up: 
                            game.MoveUp();
                            break;
                        case PushySquares.Direction.Left: 
                            game.MoveLeft();
                            break;
                        case PushySquares.Direction.Right: 
                            game.MoveRight();
                            break;
                    }
                }
            }
        }
    });

    Bridge.define("PushySquares.MainClass", {
        main: function Main (args) {
            
        }
    });

    Bridge.define("PushySquares.Map", {
        $kind: "struct",
        statics: {
            fields: {
                Standard: null
            },
            ctors: {
                init: function () {
                    this.Standard = new PushySquares.Map();
                    this.Standard = new PushySquares.Map.$ctor2("....OO....\n.1++++++2.\n.++++++++.\n.++++++++.\nO+++OO+++O\nO+++OO+++O\n.++++++++.\n.++++++++.\n.4++++++3.\n....OO....");
                }
            },
            methods: {
                getDefaultValue: function () { return new PushySquares.Map(); }
            }
        },
        fields: {
            Board: null,
            Spawnpoints: null
        },
        ctors: {
            $ctor1: function (board, spawnpoints) {
                this.$initialize();
                this.Board = board;
                this.Spawnpoints = spawnpoints;
            },
            $ctor2: function (mapString) {
                var $t;
                this.$initialize();
                var lines = System.Linq.Enumerable.from(System.String.split(mapString, ($t = "\n", System.String.toCharArray($t, 0, $t.length)).map(function(i) {{ return String.fromCharCode(i); }}))).where(function (x) {
                        return !Bridge.referenceEquals(x, "");
                    }).toArray(System.String);
                this.Board = System.Array.create(0, null, PushySquares.Tile, lines[System.Array.index(0, lines)].length, lines.length);
                this.Spawnpoints = new (System.Collections.Generic.Dictionary$2(PushySquares.Color,PushySquares.Position))();
                for (var i = 0; i < lines.length; i = (i + 1) | 0) {
                    for (var j = 0; j < lines[System.Array.index(i, lines)].length; j = (j + 1) | 0) {
                        var c = lines[System.Array.index(i, lines)].charCodeAt(j);
                        switch (c) {
                            case 46: 
                                this.Board.set([i, j], PushySquares.Tile.Void);
                                break;
                            case 43: 
                                this.Board.set([i, j], PushySquares.Tile.Empty);
                                break;
                            case 79: 
                                this.Board.set([i, j], PushySquares.Tile.Wall);
                                break;
                            case 49: 
                                this.Board.set([i, j], PushySquares.Tile.Empty);
                                this.Spawnpoints.set(PushySquares.Color.Color1, new PushySquares.Position.$ctor1(i, j));
                                break;
                            case 50: 
                                this.Board.set([i, j], PushySquares.Tile.Empty);
                                this.Spawnpoints.set(PushySquares.Color.Color2, new PushySquares.Position.$ctor1(i, j));
                                break;
                            case 51: 
                                this.Board.set([i, j], PushySquares.Tile.Empty);
                                this.Spawnpoints.set(PushySquares.Color.Color3, new PushySquares.Position.$ctor1(i, j));
                                break;
                            case 52: 
                                this.Board.set([i, j], PushySquares.Tile.Empty);
                                this.Spawnpoints.set(PushySquares.Color.Color4, new PushySquares.Position.$ctor1(i, j));
                                break;
                        }
                    }
                }
            },
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            getHashCode: function () {
                var h = Bridge.addHash([7364941, this.Board, this.Spawnpoints]);
                return h;
            },
            equals: function (o) {
                if (!Bridge.is(o, PushySquares.Map)) {
                    return false;
                }
                return Bridge.equals(this.Board, o.Board) && Bridge.equals(this.Spawnpoints, o.Spawnpoints);
            },
            $clone: function (to) {
                var s = to || new PushySquares.Map();
                s.Board = this.Board;
                s.Spawnpoints = this.Spawnpoints;
                return s;
            }
        }
    });

    Bridge.define("PushySquares.Player", {
        fields: {
            TurnsUntilNewSquare: 0,
            lives: 0,
            Color: 0
        },
        props: {
            Lives: {
                get: function () {
                    return this.lives;
                },
                set: function (value) {
                    this.lives = value === 0 ? 0 : value;
                }
            }
        },
        ctors: {
            ctor: function (turnsUntilNewSquare, lives, color) {
                this.$initialize();
                this.Lives = lives;
                this.TurnsUntilNewSquare = turnsUntilNewSquare;
                this.Color = color;
            }
        },
        methods: {
            CreateCopy: function () {
                return new PushySquares.Player(this.TurnsUntilNewSquare, this.Lives, this.Color);
            }
        }
    });

    Bridge.define("PushySquares.Position", {
        $kind: "struct",
        statics: {
            methods: {
                getDefaultValue: function () { return new PushySquares.Position(); }
            }
        },
        fields: {
            X: 0,
            Y: 0
        },
        props: {
            Above: {
                get: function () {
                    return new PushySquares.Position.$ctor1(this.X, ((this.Y - 1) | 0));
                }
            },
            Below: {
                get: function () {
                    return new PushySquares.Position.$ctor1(this.X, ((this.Y + 1) | 0));
                }
            },
            Right: {
                get: function () {
                    return new PushySquares.Position.$ctor1(((this.X + 1) | 0), this.Y);
                }
            },
            Left: {
                get: function () {
                    return new PushySquares.Position.$ctor1(((this.X - 1) | 0), this.Y);
                }
            }
        },
        ctors: {
            $ctor1: function (x, y) {
                this.$initialize();
                this.X = x;
                this.Y = y;
            },
            ctor: function () {
                this.$initialize();
            }
        },
        methods: {
            getHashCode: function () {
                return ((Bridge.Int.mul(this.X, 1000) + this.Y) | 0);
            },
            toString: function () {
                return System.String.format("({0}, {1})", Bridge.box(this.X, System.Int32), Bridge.box(this.Y, System.Int32));
            },
            equals: function (o) {
                if (!Bridge.is(o, PushySquares.Position)) {
                    return false;
                }
                return Bridge.equals(this.X, o.X) && Bridge.equals(this.Y, o.Y);
            },
            $clone: function (to) { return this; }
        }
    });

    Bridge.define("PushySquares.Tile", {
        $kind: "enum",
        statics: {
            fields: {
                Empty: 0,
                Void: 1,
                Wall: 2,
                SquareColor1: 3,
                SquareColor2: 4,
                SquareColor3: 5,
                SquareColor4: 6,
                SquareGrey: 7
            }
        }
    });

    Bridge.define("PushySquares.TileExtensions", {
        statics: {
            methods: {
                FromColor: function (color) {
                    switch (color) {
                        case PushySquares.Color.Color1: 
                            return PushySquares.Tile.SquareColor1;
                        case PushySquares.Color.Color2: 
                            return PushySquares.Tile.SquareColor2;
                        case PushySquares.Color.Color3: 
                            return PushySquares.Tile.SquareColor3;
                        case PushySquares.Color.Color4: 
                            return PushySquares.Tile.SquareColor4;
                        case PushySquares.Color.Grey: 
                            return PushySquares.Tile.SquareGrey;
                        default: 
                            throw new System.ArgumentException("Invalid Color!");
                    }
                }
            }
        }
    });
});

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICJQdXNoeVNxdWFyZXMuanMiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbIlBvc2l0aW9uLmNzIiwiR2FtZS5jcyIsIkdhbWVBSS5jcyIsIlByb2dyYW0uY3MiLCJNYXAuY3MiLCJQbGF5ZXIuY3MiLCJUaWxlLmNzIl0sCiAgIm5hbWVzIjogWyIiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7OztrQ0E2QnlCQSxHQUFHQSxPQUFpQkE7b0JBQ2pDQSxPQUFPQSxXQUFNQSxPQUFPQTs7cUNBR0tBLEdBQUdBLE9BQWlCQSxLQUFjQTtvQkFDM0RBLFdBQU1BLE9BQU9BLFFBQVNBOzt5Q0FHZUEsT0FBb0JBO29CQUN6REEsV0FBV0EsS0FBSUE7b0JBQ2ZBLEtBQUtBLFdBQVdBLElBQUlBLGtDQUFvQkE7d0JBQ3BDQSxLQUFLQSxXQUFXQSxJQUFJQSxrQ0FBb0JBOzRCQUNwQ0EsSUFBSUEsV0FBTUEsR0FBR0EsUUFBTUE7Z0NBQ2ZBLFNBQVNBLElBQUlBLDZCQUFTQSxHQUFHQTs7OztvQkFJckNBLE9BQU9BOzt1Q0FHOEJBLE9BQW9CQTtvQkFDekRBLE9BQU9BLGtEQUFrQkEsc0NBQXlCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NERDM0N5QkEsQUFBeURBLFVBQUNBOzRCQUFPQTs0QkFBYUE7NEJBQWFBOzRCQUFhQSxPQUFPQTswQkFBakZBLEtBQUlBOzs7Ozs7Ozs7Ozs7OztvQkFNaEZBLE9BQU9BLHFCQUFRQTs7Ozs7Ozs7OEJBR3BDQSxLQUFTQSxhQUFpQkE7Ozs7Z0JBQ2xDQSxhQUFRQTtnQkFDUkEsbUJBQWNBO2dCQUNkQSxlQUFVQSxLQUFJQTtnQkFDZEEsSUFBSUE7b0JBQ0FBLGlCQUFhQSxJQUFJQSxvQkFBUUEsdURBQWlDQSxjQUFjQSxPQUFPQTtvQkFDL0VBLG9CQUFnQkE7O2dCQUVwQkEsSUFBSUE7b0JBQ0FBLGlCQUFhQSxJQUFJQSxvQkFBUUEsdURBQWlDQSxjQUFjQSxPQUFPQTtvQkFDL0VB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c3RlbTtcclxudXNpbmcgU3lzdGVtLkNvbGxlY3Rpb25zLkdlbmVyaWM7XHJcblxyXG5uYW1lc3BhY2UgUHVzaHlTcXVhcmVzIHtcclxuXHRwdWJsaWMgc3RydWN0IFBvc2l0aW9uIHtcclxuXHRcdHB1YmxpYyBpbnQgWCB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuXHRcdHB1YmxpYyBpbnQgWSB7IGdldDsgcHJpdmF0ZSBzZXQ7IH1cclxuXHJcblx0XHRwdWJsaWMgb3ZlcnJpZGUgaW50IEdldEhhc2hDb2RlICgpIHtcclxuXHRcdFx0cmV0dXJuIFggKiAxMDAwICsgWTtcclxuXHRcdH1cclxuXHJcblx0XHRwdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIFRvU3RyaW5nICgpXHJcblx0XHR7XHJcblx0XHRcdHJldHVybiBzdHJpbmcuRm9ybWF0KFwiKHswfSwgezF9KVwiLFgsWSk7XHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIFBvc2l0aW9uKGludCB4LCBpbnQgeSkge1xyXG5cdFx0XHRYID0geDtcclxuXHRcdFx0WSA9IHk7XHJcblx0XHR9XHJcblxyXG5cdFx0cHVibGljIFBvc2l0aW9uIEFib3ZlIHtnZXR7cmV0dXJuIG5ldyBQb3NpdGlvbihYLCBZIC0gMSk7fX1cclxuXHRcdHB1YmxpYyBQb3NpdGlvbiBCZWxvdyAge2dldHtyZXR1cm4gbmV3IFBvc2l0aW9uIChYLCBZICsgMSk7fX1cclxuXHRcdHB1YmxpYyBQb3NpdGlvbiBSaWdodCB7Z2V0e3JldHVybiBuZXcgUG9zaXRpb24gKFggKyAxLCBZKTt9fVxyXG5cdFx0cHVibGljIFBvc2l0aW9uIExlZnQge2dldHtyZXR1cm4gbmV3IFBvc2l0aW9uIChYIC0gMSwgWSk7fX1cclxuXHR9XHJcblxyXG5cdHB1YmxpYyBzdGF0aWMgY2xhc3MgQXJyYXlFeHRlbnNpb25zIHtcclxuXHRcdHB1YmxpYyBzdGF0aWMgVCBJdGVtQXQ8VD4odGhpcyBUWyxdIGFycmF5LCBQb3NpdGlvbiBwb3MpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5W3Bvcy5YLCBwb3MuWV07XHJcblx0XHR9XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBTZXRJdGVtQXQ8VD4odGhpcyBUWyxdIGFycmF5LCBQb3NpdGlvbiBwb3MsIFQgdmFsdWUpIHtcclxuICAgICAgICAgICAgYXJyYXlbcG9zLlgsIHBvcy5ZXSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBMaXN0PFBvc2l0aW9uPiBQb3NpdGlvbnNPZih0aGlzIFRpbGVbLF0gYXJyYXksIFRpbGUgdGlsZSkge1xyXG4gICAgICAgICAgICB2YXIgbGlzdCA9IG5ldyBMaXN0PFBvc2l0aW9uPigpO1xyXG4gICAgICAgICAgICBmb3IgKGludCB4ID0gMDsgeCA8IGFycmF5LkdldExlbmd0aCgwKTsgeCsrKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKGludCB5ID0gMDsgeSA8IGFycmF5LkdldExlbmd0aCgxKTsgeSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGFycmF5W3gsIHldID09IHRpbGUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5BZGQobmV3IFBvc2l0aW9uKHgsIHkpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGxpc3Q7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgc3RhdGljIExpc3Q8UG9zaXRpb24+IFBvc2l0aW9uc09mKHRoaXMgVGlsZVssXSBhcnJheSwgQ29sb3IgY29sb3IpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5LlBvc2l0aW9uc09mKFRpbGVFeHRlbnNpb25zLkZyb21Db2xvcihjb2xvcikpO1xyXG4gICAgICAgIH1cclxuXHR9XHJcbn0iLCJ1c2luZyBTeXN0ZW07XG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbnVzaW5nIFN5c3RlbS5MaW5xO1xudXNpbmcgU3lzdGVtLlRleHQ7XG5cbm5hbWVzcGFjZSBQdXNoeVNxdWFyZXMge1xuICAgIHB1YmxpYyBjbGFzcyBHYW1lIHtcbiAgICAgICAgcHVibGljIHN0YXRpYyByZWFkb25seSBEaWN0aW9uYXJ5PGludCwgaW50PiBQbGF5ZXJDb3VudFRvVHVybnNVbnRpbE5ld1NxdWFyZSA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBEaWN0aW9uYXJ5PGludCwgaW50PigpLChfbzEpPT57X28xLkFkZCgyLDIpO19vMS5BZGQoMyw0KTtfbzEuQWRkKDQsNCk7cmV0dXJuIF9vMTt9KTtcblxuICAgICAgICBwdWJsaWMgVGlsZVssXSBCb2FyZCB7IGdldDsgc2V0OyB9XG4gICAgICAgIHB1YmxpYyBEaWN0aW9uYXJ5PENvbG9yLCBQb3NpdGlvbj4gU3Bhd25wb2ludHMgeyBnZXQ7IHNldDsgfVxuICAgICAgICBwdWJsaWMgTGlzdDxQbGF5ZXI+IFBsYXllcnMgeyBnZXQ7IHNldDsgfVxuICAgICAgICBwcml2YXRlIGludCBjdXJyZW50UGxheWVySW5kZXggPSAwO1xuICAgICAgICBwdWJsaWMgUGxheWVyIEN1cnJlbnRQbGF5ZXIge2dldHtyZXR1cm4gUGxheWVyc1tjdXJyZW50UGxheWVySW5kZXhdO319XG4gICAgICAgIHB1YmxpYyBHYW1lRGVsZWdhdGUgRGVsZWdhdGUgeyBnZXQ7IHNldDsgfVxuXG4gICAgICAgIHB1YmxpYyBHYW1lKE1hcCBtYXAsIGludCBwbGF5ZXJDb3VudCwgaW50IGxpdmVzID0gNSkge1xuICAgICAgICAgICAgQm9hcmQgPSBtYXAuQm9hcmQ7XG4gICAgICAgICAgICBTcGF3bnBvaW50cyA9IG1hcC5TcGF3bnBvaW50cztcbiAgICAgICAgICAgIFBsYXllcnMgPSBuZXcgTGlzdDxQbGF5ZXI+KCk7XG4gICAgICAgICAgICBpZiAocGxheWVyQ291bnQgPT0gNCkge1xuICAgICAgICAgICAgICAgIFBsYXllcnMuQWRkIChuZXcgUGxheWVyIChQbGF5ZXJDb3VudFRvVHVybnNVbnRpbE5ld1NxdWFyZVtwbGF5ZXJDb3VudF0sIGxpdmVzLCBDb2xvci5Db2xvcjQpKTtcbiAgICAgICAgICAgICAgICBTcGF3bk5ld1NxdWFyZSAoQ29sb3IuQ29sb3I0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwbGF5ZXJDb3VudCA+PSAzKSB7XG4gICAgICAgICAgICAgICAgUGxheWVycy5BZGQgKG5ldyBQbGF5ZXIgKFBsYXllckNvdW50VG9UdXJuc1VudGlsTmV3U3F1YXJlW3BsYXllckNvdW50XSwgbGl2ZXMsIENvbG9yLkNvbG9yMikpO1xuICAgICAgICAgICAgICAgIFNwYXduTmV3U3F1YXJlIChDb2xvci5Db2xvcjIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgUGxheWVycy5BZGQobmV3IFBsYXllcihQbGF5ZXJDb3VudFRvVHVybnNVbnRpbE5ld1NxdWFyZVtwbGF5ZXJDb3VudF0sIGxpdmVzLCBDb2xvci5Db2xvcjEpKTtcbiAgICAgICAgICAgIFNwYXduTmV3U3F1YXJlKENvbG9yLkNvbG9yMSk7XG4gICAgICAgICAgICBQbGF5ZXJzLkFkZChuZXcgUGxheWVyKFBsYXllckNvdW50VG9UdXJuc1VudGlsTmV3U3F1YXJlW3BsYXllckNvdW50XSwgbGl2ZXMsIENvbG9yLkNvbG9yMykpO1xuICAgICAgICAgICAgU3Bhd25OZXdTcXVhcmUoQ29sb3IuQ29sb3IzKTtcbiAgICAgICAgICAgIFBsYXllcnMuU29ydCgoZ2xvYmFsOjpTeXN0ZW0uQ29tcGFyaXNvbjxnbG9iYWw6OlB1c2h5U3F1YXJlcy5QbGF5ZXI+KSgoeCwgeSkgPT4geC5Db2xvci5Db21wYXJlVG8oeS5Db2xvcikpKTtcbiAgICAgICAgICAgIGlmIChwbGF5ZXJDb3VudCA8IDQpIHtcbiAgICAgICAgICAgICAgICBTcGF3bnBvaW50cy5SZW1vdmUoQ29sb3IuQ29sb3I0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwbGF5ZXJDb3VudCA8IDMpIHtcbiAgICAgICAgICAgICAgICBTcGF3bnBvaW50cy5SZW1vdmUoQ29sb3IuQ29sb3IyKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgQ3VycmVudFBsYXllci5UdXJuc1VudGlsTmV3U3F1YXJlLS07XG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgR2FtZSgpIHt9XG5cbiAgICAgICAgcHVibGljIHZvaWQgTW92ZURvd24oKSB7XG4gICAgICAgICAgICBNb3ZlKChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6UHVzaHlTcXVhcmVzLlBvc2l0aW9uLCBnbG9iYWw6OlB1c2h5U3F1YXJlcy5Qb3NpdGlvbj4pKHggPT4geC5CZWxvdyksIChnbG9iYWw6OlN5c3RlbS5Db21wYXJpc29uPGdsb2JhbDo6UHVzaHlTcXVhcmVzLlBvc2l0aW9uPikoKHgsIHkpID0+IHkuWS5Db21wYXJlVG8oeC5ZKSksIERpcmVjdGlvbi5Eb3duKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIE1vdmVVcCgpIHtcbiAgICAgICAgICAgIE1vdmUoKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpQdXNoeVNxdWFyZXMuUG9zaXRpb24sIGdsb2JhbDo6UHVzaHlTcXVhcmVzLlBvc2l0aW9uPikoeCA9PiB4LkFib3ZlKSwgKGdsb2JhbDo6U3lzdGVtLkNvbXBhcmlzb248Z2xvYmFsOjpQdXNoeVNxdWFyZXMuUG9zaXRpb24+KSgoeCwgeSkgPT4geC5ZLkNvbXBhcmVUbyh5LlkpKSwgRGlyZWN0aW9uLlVwKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIE1vdmVSaWdodCgpIHtcbiAgICAgICAgICAgIE1vdmUoKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpQdXNoeVNxdWFyZXMuUG9zaXRpb24sIGdsb2JhbDo6UHVzaHlTcXVhcmVzLlBvc2l0aW9uPikoeCA9PiB4LlJpZ2h0KSwgKGdsb2JhbDo6U3lzdGVtLkNvbXBhcmlzb248Z2xvYmFsOjpQdXNoeVNxdWFyZXMuUG9zaXRpb24+KSgoeCwgeSkgPT4geS5YLkNvbXBhcmVUbyh4LlgpKSwgRGlyZWN0aW9uLlJpZ2h0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyB2b2lkIE1vdmVMZWZ0KCkge1xuICAgICAgICAgICAgTW92ZSgoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OlB1c2h5U3F1YXJlcy5Qb3NpdGlvbiwgZ2xvYmFsOjpQdXNoeVNxdWFyZXMuUG9zaXRpb24+KSh4ID0+IHguTGVmdCksIChnbG9iYWw6OlN5c3RlbS5Db21wYXJpc29uPGdsb2JhbDo6UHVzaHlTcXVhcmVzLlBvc2l0aW9uPikoKHgsIHkpID0+IHguWC5Db21wYXJlVG8oeS5YKSksIERpcmVjdGlvbi5MZWZ0KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBvdmVycmlkZSBzdHJpbmcgVG9TdHJpbmcoKSB7XG4gICAgICAgICAgICB2YXIgYnVpbGRlciA9IG5ldyBTdHJpbmdCdWlsZGVyKCk7XG4gICAgICAgICAgICB2YXIgZGljdCA9IGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5DYWxsRm9yKG5ldyBEaWN0aW9uYXJ5PFRpbGUsIHN0cmluZz4oKSwoX28xKT0+e19vMS5BZGQoVGlsZS5TcXVhcmVDb2xvcjEsXCJcXFUwMDAxRjZCOVwiKTtfbzEuQWRkKFRpbGUuU3F1YXJlQ29sb3IyLFwiXFxVMDAwMUY2QkHvuI9cIik7X28xLkFkZChUaWxlLlNxdWFyZUNvbG9yMyxcIlxcVTAwMDFGNkJDXCIpO19vMS5BZGQoVGlsZS5TcXVhcmVDb2xvcjQsXCJcXHUyNzQ3XFx1RkUwRu+4jyBcIik7cmV0dXJuIF9vMTt9KTtcbiAgICAgICAgICAgIGJ1aWxkZXIuQXBwZW5kTGluZShzdHJpbmcuRm9ybWF0KFwiQ3VycmVudCBUdXJuOiB7MH1cIixkaWN0W1RpbGVFeHRlbnNpb25zLkZyb21Db2xvcihDdXJyZW50UGxheWVyLkNvbG9yKV0pKTtcbiAgICAgICAgICAgIGJ1aWxkZXIuQXBwZW5kKFwiTGl2ZXM6IFwiKTtcbiAgICAgICAgICAgIFBsYXllcnMuRm9yRWFjaCgoZ2xvYmFsOjpTeXN0ZW0uQWN0aW9uPGdsb2JhbDo6UHVzaHlTcXVhcmVzLlBsYXllcj4pKHggPT4gYnVpbGRlci5BcHBlbmQoc3RyaW5nLkZvcm1hdChcInswfSBcIix4LkxpdmVzKSkpKTtcbiAgICAgICAgICAgIGJ1aWxkZXIuQXBwZW5kTGluZSgpO1xuICAgICAgICAgICAgYnVpbGRlci5BcHBlbmRMaW5lKHN0cmluZy5Gb3JtYXQoXCJOZXcgU3F1YXJlIEluOiB7MH1cIixDdXJyZW50UGxheWVyLlR1cm5zVW50aWxOZXdTcXVhcmUpKTtcbiAgICAgICAgICAgIGZvciAoaW50IHkgPSAwOyB5IDwgQm9hcmQuR2V0TGVuZ3RoKDEpOyB5KyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGludCB4ID0gMDsgeCA8IEJvYXJkLkdldExlbmd0aCgwKTsgeCsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaCAoQm9hcmRbeCwgeV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgVGlsZS5FbXB0eTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZGVyLkFwcGVuZChcIlxcdTJCMUNcXHVGRTBGXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBUaWxlLlZvaWQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlci5BcHBlbmQoXCIgIFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgVGlsZS5XYWxsOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1aWxkZXIuQXBwZW5kKFwiXFxVMDAwMUY1MzJcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFRpbGUuU3F1YXJlR3JleTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWlsZGVyLkFwcGVuZChcIlxcdTIxMzlcXHVGRTBG77iPIFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgVGlsZS5TcXVhcmVDb2xvcjE6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlci5BcHBlbmQoXCJcXFUwMDAxRjZCOVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgVGlsZS5TcXVhcmVDb2xvcjI6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlci5BcHBlbmQoXCJcXFUwMDAxRjZCQe+4j1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgVGlsZS5TcXVhcmVDb2xvcjM6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlci5BcHBlbmQoXCJcXFUwMDAxRjZCQ++4j1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgVGlsZS5TcXVhcmVDb2xvcjQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVpbGRlci5BcHBlbmQoXCJcXHUyNzQ3XFx1RkUwRu+4jyBcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnVpbGRlci5BcHBlbmRMaW5lKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gYnVpbGRlci5Ub1N0cmluZygpO1xuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBHYW1lIENyZWF0ZUNvcHkgKCkge1xyXG4gICAgICAgICAgICBHYW1lIGNvcHkgPSBuZXcgR2FtZSAoKTtcclxuICAgICAgICAgICAgY29weS5Cb2FyZCA9IChUaWxlWyxdKUJvYXJkLkNsb25lICgpO1xyXG4gICAgICAgICAgICBjb3B5LlNwYXducG9pbnRzID0gbmV3IERpY3Rpb25hcnk8Q29sb3IsIFBvc2l0aW9uPiAoU3Bhd25wb2ludHMpO1xyXG4gICAgICAgICAgICBjb3B5LmN1cnJlbnRQbGF5ZXJJbmRleCA9IGN1cnJlbnRQbGF5ZXJJbmRleDtcclxuICAgICAgICAgICAgY29weS5QbGF5ZXJzID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3QgPGdsb2JhbDo6UHVzaHlTcXVhcmVzLlBsYXllcixnbG9iYWw6OlB1c2h5U3F1YXJlcy5QbGF5ZXI+IChQbGF5ZXJzLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6UHVzaHlTcXVhcmVzLlBsYXllciwgZ2xvYmFsOjpQdXNoeVNxdWFyZXMuUGxheWVyPikoeCA9PiB4LkNyZWF0ZUNvcHkgKCkpKS5Ub0xpc3QgKCk7XHJcbiAgICAgICAgICAgIHJldHVybiBjb3B5O1xyXG4gICAgICAgIH1cclxuXG5cbiAgICAgICAgcHJpdmF0ZSB2b2lkIFNwYXduTmV3U3F1YXJlKENvbG9yIGMpIHtcblB1c2h5U3F1YXJlcy5BcnJheUV4dGVuc2lvbnMuU2V0SXRlbUF0PGdsb2JhbDo6UHVzaHlTcXVhcmVzLlRpbGU+KCAgICAgICAgICAgIEJvYXJkLFNwYXducG9pbnRzW2NdLCBUaWxlRXh0ZW5zaW9ucy5Gcm9tQ29sb3IoYykpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBDb2xvcj8gTmV4dFR1cm4oKSB7XG4gICAgICAgICAgICBDb2xvcj8gcmV0VmFsID0gbnVsbDtcbiAgICAgICAgICAgIGlmICghU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5Bbnk8Z2xvYmFsOjpQdXNoeVNxdWFyZXMuUGxheWVyPihQbGF5ZXJzLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6UHVzaHlTcXVhcmVzLlBsYXllciwgYm9vbD4pKHggPT4geC5MaXZlcyA+IDApKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBDb2xvci5HcmV5O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9cbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50UGxheWVySW5kZXggPSBjdXJyZW50UGxheWVySW5kZXggPT0gUGxheWVycy5Db3VudCAtIDEgPyAwIDogY3VycmVudFBsYXllckluZGV4ICsgMTtcbiAgICAgICAgICAgIH0gd2hpbGUgKEN1cnJlbnRQbGF5ZXIuTGl2ZXMgPT0gMCk7XG4gICAgICAgICAgICBDdXJyZW50UGxheWVyLlR1cm5zVW50aWxOZXdTcXVhcmUtLTtcbiAgICAgICAgICAgIGlmIChDdXJyZW50UGxheWVyLlR1cm5zVW50aWxOZXdTcXVhcmUgPT0gMCkge1xuICAgICAgICAgICAgICAgIGlmIChQdXNoeVNxdWFyZXMuQXJyYXlFeHRlbnNpb25zLkl0ZW1BdDxnbG9iYWw6OlB1c2h5U3F1YXJlcy5UaWxlPihCb2FyZCxTcGF3bnBvaW50c1tDdXJyZW50UGxheWVyLkNvbG9yXSkgPT0gVGlsZS5FbXB0eSkge1xuICAgICAgICAgICAgICAgICAgICBTcGF3bk5ld1NxdWFyZShDdXJyZW50UGxheWVyLkNvbG9yKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0VmFsID0gQ3VycmVudFBsYXllci5Db2xvcjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgQ3VycmVudFBsYXllci5UdXJuc1VudGlsTmV3U3F1YXJlID0gR2FtZS5QbGF5ZXJDb3VudFRvVHVybnNVbnRpbE5ld1NxdWFyZVtQbGF5ZXJzLkNvdW50XSArIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmV0VmFsO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBMaXN0PFBvc2l0aW9uPiBIYW5kbGVEZWF0aHMoTGlzdDxQb3NpdGlvbj4gZGVzdHJveWVkU3F1YXJlUG9zaXRpb25zKSB7XG4gICAgICAgICAgICB2YXIgcmV0VmFsID0gbmV3IExpc3Q8UG9zaXRpb24+KCk7XG4gICAgICAgICAgICBmb3JlYWNoICh2YXIgcGxheWVyIGluIFBsYXllcnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGVzdHJveWVkU3F1YXJlcyA9IFN5c3RlbS5MaW5xLkVudW1lcmFibGUuV2hlcmU8Z2xvYmFsOjpQdXNoeVNxdWFyZXMuUG9zaXRpb24+KGRlc3Ryb3llZFNxdWFyZVBvc2l0aW9ucywoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OlB1c2h5U3F1YXJlcy5Qb3NpdGlvbiwgYm9vbD4pKHggPT4gUHVzaHlTcXVhcmVzLkFycmF5RXh0ZW5zaW9ucy5JdGVtQXQ8Z2xvYmFsOjpQdXNoeVNxdWFyZXMuVGlsZT4oQm9hcmQseCkgPT0gVGlsZUV4dGVuc2lvbnMuRnJvbUNvbG9yKHBsYXllci5Db2xvcikpKTtcbiAgICAgICAgICAgICAgICBwbGF5ZXIuTGl2ZXMgLT0gZGVzdHJveWVkU3F1YXJlcy5Db3VudCgpO1xuICAgICAgICAgICAgICAgIGlmIChwbGF5ZXIuTGl2ZXMgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBmb3JlYWNoICh2YXIgcG9zIGluIEJvYXJkLlBvc2l0aW9uc09mKHBsYXllci5Db2xvcikpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldFZhbC5BZGQocG9zKTtcblB1c2h5U3F1YXJlcy5BcnJheUV4dGVuc2lvbnMuU2V0SXRlbUF0PGdsb2JhbDo6UHVzaHlTcXVhcmVzLlRpbGU+KCAgICAgICAgICAgICAgICAgICAgICAgIEJvYXJkLHBvcywgVGlsZS5TcXVhcmVHcmV5KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXRWYWw7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIHZvaWQgTW92ZShGdW5jPFBvc2l0aW9uLCBQb3NpdGlvbj4gZGlzcGxhY2VtZW50LCBDb21wYXJpc29uPFBvc2l0aW9uPiBzb3J0ZXIsIERpcmVjdGlvbiBkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIHZhciBhbGxTcXVhcmVQb3NpdGlvbnMgPSBCb2FyZC5Qb3NpdGlvbnNPZihDdXJyZW50UGxheWVyLkNvbG9yKTtcbiAgICAgICAgICAgIGlmIChhbGxTcXVhcmVQb3NpdGlvbnMuQ291bnQgPT0gMCkge1xuICAgICAgICAgICAgICAgIENvbG9yPyBuZXdTcXVhcmVDb2xvciA9IE5leHRUdXJuKCk7XG4gICAgICAgICAgICAgICAgZ2xvYmFsOjpCcmlkZ2UuU2NyaXB0LlRvVGVtcChcImtleTFcIixEZWxlZ2F0ZSkhPW51bGw/Z2xvYmFsOjpCcmlkZ2UuU2NyaXB0LkZyb21MYW1iZGEoKCk9Pmdsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tVGVtcDxHYW1lRGVsZWdhdGU+KFwia2V5MVwiKS5JbnZva2UoZGlyZWN0aW9uLCBuZXcgTGlzdDxQb3NpdGlvbj4oKSwgbmV3IExpc3Q8UG9zaXRpb24+KCksIG5ldyBMaXN0PFBvc2l0aW9uPigpLCBuZXdTcXVhcmVDb2xvcikpOm51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbW92aW5nU3F1YXJlc1Bvc2l0aW9ucyA9IG5ldyBMaXN0PFBvc2l0aW9uPigpO1xuICAgICAgICAgICAgdmFyIGJlaW5nRGVzdHJveWVkU3F1YXJlc1Bvc2l0aW9ucyA9IG5ldyBMaXN0PFBvc2l0aW9uPigpO1xuICAgICAgICAgICAgZm9yZWFjaCAodmFyIHBvc2l0aW9uIGluIGFsbFNxdWFyZVBvc2l0aW9ucykge1xuICAgICAgICAgICAgICAgIHZhciBwdXNoZWRQb3NpdGlvbnMgPSBnbG9iYWw6OkJyaWRnZS5TY3JpcHQuQ2FsbEZvcihuZXcgTGlzdDxQb3NpdGlvbj4oKSwoX28xKT0+e19vMS5BZGQocG9zaXRpb24pO3JldHVybiBfbzE7fSk7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoIChQdXNoeVNxdWFyZXMuQXJyYXlFeHRlbnNpb25zLkl0ZW1BdDxnbG9iYWw6OlB1c2h5U3F1YXJlcy5UaWxlPihCb2FyZCxkaXNwbGFjZW1lbnQoU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5MYXN0PGdsb2JhbDo6UHVzaHlTcXVhcmVzLlBvc2l0aW9uPihwdXNoZWRQb3NpdGlvbnMpKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgVGlsZS5FbXB0eTpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBnb3RvIG91dE9mTG9vcDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgVGlsZS5XYWxsOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hlZFBvc2l0aW9ucy5DbGVhcigpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvdG8gb3V0T2ZMb29wO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBUaWxlLlZvaWQ6XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVpbmdEZXN0cm95ZWRTcXVhcmVzUG9zaXRpb25zLkFkZChTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkxhc3Q8Z2xvYmFsOjpQdXNoeVNxdWFyZXMuUG9zaXRpb24+KHB1c2hlZFBvc2l0aW9ucykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdvdG8gb3V0T2ZMb29wO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBUaWxlLlNxdWFyZUNvbG9yMTpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgVGlsZS5TcXVhcmVDb2xvcjI6XG4gICAgICAgICAgICAgICAgICAgICAgICBjYXNlIFRpbGUuU3F1YXJlQ29sb3IzOlxuICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSBUaWxlLlNxdWFyZUNvbG9yNDpcbiAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgVGlsZS5TcXVhcmVHcmV5OlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHB1c2hlZFBvc2l0aW9ucy5BZGQoZGlzcGxhY2VtZW50KFN5c3RlbS5MaW5xLkVudW1lcmFibGUuTGFzdDxnbG9iYWw6OlB1c2h5U3F1YXJlcy5Qb3NpdGlvbj4ocHVzaGVkUG9zaXRpb25zKSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0T2ZMb29wOlxuICAgICAgICAgICAgICAgIG1vdmluZ1NxdWFyZXNQb3NpdGlvbnMuQWRkUmFuZ2UocHVzaGVkUG9zaXRpb25zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBzb3J0ZWRQb3NpdGlvbnMgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLkRpc3RpbmN0PGdsb2JhbDo6UHVzaHlTcXVhcmVzLlBvc2l0aW9uPihtb3ZpbmdTcXVhcmVzUG9zaXRpb25zKS5Ub0xpc3QoKTtcbiAgICAgICAgICAgIHNvcnRlZFBvc2l0aW9ucy5Tb3J0KChnbG9iYWw6OlN5c3RlbS5Db21wYXJpc29uPGdsb2JhbDo6UHVzaHlTcXVhcmVzLlBvc2l0aW9uPilzb3J0ZXIpO1xuICAgICAgICAgICAgYmVpbmdEZXN0cm95ZWRTcXVhcmVzUG9zaXRpb25zID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5EaXN0aW5jdDxnbG9iYWw6OlB1c2h5U3F1YXJlcy5Qb3NpdGlvbj4oYmVpbmdEZXN0cm95ZWRTcXVhcmVzUG9zaXRpb25zKS5Ub0xpc3QoKTtcbiAgICAgICAgICAgIHZhciBncmV5ZWRPdXRTcXVhcmVzUG9zaXRpb25zID0gSGFuZGxlRGVhdGhzKGJlaW5nRGVzdHJveWVkU3F1YXJlc1Bvc2l0aW9ucyk7XG4gICAgICAgICAgICBmb3JlYWNoICh2YXIgcG9zaXRpb24gaW4gc29ydGVkUG9zaXRpb25zKSB7XG4gICAgICAgICAgICAgICAgdmFyIHRpbGUgPSBQdXNoeVNxdWFyZXMuQXJyYXlFeHRlbnNpb25zLkl0ZW1BdDxnbG9iYWw6OlB1c2h5U3F1YXJlcy5UaWxlPihCb2FyZCxwb3NpdGlvbik7XG5QdXNoeVNxdWFyZXMuQXJyYXlFeHRlbnNpb25zLlNldEl0ZW1BdDxnbG9iYWw6OlB1c2h5U3F1YXJlcy5UaWxlPiggICAgICAgICAgICAgICAgQm9hcmQscG9zaXRpb24sIFRpbGUuRW1wdHkpO1xuICAgICAgICAgICAgICAgIGlmICghYmVpbmdEZXN0cm95ZWRTcXVhcmVzUG9zaXRpb25zLkNvbnRhaW5zKHBvc2l0aW9uKSkge1xuUHVzaHlTcXVhcmVzLkFycmF5RXh0ZW5zaW9ucy5TZXRJdGVtQXQ8Z2xvYmFsOjpQdXNoeVNxdWFyZXMuVGlsZT4oICAgICAgICAgICAgICAgICAgICBCb2FyZCxkaXNwbGFjZW1lbnQocG9zaXRpb24pLCB0aWxlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbmV3U3F1YXJlQ29sb3IxID0gTmV4dFR1cm4oKTtcbiAgICAgICAgICAgIGdsb2JhbDo6QnJpZGdlLlNjcmlwdC5Ub1RlbXAoXCJrZXkyXCIsRGVsZWdhdGUpIT1udWxsP2dsb2JhbDo6QnJpZGdlLlNjcmlwdC5Gcm9tTGFtYmRhKCgpPT5nbG9iYWw6OkJyaWRnZS5TY3JpcHQuRnJvbVRlbXA8R2FtZURlbGVnYXRlPihcImtleTJcIikuSW52b2tlKGRpcmVjdGlvbiwgbW92aW5nU3F1YXJlc1Bvc2l0aW9ucywgYmVpbmdEZXN0cm95ZWRTcXVhcmVzUG9zaXRpb25zLCBncmV5ZWRPdXRTcXVhcmVzUG9zaXRpb25zLCBuZXdTcXVhcmVDb2xvcjEpKTpudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHVibGljIGRlbGVnYXRlIHZvaWQgR2FtZURlbGVnYXRlKERpcmVjdGlvbj8gZGlyZWN0aW9uLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTGlzdDxQb3NpdGlvbj4gb3JpZ2luYWxQb3NpdGlvbnMsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBMaXN0PFBvc2l0aW9uPiBkZXN0cm95ZWRTcXVhcmVzUG9zaXRpb25zLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgTGlzdDxQb3NpdGlvbj4gZ3JleWVkT3V0UG9zaXRpb25zLCBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ29sb3I/IG5ld1NxdWFyZUNvbG9yKTtcbn1cblxuIiwidXNpbmcgU3lzdGVtO1xudXNpbmcgU3lzdGVtLkxpbnE7XG51c2luZyBTeXN0ZW0uQ29sbGVjdGlvbnMuR2VuZXJpYztcbm5hbWVzcGFjZSBQdXNoeVNxdWFyZXMge1xuICAgIHB1YmxpYyBzdGF0aWMgY2xhc3MgR2FtZUV4dGVuc2lvbnMge1xuICAgICAgICBwdWJsaWMgc3RhdGljIFBsYXllciBHZXRQbGF5ZXIodGhpcyBHYW1lIGdhbWUsIENvbG9yIGNvbG9yKSB7XG4gICAgICAgICAgICByZXR1cm4gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5XaGVyZTxnbG9iYWw6OlB1c2h5U3F1YXJlcy5QbGF5ZXI+KGdhbWUuUGxheWVycywoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OlB1c2h5U3F1YXJlcy5QbGF5ZXIsIGJvb2w+KSh4ID0+IHguQ29sb3IgPT0gY29sb3IpKS5GaXJzdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyBMaXN0PENvbG9yPiBPcHBvbmVudHNPZih0aGlzIEdhbWUgZ2FtZSwgQ29sb3IgY29sb3IpIHtcbiAgICAgICAgICAgIHJldHVybiBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLldoZXJlPGdsb2JhbDo6UHVzaHlTcXVhcmVzLlBsYXllcj4oZ2FtZS5QbGF5ZXJzLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6UHVzaHlTcXVhcmVzLlBsYXllciwgYm9vbD4pKHggPT4geC5Db2xvciAhPSBjb2xvcikpLlNlbGVjdDxnbG9iYWw6OlB1c2h5U3F1YXJlcy5Db2xvcj4oKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpQdXNoeVNxdWFyZXMuUGxheWVyLCBnbG9iYWw6OlB1c2h5U3F1YXJlcy5Db2xvcj4pKHggPT4geC5Db2xvcikpLlRvTGlzdCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgcHVibGljIHN0YXRpYyB2b2lkIE1vdmUodGhpcyBHYW1lIGdhbWUsIERpcmVjdGlvbiBkaXJlY3Rpb24pIHtcbiAgICAgICAgICAgIHN3aXRjaCAoZGlyZWN0aW9uKSB7XG4gICAgICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uRG93bjpcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5Nb3ZlRG93bigpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5VcDpcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5Nb3ZlVXAoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uTGVmdDpcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5Nb3ZlTGVmdCgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5SaWdodDpcbiAgICAgICAgICAgICAgICAgICAgZ2FtZS5Nb3ZlUmlnaHQoKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwdWJsaWMgY2xhc3MgR2FtZUFJIHtcbiAgICAgICAgU3RhY2s8R2FtZT4gZ2FtZVN0YXRlcyA9IG5ldyBTdGFjazxHYW1lPigpO1xuICAgICAgICBHYW1lIEN1cnJlbnRHYW1lIHtnZXR7cmV0dXJuIGdhbWVTdGF0ZXMuUGVlaygpO319XG5cbiAgICAgICAgcmVhZG9ubHkgaW50IHdTZWxmTGlmZTtcbiAgICAgICAgcmVhZG9ubHkgaW50IHdEaWZmTGl2ZXM7XG4gICAgICAgIHJlYWRvbmx5IGludCB3U3F1YXJlVGhyZXNob2xkO1xuICAgICAgICByZWFkb25seSBpbnQgd1NlbGZTcHJlYWRCZWxvd1RocmVzaG9sZDtcbiAgICAgICAgcmVhZG9ubHkgaW50IHdTZWxmU3ByZWFkQWJvdmVUaHJlc2hvbGQ7XG4gICAgICAgIHJlYWRvbmx5IGludCB3T3Bwb25lbnRTcHJlYWQ7XG4gICAgICAgIHJlYWRvbmx5IGludCB3U2VsZkluRGFuZ2VyO1xuICAgICAgICByZWFkb25seSBpbnQgd09wcG9uZW50SW5EYW5nZXJCZWxvd1RocmVzaG9sZDtcbiAgICAgICAgcmVhZG9ubHkgaW50IHdPcHBvbmVudEluRGFuZ2VyQWJvdmVUaHJlc2hvbGQ7XG5cbiAgICAgICAgcmVhZG9ubHkgQ29sb3IgbXlDb2xvcjtcblxuICAgICAgICBwdWJsaWMgR2FtZUFJKEdhbWUgZ2FtZSxcbiAgICAgICAgICAgICAgICAgICAgICBDb2xvciBteUNvbG9yLFxuICAgICAgICAgICAgICAgICAgICAgIGludCB3U2VsZkxpZmUsIFxuICAgICAgICAgICAgICAgICAgICAgIGludCB3RGlmZkxpdmVzLCBcbiAgICAgICAgICAgICAgICAgICAgICBpbnQgd1NxdWFyZVRocmVzaG9sZCwgXG4gICAgICAgICAgICAgICAgICAgICAgaW50IHdTZWxmU3ByZWFkQmVsb3dUaHJlc2hvbGQsIFxuICAgICAgICAgICAgICAgICAgICAgIGludCB3U2VsZlNwcmVhZEFib3ZlVGhyZXNob2xkLCBcbiAgICAgICAgICAgICAgICAgICAgICBpbnQgd09wcG9uZW50U3ByZWFkLCBcbiAgICAgICAgICAgICAgICAgICAgICBpbnQgd1NlbGZJbkRhbmdlciwgXG4gICAgICAgICAgICAgICAgICAgICAgaW50IHdPcHBvbmVudEluRGFuZ2VyQmVsb3dUaHJlc2hvbGQsIFxuICAgICAgICAgICAgICAgICAgICAgIGludCB3T3Bwb25lbnRJbkRhbmdlckFib3ZlVGhyZXNob2xkKSB7XG4gICAgICAgICAgICBnYW1lU3RhdGVzLlB1c2goZ2FtZSk7XG4gICAgICAgICAgICB0aGlzLm15Q29sb3IgPSBteUNvbG9yO1xuICAgICAgICAgICAgdGhpcy53U2VsZkxpZmUgPSB3U2VsZkxpZmU7XG4gICAgICAgICAgICB0aGlzLndEaWZmTGl2ZXMgPSB3RGlmZkxpdmVzO1xuICAgICAgICAgICAgdGhpcy53U3F1YXJlVGhyZXNob2xkID0gd1NxdWFyZVRocmVzaG9sZDtcbiAgICAgICAgICAgIHRoaXMud1NlbGZTcHJlYWRCZWxvd1RocmVzaG9sZCA9IHdTZWxmU3ByZWFkQmVsb3dUaHJlc2hvbGQ7XG4gICAgICAgICAgICB0aGlzLndTZWxmU3ByZWFkQWJvdmVUaHJlc2hvbGQgPSB3U2VsZlNwcmVhZEFib3ZlVGhyZXNob2xkO1xuICAgICAgICAgICAgdGhpcy53T3Bwb25lbnRTcHJlYWQgPSB3T3Bwb25lbnRTcHJlYWQ7XG4gICAgICAgICAgICB0aGlzLndTZWxmSW5EYW5nZXIgPSB3U2VsZkluRGFuZ2VyO1xuICAgICAgICAgICAgdGhpcy53T3Bwb25lbnRJbkRhbmdlckJlbG93VGhyZXNob2xkID0gd09wcG9uZW50SW5EYW5nZXJCZWxvd1RocmVzaG9sZDtcbiAgICAgICAgICAgIHRoaXMud09wcG9uZW50SW5EYW5nZXJBYm92ZVRocmVzaG9sZCA9IHdPcHBvbmVudEluRGFuZ2VyQWJvdmVUaHJlc2hvbGQ7XG4gICAgICAgIH1cblxuICAgICAgICBwdWJsaWMgaW50IEV2YWx1YXRlSGV1cmlzdGljcygpIHtcbiAgICAgICAgICAgIHZhciBsaXZpbmdQbGF5ZXJzID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5XaGVyZTxnbG9iYWw6OlB1c2h5U3F1YXJlcy5QbGF5ZXI+KEN1cnJlbnRHYW1lLlBsYXllcnMsKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpQdXNoeVNxdWFyZXMuUGxheWVyLCBib29sPikoeCA9PiB4LkxpdmVzID4gMCkpLlRvTGlzdCgpO1xuICAgICAgICAgICAgdmFyIG1lID0gQ3VycmVudEdhbWUuR2V0UGxheWVyKG15Q29sb3IpO1xuICAgICAgICAgICAgaWYgKG1lLkxpdmVzID09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50Lk1pblZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxpdmluZ1BsYXllcnMuQ291bnQgPT0gMSAmJiBtZS5MaXZlcyA+IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gaW50Lk1heFZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGxpdmluZ1BsYXllcnMuQ291bnQgPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGZpbmFsU2VsZkxpdmVzID0gbWUuTGl2ZXM7XG4gICAgICAgICAgICB2YXIgb3Bwb25lbnRzID0gQ3VycmVudEdhbWUuT3Bwb25lbnRzT2YobXlDb2xvcik7XG4gICAgICAgICAgICB2YXIgZmluYWxEaWZmTGl2ZXMgPSAwO1xuICAgICAgICAgICAgaWYgKGxpdmluZ1BsYXllcnMuQ291bnQgPT0gMikge1xuICAgICAgICAgICAgICAgIGZpbmFsRGlmZkxpdmVzID0gbWUuTGl2ZXMgLSBDdXJyZW50R2FtZS5HZXRQbGF5ZXIoU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5GaXJzdDxnbG9iYWw6OlB1c2h5U3F1YXJlcy5Db2xvcj4ob3Bwb25lbnRzKSkuTGl2ZXM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgbXlTcXVhcmVzID0gQ3VycmVudEdhbWUuQm9hcmQuUG9zaXRpb25zT2YobXlDb2xvcik7XG4gICAgICAgICAgICB2YXIgZmluYWxTZWxmU3ByZWFkID0gLUdldFNwcmVhZChteVNxdWFyZXMsIEN1cnJlbnRHYW1lLlNwYXducG9pbnRzW215Q29sb3JdKTtcbiAgICAgICAgICAgIHZhciBmaW5hbE9wcG9uZW50U3ByZWFkID0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3Q8Z2xvYmFsOjpQdXNoeVNxdWFyZXMuQ29sb3IsaW50PihvcHBvbmVudHMsKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpQdXNoeVNxdWFyZXMuQ29sb3IsIGludD4pKHggPT4gR2V0U3ByZWFkKEN1cnJlbnRHYW1lLkJvYXJkLlBvc2l0aW9uc09mKHgpLCBDdXJyZW50R2FtZS5TcGF3bnBvaW50c1t4XSkpKS5TdW0oKSAvIG9wcG9uZW50cy5Db3VudDtcbiAgICAgICAgICAgIHZhciBzZWxmSW5EYW5nZXIgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdDxnbG9iYWw6OlB1c2h5U3F1YXJlcy5Qb3NpdGlvbixib29sPihteVNxdWFyZXMsKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpQdXNoeVNxdWFyZXMuUG9zaXRpb24sIGJvb2w+KSh4ID0+IElzSW5EYW5nZXIoeCwgSXNFZGdlKHgpLCBteUNvbG9yKSkpLldoZXJlKChnbG9iYWw6OlN5c3RlbS5GdW5jPGJvb2wsIGJvb2w+KSh4ID0+IHgpKS5Db3VudCgpO1xuICAgICAgICAgICAgaWYgKHNlbGZJbkRhbmdlciA+PSBtZS5MaXZlcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBpbnQuTWluVmFsdWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZmluYWxTZWxmSW5EYW5nZXIgPSAtc2VsZkluRGFuZ2VyO1xuICAgICAgICAgICAgdmFyIG9wcG9uZW50SW5EYW5nZXIgPSAwO1xuICAgICAgICAgICAgZm9yZWFjaCAodmFyIG9wcG9uZW50IGluIG9wcG9uZW50cykge1xuICAgICAgICAgICAgICAgIG9wcG9uZW50SW5EYW5nZXIgKz0gU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5TZWxlY3Q8Z2xvYmFsOjpQdXNoeVNxdWFyZXMuUG9zaXRpb24sYm9vbD4oQ3VycmVudEdhbWUuQm9hcmQuUG9zaXRpb25zT2Yob3Bwb25lbnQpLChnbG9iYWw6OlN5c3RlbS5GdW5jPGdsb2JhbDo6UHVzaHlTcXVhcmVzLlBvc2l0aW9uLCBib29sPikoeCA9PiBJc0luRGFuZ2VyKHgsIElzRWRnZSh4KSwgb3Bwb25lbnQpKSkuV2hlcmUoKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Ym9vbCwgYm9vbD4pKHggPT4geCkpLkNvdW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgZmluYWxPcHBvbmVudEluRGFuZ2VyID0gb3Bwb25lbnRJbkRhbmdlcjtcbiAgICAgICAgICAgIHJldHVybiBmaW5hbFNlbGZMaXZlcyAqIHdTZWxmTGlmZSArXG4gICAgICAgICAgICAgICAgZmluYWxEaWZmTGl2ZXMgKiB3RGlmZkxpdmVzICtcbiAgICAgICAgICAgICAgICBmaW5hbFNlbGZTcHJlYWQgKiAobXlTcXVhcmVzLkNvdW50IDwgd1NxdWFyZVRocmVzaG9sZCA/IHdTZWxmU3ByZWFkQmVsb3dUaHJlc2hvbGQgOiB3U2VsZlNwcmVhZEFib3ZlVGhyZXNob2xkKSArXG4gICAgICAgICAgICAgICAgZmluYWxPcHBvbmVudFNwcmVhZCAqIHdPcHBvbmVudFNwcmVhZCArXG4gICAgICAgICAgICAgICAgZmluYWxTZWxmSW5EYW5nZXIgKiB3U2VsZkluRGFuZ2VyICtcbiAgICAgICAgICAgICAgICBmaW5hbE9wcG9uZW50SW5EYW5nZXIgKiAobXlTcXVhcmVzLkNvdW50IDwgd1NxdWFyZVRocmVzaG9sZCA/IHdPcHBvbmVudEluRGFuZ2VyQmVsb3dUaHJlc2hvbGQgOiB3T3Bwb25lbnRJbkRhbmdlckFib3ZlVGhyZXNob2xkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHB1YmxpYyBEaXJlY3Rpb24gTmV4dE1vdmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gTWluaW1heCg2LCBteUNvbG9yKS5JdGVtMjtcbiAgICAgICAgfVxuXG4gICAgICAgIGludCBHZXRTcHJlYWQoTGlzdDxQb3NpdGlvbj4gcG9zaXRpb25zLCBQb3NpdGlvbiBwaXZvdCkge1xuICAgICAgICAgICAgdmFyIG1heFggPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdDxnbG9iYWw6OlB1c2h5U3F1YXJlcy5Qb3NpdGlvbixpbnQ+KHBvc2l0aW9ucywoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OlB1c2h5U3F1YXJlcy5Qb3NpdGlvbiwgaW50PikoeCA9PiBNYXRoLkFicyh4LlggLSBwaXZvdC5YKSkpO1xuICAgICAgICAgICAgdmFyIG1heFkgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLlNlbGVjdDxnbG9iYWw6OlB1c2h5U3F1YXJlcy5Qb3NpdGlvbixpbnQ+KHBvc2l0aW9ucywoZ2xvYmFsOjpTeXN0ZW0uRnVuYzxnbG9iYWw6OlB1c2h5U3F1YXJlcy5Qb3NpdGlvbiwgaW50PikoeCA9PiBNYXRoLkFicyh4LlkgLSBwaXZvdC5ZKSkpO1xuICAgICAgICAgICAgaWYgKG1heFguQ291bnQoKSAhPSAwICYmIG1heFkuQ291bnQoKSAhPSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguTWF4KG1heFguTWF4KCksIG1heFkuTWF4KCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cblxuICAgICAgICBMaXN0PERpcmVjdGlvbj4gSXNFZGdlKFBvc2l0aW9uIHBvc2l0aW9uKSB7XG4gICAgICAgICAgICB2YXIgZWRnZXMgPSBuZXcgTGlzdDxEaXJlY3Rpb24+KCk7XG4gICAgICAgICAgICBpZiAoUHVzaHlTcXVhcmVzLkFycmF5RXh0ZW5zaW9ucy5JdGVtQXQ8Z2xvYmFsOjpQdXNoeVNxdWFyZXMuVGlsZT4oQ3VycmVudEdhbWUuQm9hcmQscG9zaXRpb24uQWJvdmUpID09IFRpbGUuVm9pZCkge1xuICAgICAgICAgICAgICAgIGVkZ2VzLkFkZChEaXJlY3Rpb24uVXApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFB1c2h5U3F1YXJlcy5BcnJheUV4dGVuc2lvbnMuSXRlbUF0PGdsb2JhbDo6UHVzaHlTcXVhcmVzLlRpbGU+KEN1cnJlbnRHYW1lLkJvYXJkLHBvc2l0aW9uLkJlbG93KSA9PSBUaWxlLlZvaWQpIHtcbiAgICAgICAgICAgICAgICBlZGdlcy5BZGQoRGlyZWN0aW9uLkRvd24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKFB1c2h5U3F1YXJlcy5BcnJheUV4dGVuc2lvbnMuSXRlbUF0PGdsb2JhbDo6UHVzaHlTcXVhcmVzLlRpbGU+KEN1cnJlbnRHYW1lLkJvYXJkLHBvc2l0aW9uLkxlZnQpID09IFRpbGUuVm9pZCkge1xuICAgICAgICAgICAgICAgIGVkZ2VzLkFkZChEaXJlY3Rpb24uTGVmdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoUHVzaHlTcXVhcmVzLkFycmF5RXh0ZW5zaW9ucy5JdGVtQXQ8Z2xvYmFsOjpQdXNoeVNxdWFyZXMuVGlsZT4oQ3VycmVudEdhbWUuQm9hcmQscG9zaXRpb24uUmlnaHQpID09IFRpbGUuVm9pZCkge1xuICAgICAgICAgICAgICAgIGVkZ2VzLkFkZChEaXJlY3Rpb24uUmlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVkZ2VzO1xuICAgICAgICB9XG5cbiAgICAgICAgYm9vbCBJc0luRGFuZ2VyKFBvc2l0aW9uIHBvc2l0aW9uLCBMaXN0PERpcmVjdGlvbj4gZWRnZXMsIENvbG9yIGMpIHtcbiAgICAgICAgICAgIGZvcmVhY2ggKHZhciBlZGdlIGluIGVkZ2VzKSB7XG4gICAgICAgICAgICAgICAgRnVuYzxQb3NpdGlvbiwgUG9zaXRpb24+IHRyYW5zbGF0ZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgc3dpdGNoIChlZGdlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhc2UgRGlyZWN0aW9uLkRvd246XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGUgPSB4ID0+IHguQWJvdmU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uVXA6XG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2xhdGUgPSB4ID0+IHguQmVsb3c7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgY2FzZSBEaXJlY3Rpb24uTGVmdDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSA9IHggPT4geC5SaWdodDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICBjYXNlIERpcmVjdGlvbi5SaWdodDpcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyYW5zbGF0ZSA9IHggPT4geC5MZWZ0O1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBjdXJyID0gcG9zaXRpb247XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgY3VyciA9IHRyYW5zbGF0ZShjdXJyKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHRpbGUgPSBQdXNoeVNxdWFyZXMuQXJyYXlFeHRlbnNpb25zLkl0ZW1BdDxnbG9iYWw6OlB1c2h5U3F1YXJlcy5UaWxlPihDdXJyZW50R2FtZS5Cb2FyZCxjdXJyKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRpbGUgPT0gVGlsZS5FbXB0eSB8fCB0aWxlID09IFRpbGUuVm9pZCB8fCB0aWxlID09IFRpbGUuV2FsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRpbGUgIT0gVGlsZUV4dGVuc2lvbnMuRnJvbUNvbG9yKGMpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIFR1cGxlPGludCwgRGlyZWN0aW9uPiBNaW5pbWF4KGludCBkZXB0aCwgQ29sb3IgY29sb3IpIHtcbiAgICAgICAgICAgIHZhciBiZXN0U2NvcmUgPSBjb2xvciA9PSBteUNvbG9yID8gaW50Lk1pblZhbHVlIDogaW50Lk1heFZhbHVlO1xuICAgICAgICAgICAgaW50IGN1cnJlbnRTY29yZTtcbiAgICAgICAgICAgIERpcmVjdGlvbj8gYmVzdERpcmVjdGlvbiA9IG51bGw7XG4gICAgICAgICAgICBpZiAoU3lzdGVtLkxpbnEuRW51bWVyYWJsZS5XaGVyZTxnbG9iYWw6OlB1c2h5U3F1YXJlcy5QbGF5ZXI+KEN1cnJlbnRHYW1lLlBsYXllcnMsKGdsb2JhbDo6U3lzdGVtLkZ1bmM8Z2xvYmFsOjpQdXNoeVNxdWFyZXMuUGxheWVyLCBib29sPikoeCA9PiB4LkxpdmVzID4gMCkpLkNvdW50KCkgPCAyIHx8IGRlcHRoID09IDApIHtcbiAgICAgICAgICAgICAgICBiZXN0U2NvcmUgPSBFdmFsdWF0ZUhldXJpc3RpY3MoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIHNxdWFyZUNvdW50ID0gQ3VycmVudEdhbWUuQm9hcmQuUG9zaXRpb25zT2YoY29sb3IpLkNvdW50O1xuICAgICAgICAgICAgICAgIHZhciBtb3ZlcyA9IHNxdWFyZUNvdW50ID09IDAgPyBuZXdbXSB7IERpcmVjdGlvbi5VcCB9IDogbmV3W10geyBEaXJlY3Rpb24uVXAsIERpcmVjdGlvbi5Eb3duLCBEaXJlY3Rpb24uTGVmdCwgRGlyZWN0aW9uLlJpZ2h0IH07XG4gICAgICAgICAgICAgICAgZm9yZWFjaCAodmFyIG1vdmUgaW4gbW92ZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGdhbWVDb3B5ID0gQ3VycmVudEdhbWUuQ3JlYXRlQ29weSgpO1xuICAgICAgICAgICAgICAgICAgICBnYW1lQ29weS5Nb3ZlKG1vdmUpO1xuICAgICAgICAgICAgICAgICAgICBnYW1lU3RhdGVzLlB1c2goZ2FtZUNvcHkpO1xuICAgICAgICAgICAgICAgICAgICBpZiAoY29sb3IgPT0gbXlDb2xvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudFNjb3JlID0gTWluaW1heChkZXB0aCAtIDEsIEN1cnJlbnRHYW1lLkN1cnJlbnRQbGF5ZXIuQ29sb3IpLkl0ZW0xO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGN1cnJlbnRTY29yZSA+IGJlc3RTY29yZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlc3RTY29yZSA9IGN1cnJlbnRTY29yZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZXN0RGlyZWN0aW9uID0gbW92ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGN1cnJlbnRTY29yZSA9IE1pbmltYXgoZGVwdGggLSAxLCBDdXJyZW50R2FtZS5DdXJyZW50UGxheWVyLkNvbG9yKS5JdGVtMTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjdXJyZW50U2NvcmUgPCBiZXN0U2NvcmUpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYmVzdFNjb3JlID0gY3VycmVudFNjb3JlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlc3REaXJlY3Rpb24gPSBtb3ZlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGdhbWVTdGF0ZXMuUG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG5ldyBUdXBsZTxpbnQsIERpcmVjdGlvbj4oYmVzdFNjb3JlLCBiZXN0RGlyZWN0aW9uID8/IERpcmVjdGlvbi5MZWZ0KTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5UZXh0O1xuXG5uYW1lc3BhY2UgUHVzaHlTcXVhcmVzIHtcblx0Y2xhc3MgTWFpbkNsYXNzIHtcblx0XHRwdWJsaWMgc3RhdGljIHZvaWQgTWFpbiAoc3RyaW5nW10gYXJncykge1xuICAgICAgICAgICAgR2FtZSBnYW1lID0gbmV3IEdhbWUgKE1hcC5TdGFuZGFyZCwgNCk7XG4gICAgICAgICAgICBDb25zb2xlLldyaXRlTGluZSAoZ2FtZSk7XG4gICAgICAgICAgICBnYW1lLk1vdmVEb3duICgpO1xuICAgICAgICAgICAgQ29uc29sZS5Xcml0ZUxpbmUgKGdhbWUpO1xuICAgICAgICB9XG5cdH1cbn1cbiIsInVzaW5nIFN5c3RlbTtcbnVzaW5nIFN5c3RlbS5Db2xsZWN0aW9ucy5HZW5lcmljO1xudXNpbmcgU3lzdGVtLkxpbnE7XG5cbm5hbWVzcGFjZSBQdXNoeVNxdWFyZXMge1xuXHRwdWJsaWMgc3RydWN0IE1hcCB7XG5cdFx0cHVibGljIFRpbGVbLF0gQm9hcmQgeyBnZXQ7IHByaXZhdGUgc2V0OyB9XG5cdFx0cHVibGljIERpY3Rpb25hcnk8Q29sb3IsIFBvc2l0aW9uPiBTcGF3bnBvaW50cyB7IGdldDsgc2V0OyB9XG5cblx0XHRwdWJsaWMgc3RhdGljIHJlYWRvbmx5IE1hcCBTdGFuZGFyZCA9IG5ldyBNYXAoXG5AXCIuLi4uT08uLi4uXG4uMSsrKysrKzIuXG4uKysrKysrKysuXG4uKysrKysrKysuXG5PKysrT08rKytPXG5PKysrT08rKytPXG4uKysrKysrKysuXG4uKysrKysrKysuXG4uNCsrKysrKzMuXG4uLi4uT08uLi4uXCIpO1xuXG5cdFx0cHVibGljIE1hcChUaWxlWyxdIGJvYXJkLCBEaWN0aW9uYXJ5PENvbG9yLCBQb3NpdGlvbj4gc3Bhd25wb2ludHMpIHtcblx0XHRcdEJvYXJkID0gYm9hcmQ7XG5cdFx0XHRTcGF3bnBvaW50cyA9IHNwYXducG9pbnRzO1xuXHRcdH1cblxuXHRcdHB1YmxpYyBNYXAoc3RyaW5nIG1hcFN0cmluZykge1xuXHRcdFx0c3RyaW5nW10gbGluZXMgPSBTeXN0ZW0uTGlucS5FbnVtZXJhYmxlLldoZXJlPHN0cmluZz4obWFwU3RyaW5nLlNwbGl0KEVudmlyb25tZW50Lk5ld0xpbmUuVG9DaGFyQXJyYXkoKSksKGdsb2JhbDo6U3lzdGVtLkZ1bmM8c3RyaW5nLCBib29sPikoeCA9PiB4ICE9IFwiXCIpKS5Ub0FycmF5KCk7XG5cdFx0XHRCb2FyZCA9IG5ldyBUaWxlW2xpbmVzWzBdLkxlbmd0aCwgbGluZXMuTGVuZ3RoXTtcblx0XHRcdFNwYXducG9pbnRzID0gbmV3IERpY3Rpb25hcnk8Q29sb3IsIFBvc2l0aW9uPigpO1xuXHRcdFx0Zm9yIChpbnQgaSA9IDAgOyBpIDwgbGluZXMuTGVuZ3RoIDsgaSsrKSB7XG5cdFx0XHRcdGZvciAoaW50IGogPSAwIDsgaiA8IGxpbmVzW2ldLkxlbmd0aCA7IGorKykge1xuXHRcdFx0XHRcdGNoYXIgYyA9IGxpbmVzW2ldW2pdO1xuXHRcdFx0XHRcdHN3aXRjaCAoYykge1xuXHRcdFx0XHRcdGNhc2UgJy4nOlxuXHRcdFx0XHRcdFx0Qm9hcmRbaSwgal0gPSBUaWxlLlZvaWQ7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICcrJzpcblx0XHRcdFx0XHRcdEJvYXJkW2ksIGpdID0gVGlsZS5FbXB0eTtcblx0XHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRcdGNhc2UgJ08nOlxuXHRcdFx0XHRcdFx0Qm9hcmRbaSwgal0gPSBUaWxlLldhbGw7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICcxJzpcblx0XHRcdFx0XHRcdEJvYXJkW2ksIGpdID0gVGlsZS5FbXB0eTtcblx0XHRcdFx0XHRcdFNwYXducG9pbnRzW0NvbG9yLkNvbG9yMV0gPSBuZXcgUG9zaXRpb24oaSwgaik7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICcyJzpcblx0XHRcdFx0XHRcdEJvYXJkW2ksIGpdID0gVGlsZS5FbXB0eTtcblx0XHRcdFx0XHRcdFNwYXducG9pbnRzW0NvbG9yLkNvbG9yMl0gPSBuZXcgUG9zaXRpb24oaSwgaik7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICczJzpcblx0XHRcdFx0XHRcdEJvYXJkW2ksIGpdID0gVGlsZS5FbXB0eTtcblx0XHRcdFx0XHRcdFNwYXducG9pbnRzW0NvbG9yLkNvbG9yM10gPSBuZXcgUG9zaXRpb24oaSwgaik7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHRjYXNlICc0Jzpcblx0XHRcdFx0XHRcdEJvYXJkW2ksIGpdID0gVGlsZS5FbXB0eTtcblx0XHRcdFx0XHRcdFNwYXducG9pbnRzW0NvbG9yLkNvbG9yNF0gPSBuZXcgUG9zaXRpb24oaSwgaik7XG5cdFx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH1cbn1cblxuIiwidXNpbmcgU3lzdGVtO1xuXG5uYW1lc3BhY2UgUHVzaHlTcXVhcmVzIHtcblxuXHRwdWJsaWMgY2xhc3MgUGxheWVyIHtcblx0XHRwdWJsaWMgaW50IFR1cm5zVW50aWxOZXdTcXVhcmUgeyBnZXQ7IHNldDsgfVxuXHRcdHByaXZhdGUgaW50IGxpdmVzO1xuXHRcdHB1YmxpYyBpbnQgTGl2ZXMge1xuXHRcdFx0Z2V0IHsgcmV0dXJuIGxpdmVzOyB9XG5cdFx0XHRzZXQgeyBsaXZlcyA9IHZhbHVlID09IDAgPyAwIDogdmFsdWU7IH1cblx0XHR9XG5cdFx0cHVibGljIENvbG9yIENvbG9yIHsgZ2V0OyBwcml2YXRlIHNldDsgfVxuXG5cdFx0cHVibGljIFBsYXllcihpbnQgdHVybnNVbnRpbE5ld1NxdWFyZSwgaW50IGxpdmVzLCBDb2xvciBjb2xvcikge1xuXHRcdFx0TGl2ZXMgPSBsaXZlcztcblx0XHRcdFR1cm5zVW50aWxOZXdTcXVhcmUgPSB0dXJuc1VudGlsTmV3U3F1YXJlO1xuXHRcdFx0Q29sb3IgPSBjb2xvcjtcblx0XHR9XHJcblxyXG4gICAgICAgIHB1YmxpYyBQbGF5ZXIgQ3JlYXRlQ29weSAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgUGxheWVyIChUdXJuc1VudGlsTmV3U3F1YXJlLCBMaXZlcywgQ29sb3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XG59XG5cbiIsInVzaW5nIFN5c3RlbTtcblxubmFtZXNwYWNlIFB1c2h5U3F1YXJlcyB7XG5cdHB1YmxpYyBlbnVtIENvbG9yIHtcblx0XHRDb2xvcjEgPSAxLCBDb2xvcjIgPSAyLCBDb2xvcjMgPSAzLCBDb2xvcjQgPSA0LCBHcmV5ID0gMFxuXHR9XG5cblx0cHVibGljIGVudW0gRGlyZWN0aW9uIHtcblx0XHRVcCwgRG93biwgTGVmdCwgUmlnaHRcblx0fVxuXG5cdHB1YmxpYyBlbnVtIFRpbGUge1xuXHRcdEVtcHR5LCBWb2lkLCBXYWxsLCBTcXVhcmVDb2xvcjEsIFNxdWFyZUNvbG9yMiwgU3F1YXJlQ29sb3IzLCBTcXVhcmVDb2xvcjQsIFNxdWFyZUdyZXlcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgY2xhc3MgVGlsZUV4dGVuc2lvbnMge1xuXHRcdHB1YmxpYyBzdGF0aWMgVGlsZSBGcm9tQ29sb3IoQ29sb3IgY29sb3IpIHtcblx0XHRcdHN3aXRjaCAoY29sb3IpIHtcblx0XHRcdGNhc2UgQ29sb3IuQ29sb3IxOlxuXHRcdFx0XHRyZXR1cm4gVGlsZS5TcXVhcmVDb2xvcjE7XG5cdFx0XHRjYXNlIENvbG9yLkNvbG9yMjpcblx0XHRcdFx0cmV0dXJuIFRpbGUuU3F1YXJlQ29sb3IyO1xuXHRcdFx0Y2FzZSBDb2xvci5Db2xvcjM6XG5cdFx0XHRcdHJldHVybiBUaWxlLlNxdWFyZUNvbG9yMztcblx0XHRcdGNhc2UgQ29sb3IuQ29sb3I0OlxuXHRcdFx0XHRyZXR1cm4gVGlsZS5TcXVhcmVDb2xvcjQ7XG5cdFx0XHRjYXNlIENvbG9yLkdyZXk6XG5cdFx0XHRcdHJldHVybiBUaWxlLlNxdWFyZUdyZXk7XG5cdFx0XHRkZWZhdWx0OlxuXHRcdFx0XHR0aHJvdyBuZXcgQXJndW1lbnRFeGNlcHRpb24gKFwiSW52YWxpZCBDb2xvciFcIik7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG59Il0KfQo=
