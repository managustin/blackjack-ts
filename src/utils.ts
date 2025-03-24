import { ICard } from "./types";
import promptSync from "prompt-sync";
const prompt = promptSync();

export function getDecision(): "hit" | "stand" {
  let decision: string;
  do {
    decision = prompt("Hit or stand? (h/s): ").toLowerCase();
  }while(decision!=='h' && decision!=='s');

  return decision === 'h' ? 'hit' : 'stand';
}

export function getHandValue(cards: ICard[]): number {
  // returns the numeric value of a hand
  let value = 0;
  let aces = 0;

  for (const card of cards) {
    if(card.value >= 10){
        value += 10
    } else if (card.value === 1) {
        aces += 1;
        value += 11;
    } else {
        value += card.value;
    }
  }

  while(value > 21 && aces > 0) {
    value -= 10;
    aces -= 1;
  }

  return value;
}

export function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function getBet(balance: number): number {
  let bet: number;

  do {
    bet = parseInt(prompt(`You have $${balance}. Enter your bet: `), 10); //the second argument specifies that the number is in the decimal system
  } while (isNaN(bet) || bet <= 0 || bet > balance);

  return bet;
}

export function getStrHand(hand: ICard[], hideSecondCard: boolean = false): string {

    let str = "";

    for (const [idx, card] of hand.entries()) {
        if (idx !== 0) str += ", "
        if (idx === 1 && hideSecondCard) {
            str += "[hidden]"
            break;
        }
        str += `${card.getName()}${card.suit}`
    }

    return str;
}
