export class UserFriendlyError extends Error {

  constructor(message: string) {
    super();

    this.message = message;
  }

}
