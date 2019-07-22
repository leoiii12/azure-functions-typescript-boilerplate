import { Context } from '@azure/functions';
import { Condition, ConditionDto } from '@boilerplate/entity';
import { Authorized, DB, Func , InternalServerError } from '@boilerplate/util';

export class GetConditionsOutput {
  public counts : number;
  constructor(public sites: ConditionDto[]) {
    this.counts = sites.length;
  }
}

export async function getConditions(): Promise<GetConditionsOutput> {
  try {
    const connection = await DB.getConnection();
    const conditionRepository = connection.getRepository(Condition);

    const conditions = await conditionRepository.find();

    return new GetConditionsOutput(conditions);
  } catch (err) {
    throw new InternalServerError(`Error in Get Conditions Function in ${__filename} - ${err.toString()}`);
  }
}

export async function conditionsGetConditionsFunc(context: Context) {
  context.res = await Func.runWithoutInput(
    context,
    getConditions,
  );
}
