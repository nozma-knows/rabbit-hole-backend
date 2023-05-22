import { PrismaClient } from "@prisma/client";
import {
  CoursePrereq,
  CourseResolvers,
  CourseUnit,
  CreateCourseInput,
  GenerateLessonInput,
  Maybe,
  PrereqTopic,
  QuizQuestion,
  Status,
  UnitExercise,
  UnitLesson,
  UpdateUserDetailsInput,
} from "../../__generated__/resolvers-types";
import { z } from "zod";
const crypto = require("crypto");

interface Context {
  prisma: PrismaClient;
}

export const userQueryResolvers: CourseResolvers = {
  userDetails: async (
    _parent: any,
    args: { userId: string },
    contextValue: Context
  ) => {
    // Grab prisma client
    const { prisma } = contextValue;

    if (!prisma) {
      throw new Error("Failed to find prisma client.");
    }

    // Grab args
    const { userId } = args;

    // Grab args error handling
    if (!userId) {
      throw new Error("Missing required fields");
    }

    // Find user details
    const userDetails = await prisma.userDetails.findUnique({
      where: { userId },
    });

    // Find user details error handling
    if (!userDetails) {
      throw new Error("Failed to find course");
    }

    return userDetails;
  },
};

export const userMutationResolvers: CourseResolvers = {
  createUserDetails: async (
    _parent: any,
    args: { userId: string },
    contextValue: Context
  ) => {
    // Grab prisma client
    const { prisma } = contextValue;
    // Grab prisma client error handling
    if (!prisma) {
      throw new Error("Failed to find prisma client.");
    }

    // Grab args
    const { userId } = args;

    // Grab args error handling
    if (!userId) {
      throw new Error("Missing required fields.");
    }

    // Find user details
    let userDetails = await prisma.userDetails.findUnique({
      where: { userId },
    });

    // Find user details error handling
    if (userDetails) {
      return userDetails;
    }

    userDetails = await prisma.userDetails.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        seenOnboarding: true,
      },
    });

    if (!userDetails) {
      throw new Error("Failed to create user details.");
    }
    return userDetails;
  },
  updateUserDetails: async (
    _parent: any,
    args: { userId: string; input: UpdateUserDetailsInput },
    contextValue: Context
  ) => {
    // Grab prisma client
    const { prisma } = contextValue;
    // Grab prisma client error handling
    if (!prisma) {
      throw new Error("Failed to find prisma client.");
    }

    // Grab userId
    const { userId } = args;

    // Grab userId error handling
    if (!userId) {
      throw new Error("Missing required fields.");
    }

    // Grab args
    const {
      firstName,
      lastName,
      nickname,
      dob,
      pronouns,
      educationLevel,
      occupation,
      interests,
      learningStyle,
      nightMode,
    } = args.input;

    const userDetails = await prisma.userDetails.update({
      where: {
        userId,
      },
      data: {
        userId,
        firstName: firstName,
        lastName: lastName,
        nickname: nickname,
        dob: dob,
        pronouns: pronouns ? (pronouns as string[]) : undefined,
        educationLevel: educationLevel,
        occupation: occupation,
        interests: interests ? (interests as string[]) : undefined,
        learningStyle: learningStyle,
        nightMode: Boolean(nightMode),
      },
    });

    if (!userDetails) {
      throw new Error("Failed to update user details.");
    }
    return userDetails;
  },
};
