import { Context } from '@azure/functions';
import { Category, CategoryDto } from '@boilerplate/entity';
import { Authorized, DB, Func, InternalServerError } from '@boilerplate/util';

export class GetCategoryOutput {
  public counts: number;
  constructor(public categories: CategoryDto[]) {
    this.counts = categories.length;
  }
}

export async function getCategories(): Promise<GetCategoryOutput> {
  try {
    const connection = await DB.getConnection();
    const categoryRepository = connection.getRepository(Category);

    const categories = await categoryRepository.find();

    return new GetCategoryOutput(categories);
  } catch (err) {
    throw new InternalServerError(` - Get Categories Function in ${__filename} - ${err.toString()}`);
  }
}

export async function categoryGetCategoriesFunc(context: Context) {
  try {
    context.res = await Func.runWithoutInput(
    context,
    getCategories,
  );
  } catch (err) {
    throw new InternalServerError(` - Get Categories Function in ${__filename} - ${err.toString()}`);
  }
}
