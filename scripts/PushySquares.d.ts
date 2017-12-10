/// <reference path="./bridge.d.ts" />

declare module PushySquares {
    export interface ArrayExtensions {
    }
    export interface ArrayExtensionsFunc extends Function {
        prototype: ArrayExtensions;
        new (): ArrayExtensions;
        ItemAt<T>(T: {prototype: T}, array: T[], pos: PushySquares.Position): T;
        SetItemAt<T>(T: {prototype: T}, array: T[], pos: PushySquares.Position, value: T): void;
        PositionsOf$1(array: PushySquares.Tile[], tile: PushySquares.Tile): System.Collections.Generic.List$1<PushySquares.Position>;
        PositionsOf(array: PushySquares.Tile[], color: PushySquares.Color): System.Collections.Generic.List$1<PushySquares.Position>;
    }
    var ArrayExtensions: ArrayExtensionsFunc;

    export enum Color {
        Color1 = 1,
        Color2 = 2,
        Color3 = 3,
        Color4 = 4,
        Grey = 0
    }

    export enum Direction {
        Up = 0,
        Down = 1,
        Left = 2,
        Right = 3
    }

    export interface Game {
        Board: PushySquares.Tile[];
        Spawnpoints: System.Collections.Generic.Dictionary$2<PushySquares.Color,PushySquares.Position>;
        Players: System.Collections.Generic.List$1<PushySquares.Player>;
        Delegate: {(direction: PushySquares.Direction, originalPositions: System.Collections.Generic.List$1<PushySquares.Position>, destroyedSquaresPositions: System.Collections.Generic.List$1<PushySquares.Position>, greyedOutPositions: System.Collections.Generic.List$1<PushySquares.Position>, newSquareColor: PushySquares.Color): void};
        Board: PushySquares.Tile[];
        Spawnpoints: System.Collections.Generic.Dictionary$2<PushySquares.Color,PushySquares.Position>;
        Players: System.Collections.Generic.List$1<PushySquares.Player>;
        CurrentPlayer: PushySquares.Player;
        Delegate: {(direction: PushySquares.Direction, originalPositions: System.Collections.Generic.List$1<PushySquares.Position>, destroyedSquaresPositions: System.Collections.Generic.List$1<PushySquares.Position>, greyedOutPositions: System.Collections.Generic.List$1<PushySquares.Position>, newSquareColor: PushySquares.Color): void};
        MoveDown(): void;
        MoveUp(): void;
        MoveRight(): void;
        MoveLeft(): void;
        toString(): string;
        CreateCopy(): PushySquares.Game;
        SpawnNewSquare(c: PushySquares.Color): void;
        NextTurn(): PushySquares.Color;
        HandleDeaths(destroyedSquarePositions: System.Collections.Generic.List$1<PushySquares.Position>): System.Collections.Generic.List$1<PushySquares.Position>;
        Move(displacement: {(arg: PushySquares.Position): PushySquares.Position}, sorter: {(x: PushySquares.Position, y: PushySquares.Position): number}, direction: PushySquares.Direction): void;
    }
    export interface GameFunc extends Function {
        prototype: Game;
        $ctor1: {
            new (map: PushySquares.Map, playerCount: number, lives: number): Game
        };
        PlayerCountToTurnsUntilNewSquare: System.Collections.Generic.Dictionary$2<number,number>;
    }
    var Game: GameFunc;

