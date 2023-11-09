export class ResourceNotFoundError extends Error {
  constructor() {
    super("This resource is not available");
  }
}
