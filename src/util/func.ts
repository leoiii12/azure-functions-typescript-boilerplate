import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { ValidationError } from 'class-validator';
import { JsonWebTokenError, verify } from 'jsonwebtoken';

import { Role } from '@boilerplate/entity';

import { Authorized } from './authorized';
import { InternalServerError, UnauthorizedError, UserFriendlyError } from './error';
import { Output } from './output';

export interface Func0 {
  (userId?: string, roles?: Role[]): any;
}

export interface Func1<TInput> {
  (input: TInput): any;
}

export interface Func3<TInput> {
  (input: TInput, userId?: string, roles?: Role[]): any;
}

export namespace Func {

  async function verifyAccessToken(req: any, authorized?: Authorized): Promise<{ userId?: string; roles?: Role[]; }> {
    // Check header
    if (!('x-authorization' in req.headers)) {
      if (authorized) {
        throw new UnauthorizedError();
      }

      return {};
    }

    const accessToken: string = req.headers['x-authorization'].replace('Bearer ', '');

    // Get auth secret
    const secret = process.env.AUTH_SECRET;
    if (!secret) {
      throw new InternalServerError('process.env.AUTH_SECRET is empty.');
    }

    const decoded = await verify(accessToken, secret) as any;

    const userId = decoded.sub;
    const roles: Role[] = decoded.role.map((r: any) => Number.parseInt(r, 10));

    // Check roles
    if (authorized && !authorized.permitted(roles)) {
      throw new UnauthorizedError();
    }

    return {
      userId,
      roles,
    };
  }

  async function parseInput<TInput extends object>(req: any, classType: ClassType<TInput>) {
    if (classType) {
      if (req.body) {
        return await transformAndValidate(classType, req.body);
      }

      throw new UserFriendlyError('');
    }

    return undefined;
  }

  export async function run(
    context: any,
    func: (verifyResult: { userId?: string; roles?: Role[] }) => Promise<{ status: number; body: Output; headers: {} }>,
    authorized?: Authorized,
  ): Promise<{ status: number; body: Output; headers: {} }> {
    context.log('JavaScript HTTP trigger function processed a request.');

    try {
      const req = context.req;

      const verifyResult = await verifyAccessToken(req, authorized);

      return await func(verifyResult);
    } catch (ex) {
      if (ex instanceof UnauthorizedError || ex instanceof JsonWebTokenError) {
        return Output.unauthorized();
      }

      if (Array.isArray(ex)) {
        const constraints = ex
          .filter(ex => ex instanceof ValidationError)
          .reduce((acc, ex) => acc.concat(ex.constraints), []);

        return Output.badRequest(constraints);
      }

      if (ex instanceof UserFriendlyError) {
        return Output.error(ex.message);
      }

      context.log.error(ex);

      return Output.internalError();
    }
  }

  export async function run1<TInput extends object>(
    context: any,
    func: Func1<TInput> | Func3<TInput>,
    inputClass: ClassType<TInput>,
    authorized?: Authorized,
  ): Promise<{ status: number; body: Output; headers: {} }> {
    return await run(
      context,
      async (verifyResult) => {
        const input = await parseInput(context.req, inputClass);

        const anyFunc: any = func as any;

        if (verifyResult) {
          return Output.ok(await anyFunc(input, verifyResult.userId, verifyResult.roles));
        }

        return Output.ok(await anyFunc(input));

      },
      authorized);
  }

  export async function run0(
    context: any,
    func: Func0,
    authorized?: Authorized,
  ): Promise<{ status: number; body: Output; headers: {} }> {
    return await run(
      context,
      async (verifyResult) => {
        const anyFunc: any = func as any;

        if (verifyResult) {
          return Output.ok(await anyFunc(verifyResult.userId, verifyResult.roles));
        }

        return Output.ok(await anyFunc());
      },
      authorized);
  }

}
