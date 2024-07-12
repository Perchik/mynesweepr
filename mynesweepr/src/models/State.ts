export enum State {
  Open,
  Closed,
  Pressed,
  Flagged,
  Guessed,
  Mine, // Used to show all the mines at the end of the game if the player loses.
  Exploded, // The one mine the user clicked that caused the game to end.
}
