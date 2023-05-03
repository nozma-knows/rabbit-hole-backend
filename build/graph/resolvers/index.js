"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const course_resolvers_1 = require("./course.resolvers");
exports.resolvers = {
    Query: Object.assign({}, course_resolvers_1.courseQueryResolvers),
    Mutation: Object.assign({}, course_resolvers_1.courseMutationResolvers),
};
