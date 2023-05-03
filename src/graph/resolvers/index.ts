import {
  courseQueryResolvers,
  courseMutationResolvers,
} from "./course.resolvers";

export const resolvers: any = {
  Query: {
    ...courseQueryResolvers,
  },
  Mutation: {
    ...courseMutationResolvers,
  },
};
