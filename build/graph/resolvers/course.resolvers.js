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
exports.courseMutationResolvers = exports.courseQueryResolvers = void 0;
const resolvers_types_1 = require("../../__generated__/resolvers-types");
const zod_1 = require("zod");
const { OpenAI, PromptTemplate } = require("langchain");
const { StructuredOutputParser } = require("langchain/output_parsers");
const crypto = require("crypto");
const queues_1 = require("../../utils/queues");
exports.courseQueryResolvers = {
    // Course query resolver
    course: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { id } = args;
        // Grab args error handling
        if (!id) {
            throw new Error("Missing required fields");
        }
        // Find course
        const course = yield prisma.course.findUnique({
            where: { id },
            include: {
                prereqs: {
                    include: {
                        topics: true,
                    },
                },
                units: {
                    include: {
                        lessons: true,
                        exercises: true,
                        quizzes: {
                            include: {
                                questions: true,
                            },
                        },
                    },
                },
            },
        });
        // Find course error handling
        if (!course) {
            throw new Error("Failed to find course");
        }
        return course;
    }),
    // Courses query resolver
    courses: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { authorId } = args;
        // Grab args error handling
        if (!authorId) {
            throw new Error("Missing required fields");
        }
        // Find courses
        const courses = yield prisma.course.findMany({
            where: { authorId },
        });
        // Find courses error handling
        if (!courses) {
            throw new Error("Failed to find courses");
        }
        return courses;
    }),
    // Enrollment query resolver
    enrollment: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { userId, courseId } = args;
        // Grab args error handling
        if (!userId || !courseId) {
            throw new Error("Missing required fields");
        }
        // Find enrollment
        const enrollment = yield prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
            include: {
                course: {
                    include: {
                        prereqs: {
                            include: {
                                topics: true,
                            },
                        },
                        units: {
                            include: {
                                lessons: true,
                                quizzes: {
                                    include: {
                                        questions: true,
                                    },
                                },
                            },
                        },
                    },
                },
                progress: {
                    include: {
                        quizAttempts: {
                            select: {
                                id: true,
                                attempt: true,
                                responses: {
                                    include: {
                                        question: true,
                                    },
                                },
                                status: true,
                                quizId: true,
                                courseProgressId: true,
                            },
                        },
                    },
                },
            },
        });
        // Find courses error handling
        if (!enrollment) {
            throw new Error("Failed to find courses");
        }
        return enrollment;
    }),
    // EnrolledIn query resolver
    enrolledIn: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
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
        // Find courses
        const enrollments = yield prisma.enrollment.findMany({
            where: { userId },
            include: {
                course: {
                    include: {
                        prereqs: {
                            include: {
                                topics: true,
                            },
                        },
                        units: {
                            include: {
                                lessons: true,
                                quizzes: {
                                    include: {
                                        questions: true,
                                    },
                                },
                            },
                        },
                    },
                },
                progress: true,
            },
        });
        // Find courses error handling
        if (!enrollments) {
            throw new Error("Failed to find courses");
        }
        return enrollments;
    }),
    // Courses query resolver
    allCourses: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Find courses
        const courses = yield prisma.course.findMany();
        // Find courses error handling
        if (!courses) {
            throw new Error("Failed to find courses");
        }
        return courses;
    }),
};
exports.courseMutationResolvers = {
    // Create course mutation resolver
    createCourse: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        // Grab prisma client error handling
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { authorId, title, description } = args.input;
        // Grab args error handling
        if (!authorId || !title || !description) {
            throw new Error("Missing required fields.");
        }
        const course = yield prisma.course.create({
            data: {
                id: crypto.randomUUID(),
                authorId,
                title,
                description,
                enrollments: {
                    create: [
                        {
                            id: crypto.randomUUID(),
                            userId: authorId,
                            progress: {
                                create: {
                                    id: crypto.randomUUID(),
                                    lessonsCompleted: [],
                                    exercisesCompleted: [],
                                    status: resolvers_types_1.Status.Pending,
                                },
                            },
                        },
                    ],
                },
                public: false,
            },
        });
        // Create course error handling
        if (!course) {
            throw new Error("Failed to create course.");
        }
        return course;
    }),
    // Delete course mutation resolver
    deleteCourse: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        const { prisma } = contextValue;
        // Grab args
        const { id } = args;
        // Grab args error handling
        if (!id) {
            throw new Error("Missing required fields");
        }
        // Delete course
        const course = yield prisma.course.delete({
            where: {
                id,
            },
        });
        // Delete course error handling
        if (!course) {
            throw new Error("Failed to delete course");
        }
        return course;
    }),
    // Create Job for generating prereqs
    createPrereqsJob: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        // Grab prisma client error handling
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { id: courseId } = args;
        // Grab args error handling
        if (!courseId) {
            throw new Error("Missing required fields.");
        }
        // Grab course
        const course = yield prisma.course.findUnique({
            where: {
                id: courseId,
            },
        });
        // Grab course error handling
        if (!course) {
            throw new Error("Failed to find course.");
        }
        try {
            yield queues_1.prereqsQueue.add({
                courseId: args.id,
            });
            return course;
        }
        catch (error) {
            console.log(error);
            throw new Error("Failed to create prereqs job.");
        }
    }),
    // Generate prereqs mutation resolver
    generatePrereqs: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        // Grab prisma client error handling
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { id: courseId } = args;
        // Grab args error handling
        if (!courseId) {
            throw new Error("Missing required fields.");
        }
        // Grab course
        const course = yield prisma.course.findUnique({
            where: {
                id: courseId,
            },
        });
        // Grab course error handling
        if (!course) {
            throw new Error("Failed to find course.");
        }
        // Destructure course
        const { title, description } = course;
        // Destructure course error handling
        if (!title || !description) {
            throw new Error("Course is missing required fields.");
        }
        // Create model
        const model = new OpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            temperature: 0,
            modelName: "gpt-3.5-turbo",
        });
        // Create model error handling
        if (!model) {
            throw new Error("Failed to create model");
        }
        // // Create parser
        // const parser = StructuredOutputParser.fromZodSchema(
        //   z
        //     .array(
        //       z.object({
        //         title: z.string().describe("Title for the prerequisite"),
        //         description: z
        //           .string()
        //           .describe("Two sentence description for the course prerequisite"),
        //         topics: z
        //           .array(
        //             z.object({
        //               title: z
        //                 .string()
        //                 .describe("Title for the prerequisite topic"),
        //               description: z
        //                 .string()
        //                 .describe(
        //                   "Two sentence description for the prerequisite topic"
        //                 ),
        //             })
        //           )
        //           .describe("List of prerequisite topics"),
        //       })
        //     )
        //     .describe("List of prerequisites")
        // );
        // // Create parser error handling
        // if (!parser) {
        //   throw new Error("Failed to create parser");
        // }
        // // Create formatInstructions
        // const formatInstructions = parser.getFormatInstructions();
        // // Create formatInstructions error handling
        // if (!formatInstructions) {
        //   throw new Error("Failed to create formatInstructions");
        // }
        // console.log("format instructions: ", formatInstructions);
        // Create promptTemplate
        // const promptTemplate = new PromptTemplate({
        //   template: `What are the most important prerequisites for a course called "{title}" which has the following description: "{description}". {format_instructions}. Limit the number of prerequisites to the top 3.`,
        //   inputVariables: ["title", "description"],
        //   partialVariables: { format_instructions: formatInstructions },
        // });
        // const promptTemplate = new PromptTemplate({
        //   template: `What are the most important prerequisites for a course called "{title}" which has the following description: "{description}". {format_instructions}. Limit the number of prerequisites to the top 3.`,
        //   inputVariables: ["title", "description"],
        // });
        const promptTemplate = new PromptTemplate({
            template: `What are the most important prerequisites for a course called "{title}" which has the following description: "{description}". Limit the number of prerequisites to the top 3. Output should be in JSON format. Each prerequisite should have a title, description, and list of topics. Each topic should have a title and description.`,
            inputVariables: ["title", "description"],
        });
        // Create promptTemplate error handling
        if (!promptTemplate) {
            throw new Error("Failed to create promptTemplate");
        }
        // Create prompt
        const prompt = yield promptTemplate.format({ title, description });
        // Create prompt error handling
        if (!prompt) {
            throw new Error("Failed to create prompt");
        }
        // Query openai
        const result = yield model.call(prompt);
        // Query openai error handling
        if (!result) {
            throw new Error("Failed to call openai");
        }
        const parsedResult = JSON.parse(result).prerequisites;
        // Parse result
        // const parsedResult = await parser.parse(result);
        // const parsedResult: any = [];
        // Parse result error handling
        // if (!parsedResult) {
        //   console.log("parsedResult is null");
        //   throw new Error("Failed to parse result");
        // }
        // console.log("parsedResult: ", parsedResult);
        // Create course prereqs
        const prereqs = [];
        yield prisma.coursePrereq.createMany({
            data: parsedResult.map((p) => {
                const prereqId = crypto.randomUUID();
                const prereq = {
                    id: prereqId,
                    courseId: courseId,
                    title: p.title,
                    description: p.description,
                    topics: p.topics,
                };
                prereqs.push(prereq);
                return {
                    id: prereqId,
                    courseId: courseId,
                    title: p.title,
                    description: p.description,
                };
            }),
        });
        // Create course prereqs error handling
        if (!prereqs) {
            throw new Error("Failed to create course prereqs");
        }
        // Create course prereq topics and update prereqs with topics
        prereqs.map((prereq) => __awaiter(void 0, void 0, void 0, function* () {
            const topicIds = [];
            yield prisma.prereqTopic.createMany({
                data: prereq.topics.map((topic) => {
                    const topicId = crypto.randomUUID();
                    topicIds.push(topicId);
                    return {
                        id: topicId,
                        prereqId: prereq.id,
                        title: topic ? topic.title : "",
                        description: topic ? topic.description : "",
                    };
                }),
            });
            yield prisma.coursePrereq.update({
                where: {
                    id: prereq.id,
                },
                data: {
                    topics: {
                        connect: topicIds.map((id) => ({ id })),
                    },
                },
            });
        }));
        // Update course with prereqs and units
        const updatedCourse = yield prisma.course.update({
            where: {
                id: courseId,
            },
            data: {
                prereqs: { connect: prereqs.map((prereq) => ({ id: prereq.id })) },
            },
        });
        return updatedCourse; // Return course
    }),
    // Create Job for generating units
    createUnitsJob: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        // Grab prisma client error handling
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { id: courseId } = args;
        // Grab args error handling
        if (!courseId) {
            throw new Error("Missing required fields.");
        }
        // Grab course
        const course = yield prisma.course.findUnique({
            where: {
                id: courseId,
            },
        });
        // Grab course error handling
        if (!course) {
            throw new Error("Failed to find course.");
        }
        try {
            yield queues_1.unitsQueue.add({
                courseId: args.id,
            });
            return course;
        }
        catch (error) {
            console.log(error);
            throw new Error("Failed to create units job.");
        }
    }),
    // Generate prereqs mutation resolver
    generateUnits: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        // Grab prisma client error handling
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { id: courseId } = args;
        // Grab args error handling
        if (!courseId) {
            throw new Error("Missing required fields.");
        }
        // Grab course
        const course = yield prisma.course.findUnique({
            where: {
                id: courseId,
            },
        });
        // Grab course error handling
        if (!course) {
            throw new Error("Failed to find course.");
        }
        // Destructure course
        const { title, description } = course;
        // Destructure course error handling
        if (!title || !description) {
            throw new Error("Course is missing required fields.");
        }
        // Create model
        const model = new OpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            temperature: 0,
            modelName: "gpt-3.5-turbo",
        });
        // Create model error handling
        if (!model) {
            throw new Error("Failed to create model");
        }
        // // Create parser
        // const parser = StructuredOutputParser.fromZodSchema(
        //   z
        //     .array(
        //       z.object({
        //         title: z.string().describe("Title of a course unit"),
        //         description: z.string().describe("Description of a course unit"),
        //         lessons: z
        //           .array(
        //             z
        //               .object({
        //                 title: z
        //                   .string()
        //                   .describe("Title of a course unit's lesson"),
        //                 topics: z
        //                   .array(
        //                     z
        //                       .string()
        //                       .describe("Topic covered in a course unit's lesson")
        //                   )
        //                   .describe("Topics covered in a course unit's lesson"),
        //               })
        //               .describe("Lesson covered in a course unit")
        //           )
        //           .describe("Lessons covered in a course unit"),
        //       })
        //     )
        //     .describe("Units of a course")
        // );
        // // Create parser error handling
        // if (!parser) {
        //   throw new Error("Failed to create parser");
        // }
        // // Create formatInstructions
        // const formatInstructions = parser.getFormatInstructions();
        // // Create formatInstructions error handling
        // if (!formatInstructions) {
        //   throw new Error("Failed to create formatInstructions");
        // }
        // // Create promptTemplate
        // const promptTemplate = new PromptTemplate({
        //   template: `What are the most important units to cover for a course called "{title}" which has the following description: "{description}". Output the response with the following format: {format_instructions}. Each unit should contain a minimum of 3 lessons.`,
        //   inputVariables: ["title", "description"],
        //   partialVariables: { format_instructions: formatInstructions },
        // });
        // Create promptTemplate
        const promptTemplate = new PromptTemplate({
            template: `What are the most important units to cover for a course called "{title}" which has the following description: "{description}". Each unit should contain a minimum of 3 lessons. Output should be an object with a key of units and value that is an array of units. Output should be in JSON format. Each unit should include a title, description, and a list of lessons. Each lesson should include a title and a list of topics. Each topic should be a string.`,
            inputVariables: ["title", "description"],
        });
        // Create promptTemplate error handling
        if (!promptTemplate) {
            throw new Error("Failed to create promptTemplate");
        }
        // Create prompt
        const prompt = yield promptTemplate.format({ title, description });
        // Create prompt error handling
        if (!prompt) {
            throw new Error("Failed to create prompt");
        }
        // Query openai
        const result = yield model.call(prompt);
        // Query openai error handling
        if (!result) {
            throw new Error("Failed to call openai");
        }
        const parsedResult = JSON.parse(result).units;
        // Parse result
        // const parsedResult = await parser.parse(result);
        // Parse result error handling
        if (!parsedResult) {
            throw new Error("Failed to parse result");
        }
        // Create course prereqs
        const units = [];
        yield prisma.courseUnit.createMany({
            data: parsedResult.map((u, index) => {
                const unitId = crypto.randomUUID();
                const unit = {
                    id: unitId,
                    courseId: courseId,
                    title: u.title,
                    description: u.description,
                    lessons: u.lessons,
                    order: index + 1,
                };
                units.push(unit);
                return {
                    id: unitId,
                    courseId: courseId,
                    title: u.title,
                    description: u.description,
                    order: index + 1,
                };
            }),
        });
        // Create course prereqs error handling
        if (!units) {
            throw new Error("Failed to create course prereqs");
        }
        // Create course prereq topics and update prereqs with topics
        units.map((unit) => __awaiter(void 0, void 0, void 0, function* () {
            const lessonIds = [];
            yield prisma.unitLesson.createMany({
                data: unit.lessons.map((lesson, index) => {
                    const lessonId = crypto.randomUUID();
                    lessonIds.push(lessonId);
                    return {
                        id: lessonId,
                        unitId: unit.id,
                        title: lesson ? lesson.title : "",
                        topics: lesson ? lesson.topics.toString() : "",
                        content: "",
                        order: index + 1,
                    };
                }),
            });
            yield prisma.courseUnit.update({
                where: {
                    id: unit.id,
                },
                data: {
                    lessons: {
                        connect: lessonIds.map((id) => ({ id })),
                    },
                },
            });
        }));
        // Update course with units
        const updatedCourse = yield prisma.course.update({
            where: {
                id: courseId,
            },
            data: {
                units: { connect: units.map((unit) => ({ id: unit.id })) },
            },
            include: {
                units: {
                    include: {
                        lessons: true,
                        quizzes: {
                            include: {
                                questions: true,
                            },
                        },
                    },
                },
            },
        });
        return updatedCourse; // Return course
    }),
    // Generate exercises mutation resolver
    generateExercises: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        // Grab prisma client error handling
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab unitId from args
        const { id: unitId } = args;
        // Grab args error handling
        if (!unitId) {
            throw new Error("Missing required fields.");
        }
        // Grab unit
        const unit = yield prisma.courseUnit.findUnique({
            where: {
                id: unitId,
            },
            include: {
                lessons: true,
                exercises: true,
            },
        });
        // Grab unit error handling
        if (!unit) {
            throw new Error("Failed to find course.");
        }
        // Destructure unit
        const { title, description, lessons } = unit;
        // Destructure unit error handling
        if (!title || !description || !lessons) {
            throw new Error("Unit is missing required fields.");
        }
        const topics = lessons
            .map((lesson) => lesson.topics)
            .join(" ");
        // Create model
        const model = new OpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            temperature: 0,
            modelName: "gpt-3.5-turbo",
        });
        // Create model error handling
        if (!model) {
            throw new Error("Failed to create model");
        }
        // Create parser
        const parser = StructuredOutputParser.fromZodSchema(zod_1.z
            .array(zod_1.z
            .object({
            task: zod_1.z
                .string()
                .describe("The task required to complete the exercise"),
        })
            .describe("Exercise for a course"))
            .describe("A list of exercises for a course"));
        // Create parser error handling
        if (!parser) {
            throw new Error("Failed to create parser");
        }
        // Create formatInstructions
        const formatInstructions = parser.getFormatInstructions();
        // Create formatInstructions error handling
        if (!formatInstructions) {
            throw new Error("Failed to create formatInstructions");
        }
        // Create promptTemplate
        const promptTemplate = new PromptTemplate({
            template: `Generate a list of exercise tasks for a unit in a course. The unit is called "{title}", has the following description: "{description}", and covers the following topics: {topics}. Output the response with the following format: {format_instructions}. Only include the list.`,
            inputVariables: ["title", "description", "topics"],
            partialVariables: { format_instructions: formatInstructions },
        });
        // Create promptTemplate error handling
        if (!promptTemplate) {
            throw new Error("Failed to create promptTemplate");
        }
        // Create prompt
        const prompt = yield promptTemplate.format({ title, description, topics });
        // Create prompt error handling
        if (!prompt) {
            throw new Error("Failed to create prompt");
        }
        // Query openai
        const result = yield model.call(prompt);
        // Query openai error handling
        if (!result) {
            throw new Error("Failed to call openai");
        }
        // Parse result
        const parsedResult = yield parser.parse(result);
        // Parse result error handling
        if (!parsedResult) {
            throw new Error("Failed to parse result");
        }
        // Create course prereqs
        const exerciseIds = [];
        const exercises = yield prisma.unitExercise.createMany({
            data: parsedResult.map((e) => {
                const exerciseId = crypto.randomUUID();
                exerciseIds.push(exerciseId);
                return {
                    id: exerciseId,
                    unitId: unitId,
                    task: e.task,
                };
            }),
        });
        // Create course prereqs error handling
        if (!exercises) {
            throw new Error("Failed to create course prereqs");
        }
        // Update course with units
        const updatedUnit = yield prisma.courseUnit.update({
            where: {
                id: unitId,
            },
            data: {
                exercises: {
                    connect: exerciseIds.map((id) => ({ id })),
                },
            },
            include: {
                exercises: true,
            },
        });
        return updatedUnit.exercises; // Return course
    }),
    // Generate Quiz
    generateQuiz: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        // Grab prisma client error handling
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { id } = args;
        // Grab args error handling
        if (!id) {
            throw new Error("Missing required fields.");
        }
        // Grab unit
        const unit = yield prisma.courseUnit.findUnique({
            where: {
                id,
            },
            include: {
                lessons: true,
                quizzes: true,
            },
        });
        // Grab unit error handling
        if (!unit) {
            throw new Error("Failed to find unit.");
        }
        // Destructure unit
        const { title, description, lessons } = unit;
        // Destructure unit error handling
        if (!title || !description || !lessons) {
            throw new Error("Unit is missing required fields.");
        }
        // Grab topics
        const topics = lessons
            .map((lesson) => lesson.topics)
            .join(" ");
        // Grab topics error handling
        if (!topics) {
            throw new Error("Failed to find topics.");
        }
        // Create model
        const model = new OpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            temperature: 0,
            modelName: "gpt-3.5-turbo",
        });
        // Create model error handling
        if (!model) {
            throw new Error("Failed to create model");
        }
        // Create parser
        const parser = StructuredOutputParser.fromZodSchema(
        // z
        //   .object({
        //     questions: z
        //       .array(
        //         z.object({
        //           question: z.string().describe("A question for a quiz"),
        //           choices: z
        //             .array(z.string())
        //             .describe("A list of choices for a question"),
        //           answer: z.string().describe("The answer to the question"),
        //         })
        //       )
        //       .describe("A list of quiz questions for a course unit"),
        //   })
        //   .describe("A list of quiz questions for a course unit")
        zod_1.z.object({
            questions: zod_1.z.array(zod_1.z.object({
                question: zod_1.z.string(),
                choices: zod_1.z.array(zod_1.z.string()),
                answer: zod_1.z.string(),
            })),
        }));
        // Create parser error handling
        if (!parser) {
            throw new Error("Failed to create parser");
        }
        // Create formatInstructions
        const formatInstructions = parser.getFormatInstructions();
        // Create formatInstructions error handling
        if (!formatInstructions) {
            throw new Error("Failed to create formatInstructions");
        }
        // Create promptTemplate
        const promptTemplate = new PromptTemplate({
            template: `Generate a multiple choice quiz for a unit in a course in JSON format. The unit is called "{title}", has the following description: "{description}", and covers the following topics: {topics}. {format_instructions}.`,
            inputVariables: ["title", "description", "topics"],
            partialVariables: { format_instructions: formatInstructions },
        });
        // Create promptTemplate error handling
        if (!promptTemplate) {
            throw new Error("Failed to create promptTemplate");
        }
        // Create prompt
        const prompt = yield promptTemplate.format({ title, description, topics });
        // Create prompt error handling
        if (!prompt) {
            throw new Error("Failed to create prompt");
        }
        // Query openai
        const result = yield model.call(prompt);
        // Query openai error handling
        if (!result) {
            throw new Error("Failed to call openai");
        }
        // Parse result
        const parsedResult = yield parser.parse(result);
        // Parse result error handling
        if (!parsedResult) {
            throw new Error("Failed to parse result");
        }
        const quizId = crypto.randomUUID();
        const quiz = yield prisma.unitQuiz.create({
            data: {
                id: quizId,
                unitId: unit.id,
            },
        });
        // Create quiz error handling
        if (!quiz) {
            throw new Error("Failed to create unit quiz");
        }
        const questionIds = [];
        const quesitons = yield prisma.quizQuestion.createMany({
            data: parsedResult.questions.map((q) => {
                const questionId = crypto.randomUUID();
                questionIds.push(questionId);
                return {
                    id: questionId,
                    quizId: quizId,
                    question: q.question,
                    choices: q.choices,
                    answer: q.answer,
                };
            }),
        });
        // Create quiz questions error handling
        if (!quesitons) {
            throw new Error("Failed to create unit quiz");
        }
        const updatedQuiz = yield prisma.unitQuiz.update({
            where: {
                id: quizId,
            },
            data: {
                questions: {
                    connect: questionIds.map((id) => ({ id })),
                },
            },
        });
        // Update course with units
        const updatedUnit = yield prisma.courseUnit.update({
            where: {
                id,
            },
            data: {
                quizzes: {
                    connect: { id: quizId },
                },
            },
            include: {
                quizzes: {
                    include: {
                        questions: true,
                    },
                },
            },
        });
        return updatedUnit.quizzes.find((quiz) => quiz.id === quizId); // Return course
    }),
    // Create Quiz Attempt
    createQuizAttempt: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        // Grab prisma client error handling
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { quizId, courseProgressId, attempt, response, questionId } = args.input;
        // Grab args error handling
        if (!quizId || !courseProgressId || !attempt || !response || !questionId) {
            throw new Error("Missing required fields.");
        }
        let quizAttempt;
        // Grab quizAttempt
        quizAttempt = yield prisma.quizAttempt.findUnique({
            where: {
                quizId_courseProgressId_attempt: {
                    quizId,
                    courseProgressId,
                    attempt,
                },
            },
        });
        // Grab quizAttempt error handling
        if (quizAttempt) {
            return quizAttempt;
        }
        // Create quiz attempt
        quizAttempt = prisma.quizAttempt.create({
            data: {
                quizId,
                courseProgressId,
                attempt,
                responses: {
                    create: [
                        {
                            id: crypto.randomUUID(),
                            questionId,
                            response,
                        },
                    ],
                },
                status: resolvers_types_1.Status.Pending,
            },
        });
        // Create quiz attempt error handling
        if (!quizAttempt) {
            throw new Error("Failed to create quiz attempt.");
        }
        return quizAttempt;
    }),
    // Update Quiz Attempt
    updateQuizAttempt: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        // Grab prisma client error handling
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { id } = args;
        // Grab args error handling
        if (!id) {
            throw new Error("Missing required fields.");
        }
        // Grab args
        const { questionId, status, response } = args.input;
        // Grab args error handling
        if (!questionId) {
            throw new Error("Missing required fields.");
        }
        // Create quiz attempt
        const quizAttempt = yield prisma.quizAttempt.findUnique({
            where: { id },
            include: {
                responses: true,
                quiz: {
                    include: {
                        questions: true,
                    },
                },
            },
        });
        // Create quiz attempt error handling
        if (!quizAttempt) {
            throw new Error("Failed to find quiz attempt.");
        }
        let questionResponse;
        const existingResponse = quizAttempt.responses.find((response) => response.questionId === questionId);
        if (existingResponse) {
            questionResponse = yield prisma.quizResponse.update({
                where: {
                    id: existingResponse.id,
                },
                data: {
                    response: response || undefined,
                },
            });
        }
        else {
            // Create question response
            questionResponse = yield prisma.quizResponse.create({
                data: {
                    id: crypto.randomUUID(),
                    questionId,
                    response: response,
                    quizAttemptId: quizAttempt.id,
                },
            });
        }
        // Create quiz response error handling
        if (!questionResponse) {
            throw new Error("Failed to create quiz response.");
        }
        // Update quiz attempt
        let updatedQuizAttempt;
        if (existingResponse) {
            updatedQuizAttempt = yield prisma.quizAttempt.update({
                where: { id },
                data: {
                    status: status || resolvers_types_1.Status.InProgress,
                },
                include: {
                    responses: true,
                    quiz: {
                        include: {
                            questions: true,
                        },
                    },
                },
            });
        }
        else {
            updatedQuizAttempt = prisma.quizAttempt.update({
                where: { id },
                data: {
                    status: status || resolvers_types_1.Status.InProgress,
                    responses: {
                        connect: {
                            id: questionResponse.id,
                        },
                    },
                },
                include: {
                    responses: true,
                    quiz: {
                        include: {
                            questions: true,
                        },
                    },
                },
            });
        }
        // Update quiz attempt error handling
        if (!updatedQuizAttempt) {
            throw new Error("Failed to update quiz attempt.");
        }
        return updatedQuizAttempt;
    }),
    // Update Quiz Attempt Status
    updateQuizAttemptStatus: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        // Grab prisma client error handling
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { id, status } = args;
        // Grab args error handling
        if (!id || !status) {
            throw new Error("Missing required fields.");
        }
        // Grab quiz attempt
        const quizAttempt = yield prisma.quizAttempt.findUnique({
            where: { id },
        });
        // Grab quiz attempt error handling
        if (!quizAttempt) {
            throw new Error("Failed to find quiz attempt.");
        }
        // Update quiz attempt status
        const updatedQuizAttempt = yield prisma.quizAttempt.update({
            where: { id },
            data: {
                status,
            },
        });
        // Update quiz attempt error handling
        if (!updatedQuizAttempt) {
            throw new Error("Failed to update quiz attempt.");
        }
        return updatedQuizAttempt;
    }),
    // // Update Quiz Attempt
    // updateQuizAttempt: async (
    //   _parent: any,
    //   args: { id: string; input: UpdateQuizAttemptInput },
    //   contextValue: Context
    // ) => {
    //   // Grab prisma client
    //   const { prisma } = contextValue;
    //   // Grab prisma client error handling
    //   if (!prisma) {
    //     throw new Error("Failed to find prisma client.");
    //   }
    //   // Grab userId
    //   const { id } = args;
    //   // Grab userId error handling
    //   if (!id) {
    //     throw new Error("Missing required fields.");
    //   }
    //   // Grab args
    //   const { attempt, response, status } = args.input;
    //   // Check if quiz attempt exists
    //   const quizAttempt = await prisma.quizAttempt.findUnique({})
    //   const userDetails = await prisma.userDetails.update({
    //     where: {
    //       userId,
    //     },
    //     data: {
    //       userId,
    //       firstName: firstName,
    //       lastName: lastName,
    //       nickname: nickname,
    //       dob: dob,
    //       pronouns: pronouns ? (pronouns as string[]) : undefined,
    //       educationLevel: educationLevel,
    //       occupation: occupation,
    //       interests: interests ? (interests as string[]) : undefined,
    //       learningStyle: learningStyle,
    //     },
    //   });
    //   if (!userDetails) {
    //     throw new Error("Failed to update user details.");
    //   }
    //   return userDetails;
    // },
    // Generate lesson mutation resolver
    generateLesson: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        // Grab prisma client error handling
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { courseTitle, courseDescription, lessonId, lessonTitle, topics } = args.input;
        // Grab args error handling
        if (!courseTitle ||
            !courseDescription ||
            !lessonId ||
            !lessonTitle ||
            !topics) {
            throw new Error("Missing required fields.");
        }
        // Create model
        const model = new OpenAI({
            openAIApiKey: process.env.OPENAI_API_KEY,
            temperature: 0,
            modelName: "gpt-3.5-turbo",
        });
        // Create model error handling
        if (!model) {
            throw new Error("Failed to create model");
        }
        // Create promptTemplate
        const promptTemplate = new PromptTemplate({
            template: `Generate a lesson for a course on "{courseTitle}". The title of the lesson is "{lessonTitle}", and it should cover the following topics: "{topics}". The output should be in markdown format.`,
            inputVariables: ["courseTitle", "lessonTitle", "topics"],
        });
        // Create promptTemplate error handling
        if (!promptTemplate) {
            throw new Error("Failed to create promptTemplate");
        }
        // Create prompt
        const prompt = yield promptTemplate.format({
            courseTitle,
            courseDescription,
            lessonTitle,
            topics,
        });
        // Create prompt error handling
        if (!prompt) {
            throw new Error("Failed to create prompt");
        }
        // Query openai
        const result = yield model.call(prompt);
        // Query openai error handling
        if (!result) {
            throw new Error("Failed to call openai");
        }
        // Update lesson with content
        const lesson = yield prisma.unitLesson.update({
            where: {
                id: lessonId,
            },
            data: {
                content: result,
            },
        });
        // Update lesson with content error handling
        if (!lesson) {
            throw new Error("Failed to update lesson with content");
        }
        console.log("lesson: ", lesson);
        return lesson;
    }),
    // Update Current Lesson Id
    updateCurrentLessonId: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        // Grab prisma client error handling
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { userId, courseId, lessonId } = args.input;
        // Grab args error handling
        if (!userId || !courseId || !lessonId) {
            throw new Error("Missing required fields.");
        }
        const enrollment = yield prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
        });
        // Create enrollment error handling
        if (!enrollment) {
            throw new Error("Failed to find enrollment");
        }
        // Update course progress
        const progress = yield prisma.courseProgress.update({
            where: {
                enrollmentId: enrollment.id,
            },
            data: {
                currentLessonId: lessonId,
            },
        });
        // Update course progress error handling
        if (!progress) {
            throw new Error("Failed to update course progress");
        }
        return progress;
    }),
    // Update Completed Lessons
    updateCompletedLessons: (_parent, args, contextValue) => __awaiter(void 0, void 0, void 0, function* () {
        // Grab prisma client
        const { prisma } = contextValue;
        // Grab prisma client error handling
        if (!prisma) {
            throw new Error("Failed to find prisma client.");
        }
        // Grab args
        const { userId, courseId, lessonId } = args.input;
        // Grab args error handling
        if (!userId || !courseId || !lessonId) {
            throw new Error("Missing required fields.");
        }
        const enrollment = yield prisma.enrollment.findUnique({
            where: {
                userId_courseId: {
                    userId,
                    courseId,
                },
            },
            include: {
                progress: true,
            },
        });
        // Create enrollment error handling
        if (!enrollment) {
            throw new Error("Failed to find enrollment");
        }
        let progress = enrollment.progress;
        if (enrollment.progress.lessonsCompleted.find((id) => id === lessonId)) {
            progress = yield prisma.courseProgress.update({
                where: {
                    enrollmentId: enrollment.id,
                },
                data: {
                    lessonsCompleted: progress.lessonsCompleted.filter((id) => id !== lessonId),
                },
            });
        }
        else {
            // Update course progress
            progress = yield prisma.courseProgress.update({
                where: {
                    enrollmentId: enrollment.id,
                },
                data: {
                    lessonsCompleted: [
                        ...enrollment.progress.lessonsCompleted,
                        lessonId,
                    ],
                },
            });
        }
        // Update course progress error handling
        if (!progress) {
            throw new Error("Failed to update course progress");
        }
        return progress;
    }),
};
