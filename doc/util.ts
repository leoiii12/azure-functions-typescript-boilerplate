import { ClassDeclaration, SourceFile } from 'ts-morph';

export function flat(arrays: any[]) {
  return [].concat.apply([], arrays);
}

// IN classNameWithImportPath
// e.g. import("/Users/leochoi/Projects/eim-functions/src/entity/course").CourseDto
// OUT className
// e.g. CourseDto
// OUT absoluteImportPath
// e.g. /Users/leochoi/Projects/eim-functions/src/entity/course.ts
export function extractClassAndImportPath(classNameWithImportPath: string) {
  const regex = /import\(\"(.*)\"\)\.(.*)/;

  const matches = regex.exec(classNameWithImportPath);
  if (matches === null) {
    throw new Error();
  }

  const className = matches[2];
  const importPath = `${matches[1]}.ts`;

  return {
    className,
    absoluteImportPath: importPath,
  };
}

// classNameWithImportPath
// e.g. import("/Users/leochoi/Projects/eim-functions/src/entity/course").CourseDto
export function getClassDeclaration(classNameWithImportPath: string, sourceFiles: SourceFile[]): ClassDeclaration {
  const { className, absoluteImportPath } = extractClassAndImportPath(classNameWithImportPath);

  const classDeclarations = flat(sourceFiles.filter(sf => sf.getFilePath() === absoluteImportPath).map(sf => sf.getClasses())) as ClassDeclaration[];
  const classDeclaration = classDeclarations.find(c => c.getNameOrThrow() === className);

  if (classDeclaration === undefined) {
    throw new Error();
  }

  return classDeclaration;
}

export function normalizeToSwaggerType(inType: string): string {
  const type = inType
    .replace(/\| null/g, '')
    .replace(/\| undefined/g, '')
    .replace(/\ /, '');

  switch (type) {
    case 'int':
      return 'integer';
    case 'any':
      return 'object';
    case 'Date':
      return 'string';
    default:
      return type;
  }
}
