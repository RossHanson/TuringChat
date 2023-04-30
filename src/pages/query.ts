import { Game, GameId } from './game';

export type Query =
| {type : 'StartGame'}
| {type : 'Ask', question : string, game : GameId}
| {type : 'Answer', answer : string, game : GameId}
| {type : 'Guess', guess : 'Human' | 'Bot', game : GameId}