import { ValidationError } from 'class-validator';
import { JsonWebTokenError, verify } from 'jsonwebtoken';

import { Role } from '@boilerplate/entity';

import { Authorized } from './authorized';
import { Output } from './output';
import { UnauthorizedError } from './unauthorized-error';
import { UserFriendlyError } from './user-friendly-error';

export namespace Function {

  export async function run(context: any, func: Function, authorized?: Authorized): Promise<any> {
    context.log('JavaScript HTTP trigger function processed a request.');

    try {
      const req = context.req;

      /**
       * Authorization
       */
      if ('x-authorization' in req.headers) {
        const accessToken: string = req.headers['x-authorization'].replace('Bearer ', '');

        const secret = process.env.AUTH_SECRET;
        if (!secret) return Output.internalError();

        const decoded = await verify(accessToken, secret) as any;

        const userId = decoded.sub;
        const roles: Role[] = decoded.role.map((r: any) => Number.parseInt(r, 10));

        if (authorized != null && !authorized.permitted(roles)) throw new UnauthorizedError();

        /**
         * Function entry point
         */
        return Output.ok(await func(userId, roles));
      }

      if (authorized != null) throw new UnauthorizedError();

      /**
       * Function entry point
       */
      return Output.ok(await func());
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

      /**
       * Uncaught error
       */
      context.log.error(ex);

      return Output.internalError();
    }
  }

}
