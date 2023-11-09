export class MaxDistanceError extends Error {
  constructor() {
    super("The distance between you and the gym is too high");
  }
}
