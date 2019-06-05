export class Output<T> {

  success: boolean = true;

  data: T;

  message: string;

  dateTime = new Date().toISOString();

  static out(status: number, body: any) {
    return {
      status,
      body,
      headers: {
        'Content-Type': 'application/json',
      },
    };
  }

  static ok(data?: any) {
    const output = new Output();

    if (typeof data === 'string') {
      output.message = data;
    } else if (typeof data === 'object') {
      if (data != null) output.data = data;
    }

    return this.out(200, output);
  }

  static internalError(message: string = 'There are some errors.', data?: any) {
    const output = new Output();

    output.success = false;

    if (message) output.message = message;
    if (data) output.data = data;

    return this.out(500, output);
  }

  static error(message: string, data?: any) {
    const output = new Output();

    output.success = false;
    output.message = message;

    if (data) output.data = data;

    return this.out(400, output);
  }

  static badRequest(constraints: { [type: string]: string }[]) {
    const output = new Output();

    output.success = false;
    output.message = 'The input is invalid.';
    output.data = constraints;

    return this.out(400, output);
  }

  static unauthorized() {
    const output = new Output();

    output.success = false;

    return this.out(401, output);
  }

}
