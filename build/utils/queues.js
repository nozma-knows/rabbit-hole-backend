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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unitsQueue = exports.prereqsQueue = void 0;
const bull_1 = __importDefault(require("bull"));
const index_1 = require("../index");
const models_1 = require("./openai/models");
const { PromptTemplate } = require("langchain");
exports.prereqsQueue = new bull_1.default("prereqs");
exports.unitsQueue = new bull_1.default("units");
// Process for generating prereqs for all jobs in prereqs queue
exports.prereqsQueue.process((job, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("In prereqsQueue process: ", job.id);
    // Grab prisma client error handling
    if (!index_1.prisma) {
        throw new Error("Failed to find prisma client - generatePrereqs");
    }
    // Grab courseId
    const { courseId } = job.data;
    // Grab courseId error handling
    if (!courseId) {
        throw new Error("Missing required fields.");
    }
    // Grab course
    const course = yield index_1.prisma.course.findUnique({
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
    const model = (0, models_1.chatGPT)();
    // Create model error handling
    if (!model) {
        throw new Error("Failed to create model");
    }
    // Create prompt template
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
    // Parse result
    const parsedResult = JSON.parse(result).prerequisites;
    // Parse result error handling
    if (!parsedResult) {
        throw new Error("Failed to parse result");
    }
    // Create course prereqs
    const prereqs = [];
    yield index_1.prisma.coursePrereq.createMany({
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
        yield index_1.prisma.prereqTopic.createMany({
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
        yield index_1.prisma.coursePrereq.update({
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
    const updatedCourse = yield index_1.prisma.course.update({
        where: {
            id: courseId,
        },
        data: {
            prereqs: { connect: prereqs.map((prereq) => ({ id: prereq.id })) },
        },
    });
    // Update course error handling
    if (!updatedCourse) {
        throw new Error("Failed to update course");
    }
    done(null, { course: updatedCourse });
}));
// Called when job in prereqs queue is completed
exports.prereqsQueue.on("completed", (job, result) => {
    console.log(`Prereq job ${job.id} completed with result ${result}`);
});
// Process for generating units for all jobs in units queue
exports.unitsQueue.process((job, done) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("In unitsQueue process: ", job.id);
    // Grab prisma client error handling
    if (!index_1.prisma) {
        throw new Error("Failed to find prisma client.");
    }
    // Grab args
    const { courseId } = job.data;
    // Grab args error handling
    if (!courseId) {
        throw new Error("Missing required fields.");
    }
    // Grab course
    const course = yield index_1.prisma.course.findUnique({
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
    const model = (0, models_1.chatGPT)();
    // Create model error handling
    if (!model) {
        throw new Error("Failed to create model");
    }
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
    // Parse result error handling
    if (!parsedResult) {
        throw new Error("Failed to parse result");
    }
    // Create course prereqs
    const units = [];
    yield index_1.prisma.courseUnit.createMany({
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
        yield index_1.prisma.unitLesson.createMany({
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
        yield index_1.prisma.courseUnit.update({
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
    const updatedCourse = yield index_1.prisma.course.update({
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
    done(null, { course: updatedCourse });
}));
// Called when job in prereqs queue is completed
exports.unitsQueue.on("completed", (job, result) => {
    console.log(`Units job ${job.id} completed with result ${result}`);
});
