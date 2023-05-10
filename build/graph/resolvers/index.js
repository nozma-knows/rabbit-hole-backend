"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const course_resolvers_1 = require("./course.resolvers");
const user_resolvers_1 = require("./user.resolvers");
exports.resolvers = {
    Query: Object.assign(Object.assign({}, course_resolvers_1.courseQueryResolvers), user_resolvers_1.userQueryResolvers),
    Mutation: Object.assign(Object.assign({}, course_resolvers_1.courseMutationResolvers), user_resolvers_1.userMutationResolvers),
};
