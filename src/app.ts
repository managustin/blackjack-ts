//imports
import Deck from "./deck";
import { ICard } from "./types";
import { getBet, getDecision, getHandValue, getStrHand } from "./utils";
import promptSync from "prompt-sync";
const prompt = promptSync();

function playerTurn(playerHand: ICard[], deck: Deck): number {
    let handValue = getHandValue(playerHand);

    while(true) {
        const action = getDecision();
        if (action!== "hit") return handValue;

        playerHand.push(deck.deal(1)[0]);
        handValue = getHandValue(playerHand);
        console.log(`Your hand: ${getStrHand(playerHand)} (Total: ${handValue})`);

        if (handValue > 21){
            return handValue;
        }
    }
}

function dealerTurn(dealerHand: ICard[], deck: Deck): number {
    let handValue = getHandValue(dealerHand);

    while(true) {
        console.log(
            `Dealer's hand: ${getStrHand(dealerHand)} (Total: ${handValue})`
        );
        if (handValue >= 17) return handValue;

        dealerHand.push(deck.deal(1)[0]);
        handValue = getHandValue(dealerHand);
    }
}

let dealerHand: ICard[] = [];
let playerHand: ICard[] = [];
const deck: Deck = new Deck();
let balance = 100;

while(balance>0) {
    console.log(`Your balance: $${balance}`)
    console.log("Debug: Calling getBet...");
    const bet = getBet(balance);
    console.log(`Debug: Bet returned: ${bet}`);
    balance -= bet;
    console.log(`La apuesta es ${bet}`);

    //deal the cards
    deck.reset();  //   this shuffles the deck.
    playerHand = deck.deal(2);  // 2 cards each
    dealerHand = deck.deal(2); 

    const dealerValue = getHandValue(dealerHand);
    const playerValue = getHandValue(playerHand);
    
    console.log(`Your hand: ${getStrHand(playerHand)} (Total: $${playerValue})`);
    console.log(`Dealer's hand: ${getStrHand(dealerHand, true)}`);
    if (playerValue === 21){
        console.log(`Blackjack. You won $${bet * 2.5}`);
        balance += bet * 2.5;
        continue;
    } else if (dealerValue === 21) {
        console.log(`Dealer has Blackjack, you lost.`);
        continue;
    }

    const finalPlayerValue = playerTurn(playerHand, deck);
    if (finalPlayerValue > 21) {
        console.log("Bust! You lost.");
        continue;
    }
    const finalDealerValue = dealerTurn(dealerHand, deck);
    if(finalDealerValue > 21 || finalPlayerValue > finalDealerValue) {
        balance += bet * 2;
        console.log(`You won $${bet*2}`);
    }
    else if (finalDealerValue === finalPlayerValue) {
        balance += bet;
        console.log("It's a tie.");
    }else{
        console.log("The dealer won.")
    }

    console.log("You ran out of money!")
}