import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['apps/api/src/app/**/*.graphql', 'libs/**/*.graphql'],
  path: join(process.cwd(), 'libs/api-interfaces/src/graphql.ts'),
  watch: true,
  emitTypenameField: true,
});
