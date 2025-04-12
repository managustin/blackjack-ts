import { getBet } from "./utils";

const balance = 100;
const bet = getBet(balance);
console.log(`You entered a valid bet: ${bet}`);