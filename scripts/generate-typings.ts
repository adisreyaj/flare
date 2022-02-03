import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['apps/api/src/app/**/*.graphql'],
  path: join(process.cwd(), 'libs/api-interfaces/src/index.ts'),
  watch: true,
  emitTypenameField: true,
});
