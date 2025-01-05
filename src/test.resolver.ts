import { Query, Resolver } from '@nestjs/graphql';

// Чтобы graphql запустился, потом убрать
@Resolver()
export class TestResolver {
  @Query(() => String)
  hello(): string {
    return 'Hello World!';
  }
}
