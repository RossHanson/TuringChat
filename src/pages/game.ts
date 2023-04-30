import type { UserId } from "./user";


export type GameId = string;

export type Respondent = 
| {t : 'Human'; user :UserId}
| { t : 'Bot'}

export type QuestionAndAnswer = {question : string; answer : string}

export type QuestionState = 
 | {t : 'PendingQuestion'}
 | {t : 'PendingAnswer'; question : string}
 | {t : 'Answered'; question_and_answer : QuestionAndAnswer}

export type Guess = 'Human' | 'Bot'; 

export type Game = {
    id : GameId;
    interviewer: UserId;
    startTime : Date;
    respondent : Respondent;
    questions: QuestionState[];
    maxQuestions : number;
    guess? : Guess
}


export function answerQuestion(game : Game, answer : string, answerer: UserId) : Game {    
    if (game.respondent.t === 'Human' && game.respondent.user !== answerer) {
        throw new Error('Illegal request - not your game');
    }
    if (game.questions.length === 0) {
        throw new Error('Illegal request - no questions');
    }
    const question = game.questions[game.questions.length - 1];
    if (question.t === 'PendingAnswer') {
        return {
            ...game,
            questions : [
                ...game.questions.slice(0, game.questions.length - 1),
                {t : 'Answered', question_and_answer : {question : question.question, answer}}
            ]
        }
    } else {
        throw new Error('Illegal request - question not pending answer')
    }
}

export function askQuestion(game : Game, question : string, asker: UserId) : Game {
    if (asker !== game.interviewer) {
        throw new Error('Illegal request - not your game');
    }

    if (game.questions.length >= game.maxQuestions) {
        throw new Error('Illegal request - too many questions');
    }
    const questionState : QuestionState = {t : 'PendingAnswer', question};
    return {
        ...game,
        questions : [...game.questions, questionState]
    }
}

export function guess (game : Game, guess : Guess, guesser : UserId) : Game {
    if (game.guess) {
        throw new Error('Illegal request - already guessed');
    }
    if (guesser !== game.interviewer) {
        throw new Error('Illegal request - not your game');
    }
    return {
        ...game,
        guess
    }
}

export function relevantUsers(game : Game) : UserId[] {
    if (game.respondent.t === 'Human') {
        return [game.interviewer, game.respondent.user];
    } else {
        return [game.interviewer];
    }
}
// TODO: Add tests