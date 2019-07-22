import { ClassType, transformAndValidate } from 'class-transformer-validator';
import { ValidationError } from 'class-validator';
import { JsonWebTokenError, verify } from 'jsonwebtoken';
import moment from 'moment';

import { Context } from '@azure/functions';
import { Role, User } from '@boilerplate/entity';

import { Authorized } from './authorized';
import { DB } from './db';
import { InternalServerError, UnauthorizedError, UserFriendlyError } from './error';
import { Output } from './output';
import { Index } from 'typeorm';

export interface Func0 {
  (userId?: number, roles?: Role[]): any;
}

export interface Func1<TInput> {
  (input: TInput): any;
}

export enum OperationID {
  INSERT,
  DELETE,
  UPDATE,
  SEARCH,
}
export interface Func3<TInput> {
  (input: TInput, userId?: number, roles?: Role[]): any;
}

export class AuditLog {
  url: string;
  input?: string;
  output?: string;
  executionTime: any;
  executionDuration: number;
  userId?: string;
  exception?: string;
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

    const userId = decoded.sub as string;

    const connection = await DB.getConnection();
    const userRepository = connection.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        id: userId,
      },
      select: ['roles', 'enabled'],
    });
    if (user === undefined || !user.enabled) {
      throw new UnauthorizedError();
    }
    // if (decoded.version !== user.tokenVersion) {
    //   throw new UnauthorizedError();
    // }

    // Check roles
    if (authorized && !authorized.permitted(user.roles)) {
      throw new UnauthorizedError();
    }

    return {
      userId,
      roles: user.roles,
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

  async function insertAuditLog(auditLog: AuditLog) {
    // This function allows some logics to log all requests
    console.log(auditLog);
  }

  async function run(
    context: Context,
    func: (verifyResult: { userId?: string; roles?: Role[] }) => Promise<{ status: number; body: Output<any>; headers: {} }>,
    authorized?: Authorized,
  ): Promise<{ status: number; body: Output<any>; headers: {} }> {
    const auditLog: AuditLog = {
      executionTime: moment(),
      executionDuration: 0,
      url: '',
    };

    let res: { status: number; body: Output<any>; headers: {} };

    try {
      const req = context.req;

      const verifyResult = await verifyAccessToken(req, authorized);

      if (verifyResult) {
        auditLog.userId = verifyResult.userId;
      }

      res = await func(verifyResult);
    } catch (ex) {
      console.log(ex);

      auditLog.exception = ex.toString();

      if (ex instanceof UnauthorizedError || ex instanceof JsonWebTokenError) {
        res = Output.unauthorized();
      } else if (Array.isArray(ex)) {
        const constraints = ex
          .filter(ex => ex instanceof ValidationError)
          .reduce((acc, ex) => acc.concat(ex.constraints), []);

        res = Output.badRequest(constraints);
      } else if (ex instanceof UserFriendlyError) {
        res = Output.error(ex.message);
      } else {
        res = Output.internalError(`${ex.toString()}`);
      }

      if (process.env.NODE_ENV === 'Development') {
        console.error(ex);
      }
    }

    if (context.req) {
      if (context.req.url) auditLog.url = context.req.url;

      auditLog.input = JSON.stringify(context.req);
    }
    if (res) {
      auditLog.output = JSON.stringify(res);
    }
    auditLog.executionDuration = new Date().valueOf() - auditLog.executionTime.valueOf();

    if (process.env.NODE_ENV === 'Production' && !auditLog.url.includes('AuditLog/List')) {
      await insertAuditLog(auditLog);
    }

    return res;
  }

  export async function runWithInput<TInput extends object>(
    context: any,
    func: Func1<TInput> | Func3<TInput>,
    inputClass: ClassType<TInput>,
    opID : OperationID,
    authorized?: Authorized,
  ): Promise<{ status: number; body: Output<any>; headers: {} }> {
    return await run(
      context,
      async (verifyResult) => {
        const input = await parseInput(context.req, inputClass);

        const anyFunc: any = func as any;

        const output = verifyResult ? await anyFunc(input, verifyResult.userId, verifyResult.roles) : await anyFunc(input);
        if (opID === OperationID.INSERT) {
          return Output.created(output);
        }
        if  (opID === OperationID.DELETE || opID === OperationID.UPDATE)  {
          return Output.accepted(output);
        }
        return Output.ok(output);
      },
      authorized);
  }

  export async function runWithoutInput(
    context: any,
    func: Func0,
    authorized?: Authorized,
  ): Promise<{ status: number; body: Output<any>; headers: {} }> {
    return await run(
      context,
      async (verifyResult) => {
        const anyFunc: any = func as any;

        const output = verifyResult ? await anyFunc(verifyResult.userId, verifyResult.roles) : await anyFunc();

        return Output.ok(output);
      },
      authorized);
  }

}