    export interface GameAI {
        CurrentGame: PushySquares.Game;
        EvaluateHeuristics(): number;
        NextMove(): PushySquares.Direction;
        GetSpread(positions: System.Collections.Generic.List$1<PushySquares.Position>, pivot: PushySquares.Position): number;
        IsEdge(position: PushySquares.Position): System.Collections.Generic.List$1<PushySquares.Direction>;
        IsInDanger(position: PushySquares.Position, edges: System.Collections.Generic.List$1<PushySquares.Direction>, c: PushySquares.Color): boolean;
        Minimax(depth: number, color: PushySquares.Color): System.Object;
    }
    export interface GameAIFunc extends Function {
        prototype: GameAI;
        new (game: PushySquares.Game, myColor: PushySquares.Color, wSelfLife: number, wDiffLives: number, wSquareThreshold: number, wSelfSpreadBelowThreshold: number, wSelfSpreadAboveThreshold: number, wOpponentSpread: number, wSelfInDanger: number, wOpponentInDangerBelowThreshold: number, wOpponentInDangerAboveThreshold: number): GameAI;
    }
    var GameAI: GameAIFunc;

    export interface GameExtensions {
    }
    export interface GameExtensionsFunc extends Function {
        prototype: GameExtensions;
        new (): GameExtensions;
        GetPlayer(game: PushySquares.Game, color: PushySquares.Color): PushySquares.Player;
        OpponentsOf(game: PushySquares.Game, color: PushySquares.Color): System.Collections.Generic.List$1<PushySquares.Color>;
        Move(game: PushySquares.Game, direction: PushySquares.Direction): void;
    }
    var GameExtensions: GameExtensionsFunc;

    export interface MainClass {
    }
    export interface MainClassFunc extends Function {
        prototype: MainClass;
        new (): MainClass;
        Main(args: string[]): void;
    }
    var MainClass: MainClassFunc;

    export interface Map {
        Board: PushySquares.Tile[];
        Spawnpoints: System.Collections.Generic.Dictionary$2<PushySquares.Color,PushySquares.Position>;
        Board: PushySquares.Tile[];
        Spawnpoints: System.Collections.Generic.Dictionary$2<PushySquares.Color,PushySquares.Position>;
        getHashCode(): PushySquares.Map;
        equals(o: PushySquares.Map): Boolean;
        $clone(to: PushySquares.Map): PushySquares.Map;
    }
    export interface MapFunc extends Function {
        prototype: Map;
        $ctor1: {
            new (board: PushySquares.Tile[], spawnpoints: System.Collections.Generic.Dictionary$2<PushySquares.Color,PushySquares.Position>): Map
        };
        $ctor2: {
            new (mapString: string): Map
        };
        new (): Map;
        ctor: {
            new (): Map
        };
        Standard: PushySquares.Map;
    }
    var Map: MapFunc;

    export interface Player {
        TurnsUntilNewSquare: number;
        Color: PushySquares.Color;
        TurnsUntilNewSquare: number;
        Lives: number;
        Color: PushySquares.Color;
        CreateCopy(): PushySquares.Player;
    }
    export interface PlayerFunc extends Function {
        prototype: Player;
        new (turnsUntilNewSquare: number, lives: number, color: PushySquares.Color): Player;
    }
    var Player: PlayerFunc;

    export interface Position {
        X: number;
        Y: number;
        X: number;
        Y: number;
        Above: PushySquares.Position;
        Below: PushySquares.Position;
        Right: PushySquares.Position;
        Left: PushySquares.Position;
        getHashCode(): number;
        toString(): string;
        equals(o: PushySquares.Position): Boolean;
        $clone(to: PushySquares.Position): PushySquares.Position;
    }
    export interface PositionFunc extends Function {
        prototype: Position;
        $ctor1: {
            new (x: number, y: number): Position
        };
        new (): Position;
        ctor: {
            new (): Position
        };
    }
    var Position: PositionFunc;

    export enum Tile {
        Empty = 0,
        Void = 1,
        Wall = 2,
        SquareColor1 = 3,
        SquareColor2 = 4,
        SquareColor3 = 5,
        SquareColor4 = 6,
        SquareGrey = 7
    }

    export interface TileExtensions {
    }
    export interface TileExtensionsFunc extends Function {
        prototype: TileExtensions;
        new (): TileExtensions;
        FromColor(color: PushySquares.Color): PushySquares.Tile;
    }
    var TileExtensions: TileExtensionsFunc;
}
