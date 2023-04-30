import { GameId, Game, Respondent } from "./game"
import {v4 as uuidv4} from 'uuid';
import { User, UserId } from "./user";



type GameManager = {
    games : Map<GameId, Game>;
    byUser : Map<UserId, GameId[]>;
}

export function getGame(gameManager : GameManager, gameId : GameId) : Game {
    if (!gameManager.games.has(gameId)) {
        throw new Error('Illegal request - no such game');
    }
    return gameManager.games.get(gameId)!;
}

export function getGameByUser(gameManager : GameManager, user : UserId) : GameId[] {
    if (!gameManager.byUser.has(user)) {
        return [];
    }
    return gameManager.byUser.get(user)!;
}

function addUserGame (gameManager : GameManager, user : UserId, gameId : GameId) : void {
    gameManager.byUser.set(user, [...getGameByUser(gameManager, user), gameId]);
}

export function newGame(gameManager : GameManager, interviewer: UserId, respondent : Respondent, maxQuestions : number) : Game {
    const gameId = uuidv4();
    const game : Game = {
        id:gameId,
        interviewer : interviewer,
        startTime : new Date(),
        respondent : respondent,
        questions : [],
        maxQuestions : maxQuestions,
    };
    gameManager.games.set(gameId, game);
    addUserGame(gameManager, interviewer, gameId);
    if (respondent.t === 'Human') {
        addUserGame(gameManager, respondent.user, gameId);
    }

    return game;
}

export function setGame(gameManager : GameManager, game : Game) : void {
    gameManager.games.set(game.id, game);
}

export function createGameManager() : GameManager {
    return {games : new Map(), byUser : new Map()};
}

let global_instance = createGameManager();

export function globalGetGame(gameId : GameId) : Game {
    return getGame(global_instance, gameId);
}

export function globalNewGame(interviewer: UserId, respondent : Respondent, maxQuestions : number) : Game {
    return newGame(global_instance, interviewer, respondent, maxQuestions);
}

export function globalSetGame(game : Game) : void {
    setGame(global_instance, game);
}