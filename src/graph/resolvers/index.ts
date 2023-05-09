import {
  courseQueryResolvers,
  courseMutationResolvers,
} from "./course.resolvers";

import { userQueryResolvers, userMutationResolvers } from "./user.resolvers";

export const resolvers: any = {
  Query: {
    ...courseQueryResolvers,
    ...userQueryResolvers,
  },
  Mutation: {
    ...courseMutationResolvers,
    ...userMutationResolvers,
  },
};
