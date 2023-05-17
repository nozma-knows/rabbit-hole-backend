"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMutationResolvers = exports.userQueryResolvers = void 0;
exports.userQueryResolvers = {
    userDetails: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
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
        const userDetails = yield prisma.userDetails.findUnique({
            where: { userId },
        });
        // Find user details error handling
        if (!userDetails) {
            throw new Error("Failed to find course");
        }
        return userDetails;
    }),
};
exports.userMutationResolvers = {
    createUserDetails: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
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
        let userDetails = yield prisma.userDetails.findUnique({
            where: { userId },
        });
        // Find user details error handling
        if (userDetails) {
            return userDetails;
        }
        userDetails = yield prisma.userDetails.create({
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
    }),
    updateUserDetails: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
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
        const { firstName, lastName, nickname, dob, pronouns, educationLevel, occupation, interests, learningStyle, nightMode, } = args.input;
        const userDetails = yield prisma.userDetails.update({
            where: {
                userId,
            },
            data: {
                userId,
                firstName: firstName,
                lastName: lastName,
                nickname: nickname,
                dob: dob,
                pronouns: pronouns ? pronouns : undefined,
                educationLevel: educationLevel,
                occupation: occupation,
                interests: interests ? interests : undefined,
                learningStyle: learningStyle,
                nightMode: Boolean(nightMode),
            },
        });
        if (!userDetails) {
            throw new Error("Failed to update user details.");
        }
        return userDetails;
    }),
};
