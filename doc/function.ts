import {
    FunctionDeclaration, Identifier, Node, Project, Statement, ts, TypeGuards,
} from 'ts-morph';

import { ClassEntry, dtoEntries } from './dto';
import { extractClassAndImportPath } from './util';

export interface FunctionEntry {
  functionStatement: string;
  filePath: string;
  inputClassName: string | undefined;
  outputClassName: string | undefined;
}

const funcEntries: FunctionEntry[] = [];

const project = new Project({
  tsConfigFilePath: 'tsconfig.json',
});

const sourceFiles = project.getSourceFiles('src/func/**/*.ts');

const functions = sourceFiles.reduce(
  (accumulator, currentValue) => accumulator.concat(currentValue.getFunctions().filter(f => f.getNameOrThrow().endsWith('Func'))),
  [] as FunctionDeclaration[],
);

functions.map((f) => {
  for (const statement of f.getStatements()) {

    // context.res = await Func.run1(context, encodeVideo, EncodeVideoInput, Authorized.permit({ anyRoles: [Role.Admins] }));
    parseStatement(statement, f);
  }
});

function parseStatement(statement: Statement<ts.Statement>, functionDeclaration: FunctionDeclaration) {
  if (TypeGuards.isExpressionStatement(statement)) {
    const filePath = functionDeclaration.getSourceFile().getFilePath();

    let functionStatement: string = '';
    let inputClassName: string | undefined;
    let outputClassName: string | undefined;

    for (const expression of statement.getExpression().getChildren()) {
      functionStatement = expression.getText();

      // await Func.run1(context, encodeVideo, EncodeVideoInput, Authorized.permit({ anyRoles: [Role.Admins] }))
      if (TypeGuards.isAwaitExpression(expression)) {
        for (const syntaxList of expression.getExpression().getChildren()) {

          // Identifier, Identifier, Identifier, CallExpression
          // context, encodeVideo, EncodeVideoInput, Authorized.permit({ anyRoles: [Role.Admins] })
          const { inputEntry: inEntry, outputEntry: outEntry } = parseParameters(syntaxList, functionDeclaration);

          inputClassName = inputClassName === undefined && inEntry ? inEntry.className : inputClassName;
          outputClassName = outputClassName === undefined && outEntry ? outEntry.className : outputClassName;
        }
      }
    }

    const functionEntry = {
      functionStatement,
      filePath,
      inputClassName,
      outputClassName,
    };

    funcEntries.push(functionEntry);
  }
}

function parseParameters(syntaxList: Node<ts.Node>, functionDeclaration: FunctionDeclaration) {
  let inputEntry: ClassEntry | undefined;
  let outputEntry: ClassEntry | undefined;

  if (TypeGuards.isSyntaxList(syntaxList)) {
    for (const child of syntaxList.getChildren()) {

      // context
      // encodeVideo
      // EncodeVideoInput
      // Authorized.permit({ anyRoles: [Role.Admins] })
      if (TypeGuards.isIdentifier(child)) {

        // context
        if (child.getText() === 'context') {
          continue;
        }

        // encodeVideo
        outputEntry = outputEntry === undefined ? parseOutput(child, functionDeclaration) : outputEntry;

        // EncodeVideoInput
        inputEntry = inputEntry === undefined ? parseInput(child) : inputEntry;
      }
    }
  }

  return {
    inputEntry,
    outputEntry,
  };
}

function parseInput(identifier: Identifier) {
  const dtoEntry = dtoEntries.find(de => de.className === identifier.getText());
  if (dtoEntry) {
    return dtoEntry;
  }

  return undefined;
}

function parseOutput(child: Identifier, functionDeclaration: FunctionDeclaration) {
  const funcDeclaration = functionDeclaration.getSourceFile().getFunction(child.getText());
  if (funcDeclaration) {
    // Skip void
    const returnType = funcDeclaration.getReturnType().getText();
    if (returnType === 'Promise<void>') {
      return undefined;
    }

    // Promise<Class>
    const outputClassNameWithImportPath = funcDeclaration.getReturnType().getTypeArguments().map(ta => ta.getText())[0];
    if (outputClassNameWithImportPath === undefined) {
      throw new Error();
    }

    const { className, absoluteImportPath } = extractClassAndImportPath(outputClassNameWithImportPath);

    const dtoEntry = dtoEntries.find(de => de.className === className && de.filePath === absoluteImportPath);
    if (dtoEntry) {
      return dtoEntry;
    }
  }

  return undefined;
}

export const functionEntries = funcEntries;
