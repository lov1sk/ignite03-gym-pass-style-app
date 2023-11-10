export class LateCheckInValidationError extends Error {
  constructor() {
    super("The check in must be validated until 20 minuts his creation");
  }
}
