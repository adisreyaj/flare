import { CreateUserInput, UpdateUserInput } from '@flare/api-interfaces';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query('user')
  findOne(@Args('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Query('users')
  findAll() {
    return this.usersService.findAll();
  }

  @Mutation('createUser')
  create(@Args('input') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Mutation('updateUser')
  update(@Args('input') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput);
  }

  @Mutation('deleteUser')
  delete(@Args('id') id: string) {
    return this.usersService.delete(id);
  }

  @Mutation('follow')
  follow(@Args('userId') userId: string) {
    return this.usersService.follow(userId);
  }

  @Mutation('unfollow')
  unfollow(@Args('userId') userId: string) {
    return this.usersService.unfollow(userId);
  }
}
