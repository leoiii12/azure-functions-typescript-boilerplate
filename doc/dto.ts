import {
    ClassDeclaration, ParameterDeclaration, Project, PropertyDeclaration, SyntaxKind, Type,
} from 'ts-morph';

import { flat, getClassDeclaration } from './util';

export interface MemberEntry {
  name: string;
  type: string;
  decorators: string[];
}

export interface ClassEntry {
  className: string;
  filePath: string;
  members: MemberEntry[];
}

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
});

const sourceFiles = project.getSourceFiles('src/**/*.ts');

const entries: ClassEntry[] = [];

const inputs = sourceFiles.reduce(
  (accumulator, currentValue) => accumulator.concat(currentValue.getClasses().filter(c => (c.getName() || '').endsWith('Input'))),
  [] as ClassDeclaration[],
);
const outputs = sourceFiles.reduce(
  (accumulator, currentValue) => accumulator.concat(currentValue.getClasses().filter(c => (c.getName() || '').endsWith('Output'))),
  [] as ClassDeclaration[],
);

inputs.forEach((o) => {
  addClassDeclaration(o);
});
outputs.forEach((o) => {
  addClassDeclaration(o);
});

function typeToMemberEntry(node: PropertyDeclaration | ParameterDeclaration) {
  // const symbol = arrayType.getSymbol();
  // if (symbol !== undefined && symbol.getDeclarations().some(d => d.getKind() === SyntaxKind.EnumDeclaration)) {

  const type = node.getType().getNonNullableType();

  // Array
  if (type.isArray()) {
    const arrayType = type.getArrayElementType() as Type;

    // Enum Array
    const symbol = arrayType.getSymbol();
    if (symbol !== undefined && symbol.getDeclarations().some(d => d.getKind() === SyntaxKind.EnumDeclaration)) {
      return {
        name: node.getName(),
        type: 'int[]',
        decorators: node.getDecorators().map((d: any) => d.getText()).map(d => d.replace(/(?:\r\n|\r|\n)/gm, '')),
      } as MemberEntry;
    }

    // Indirect Array
    if (arrayType.getText().startsWith('import')) {
      const indirectClassDeclaration = getClassDeclaration(arrayType.getText(), sourceFiles);
      addClassDeclaration(indirectClassDeclaration);
    }

    return {
      name: node.getName(),
      type: type.getText(),
      decorators: node.getDecorators().map((d: any) => d.getText()).map(d => d.replace(/(?:\r\n|\r|\n)/gm, '')),
    } as MemberEntry;
  }

  // Enum
  const symbol = type.getSymbol();
  if (symbol !== undefined && symbol.getDeclarations().some(d => d.getKind() === SyntaxKind.EnumDeclaration)) {
    return {
      name: node.getName(),
      type: 'int',
      decorators: node.getDecorators().map((d: any) => d.getText()).map(d => d.replace(/(?:\r\n|\r|\n)/gm, '')),
    } as MemberEntry;
  }

  // Union
  if (type.isUnion()) {
    type.getText().split('|')
      .map(d => d.replace(/( |\[|\])/gm, ''))
      .map((d) => {
        if (d.startsWith('import')) {
          addClassDeclaration(getClassDeclaration(d, sourceFiles));
        }
      });
    return {
      name: node.getName(),
      type: type.getText(),
      decorators: node.getDecorators().map((d: any) => d.getText()).map(d => d.replace(/(?:\r\n|\r|\n)/gm, '')),
    } as MemberEntry;
  }

  // Indirect
  if (type.getText().startsWith('import')) {
    const indirectClassDeclaration = getClassDeclaration(type.getText(), sourceFiles);
    addClassDeclaration(indirectClassDeclaration);
  }

  return {
    name: node.getName(),
    type: type.getText(),
    decorators: node.getDecorators().map((d: any) => d.getText()).map(d => d.replace(/(?:\r\n|\r|\n)/gm, '')),
  } as MemberEntry;
}

// Recursively retrieve all class declarations
function addClassDeclaration(cd: ClassDeclaration) {
  const className = cd.getNameOrThrow();
  const filePath = cd.getSourceFile().getFilePath();

  // Skip duplicate
  if (entries.some(e => e.className === className && e.filePath === filePath)) {
    return;
  }

  const propertyMembers = cd
    .getMembers()
    .map((member) => {
      if (member instanceof PropertyDeclaration) {
        return typeToMemberEntry(member);
      }

      return undefined as unknown as MemberEntry;
    })
    .filter(m => m);

  const constructorMembers = cd
    .getConstructors()
    .map((c) => {
      return c.getParameters().map((param) => {
        return typeToMemberEntry(param);
      });
    });

  entries.push({
    className,
    filePath,
    members: [...propertyMembers, ...flat(constructorMembers)],
  });
}

export const dtoEntries = entries;
