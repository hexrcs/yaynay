import { observable, computed, action, toJS } from "mobx";
import { createContext } from "react";
import { uiStore } from "./ui";

const INVALID_CATEGORIES = [10, 13, 16, 25, 26, 29, 30, 32];

export class GameStore {
  // Game configs
  @observable
  gameConfig: GameConfig = {
    amount: 10,
    category: 0
  };

  // Amount config
  @action
  decreaseAmount = () => {
    if (this.gameConfig.amount > 1) {
      this.gameConfig.amount--;
    }
  };
  @action
  increaseAmount = () => {
    if (this.gameConfig.amount < 20) {
      this.gameConfig.amount++;
    }
  };

  @computed
  get displayAmount() {
    return this.gameConfig.amount;
  }

  // Category config
  @observable
  availableCategories: Category[] = [null];

  @action
  fetchCategories = async () => {
    const res = await fetch("https://opentdb.com/api_category.php");
    const json = await res.json();
    const properCategories = (json["trivia_categories"] as Category[]).filter(
      x => !INVALID_CATEGORIES.includes(x.id)
    );
    this.availableCategories = [null, ...properCategories];
  };
  @action
  prevCategory = () => {
    if (this.gameConfig.category > 0) {
      this.gameConfig.category--;
    }
  };
  @action
  nextCategory = () => {
    if (this.gameConfig.category < this.availableCategories.length - 1) {
      this.gameConfig.category++;
    }
  };

  @computed
  get displayCategory() {
    return (
      this.availableCategories[this.gameConfig.category]?.name ??
      "All categories"
    );
  }

  // Questions
  @observable
  questions: Question[] = [];
  @action
  fetchQuestions = async () => {
    uiStore.isGameReady = false;
    this.resetGame();

    const { amount, category } = this.gameConfig;

    const _category = this.availableCategories[category];

    const base = `https://opentdb.com/api.php?amount=${amount}`;
    const cat = _category ? `&category=${_category.id}` : "";

    const url = base + cat + `&type=boolean`;
    console.log(url);
    const res = await fetch(url);
    const json = await res.json();
    const results = json["results"] as Question[];

    this.questions = results;
    console.log(results);

    uiStore.isGameReady = true;
  };

  // Game in progress
  @observable
  currentQuestionIndex = 0;
  @computed
  get displayCurrentQuestion() {
    if (uiStore.isGameReady) {
      console.log(toJS(this.currentQuestionIndex));
      console.log(toJS(this.questions));
      const { question } = this.questions[this.currentQuestionIndex];
      return question;
    }
  }

  @observable
  correctOnes: number[] = [];
  @observable
  wrongOnes: number[] = [];
  @action
  _nextQuestion = () => {
    if (this.currentQuestionIndex + 1 < this.questions.length) {
      this.currentQuestionIndex++;
    } else {
      uiStore.nextUIStage();
    }
  };
  @action
  _checkAnswer = (answer: boolean) => {
    const i = this.currentQuestionIndex;
    const currentQuestion = this.questions[i];

    const correctAnswer = currentQuestion.correct_answer;
    switch (correctAnswer) {
      case "True":
        if (answer === true) {
          this.correctOnes = [...this.correctOnes, i];
        } else {
          this.wrongOnes = [...this.wrongOnes, i];
        }
        break;
      case "False":
        if (answer === false) {
          this.correctOnes = [...this.correctOnes, i];
        } else {
          this.wrongOnes = [...this.wrongOnes, i];
        }
        break;
    }
    this._nextQuestion();
  };
  @action
  answerNod = () => {
    this._checkAnswer(true);
  };
  @action
  answerShake = () => {
    this._checkAnswer(false);
  };

  @action
  resetGame = () => {
    this.currentQuestionIndex = 0;
    this.questions = [];
    this.wrongOnes = [];
    this.correctOnes = [];
  };
}

export const gameStore = new GameStore();
export const gameContext = createContext(gameStore);

// Type defs
type Question = {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
};
type GameConfig = {
  category: number | null;
  amount: number;
};
type Category = {
  id: number;
  name: string;
};
