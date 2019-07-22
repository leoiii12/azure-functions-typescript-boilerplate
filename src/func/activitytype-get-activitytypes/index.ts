import { Context } from '@azure/functions';
import { Authorized, DB, Func , InternalServerError } from '@boilerplate/util';
import { ActivityType, ActivityTypeDto } from '@boilerplate/entity';

export class GetActivityTypeOutput {
  public counts : number;
  constructor(public sites: ActivityTypeDto[]) {
    this.counts = sites.length;
  }
}

export async function getActivityTypes(): Promise<GetActivityTypeOutput> {
  try {
    const connection = await DB.getConnection();
    const actTypeRepository = connection.getRepository(ActivityType);

    const activityTypes = await actTypeRepository.find();

    return new GetActivityTypeOutput(activityTypes);
  } catch (err) {
    throw new InternalServerError(` - Get Activity Types Function in ${__filename} - ${err.toString()}`);
  }
}

export async function actuvityGetActivityTypesFunc(context: Context) {
  context.res = await Func.runWithoutInput(
    context,
    getActivityTypes,
  );
}
