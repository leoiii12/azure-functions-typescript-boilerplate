import { Context } from '@azure/functions';
import { ListingType, ListingTypeDto } from '@boilerplate/entity';
import { Authorized, DB, Func , InternalServerError } from '@boilerplate/util';

export class GetListingTypesOutput {
  public counts : number;
  constructor(public sites: ListingTypeDto[]) {
    this.counts = sites.length;
  }
}

export async function getListingTypes(): Promise<GetListingTypesOutput> {
  try {
    const connection = await DB.getConnection();
    const listingTypeRepository = connection.getRepository(ListingType);

    const sites = await listingTypeRepository.find();

    return new GetListingTypesOutput(sites);
  } catch (err) {
    throw new InternalServerError(` -  Get Listing Type Function in ${__filename} - ${err.toString()}`);
  }
}

export async function listingTypeGetListingTypesFunc(context: Context) {
  context.res = await Func.runWithoutInput(
    context,
    getListingTypes,
  );
}
