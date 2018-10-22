export class UnauthorizedError extends Error {
}

export class UserFriendlyError extends Error {

  constructor(message: string) {
    super();

    this.message = message;
  }

}

export class InternalServerError extends Error {
}
