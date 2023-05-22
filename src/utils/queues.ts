import Queue from "bull";
import { prisma } from "../index";
import { chatGPT } from "./openai/models";
import {
  CoursePrereq,
  CourseUnit,
  Maybe,
  PrereqTopic,
  UnitLesson,
} from "../__generated__/resolvers-types";
const { PromptTemplate } = require("langchain");
export const prereqsQueue = new Queue("prereqs"); // Specify Redis connection using object

export const unitsQueue = new Queue("units");

// Process for generating prereqs for all jobs in prereqs queue
prereqsQueue.process(async (job, done) => {
  console.log("In prereqsQueue process: ", job.id);
  // Grab prisma client error handling
  if (!prisma) {
    throw new Error("Failed to find prisma client - generatePrereqs");
  }

  // Grab courseId
  const { courseId } = job.data;

  // Grab courseId error handling
  if (!courseId) {
    throw new Error("Missing required fields.");
  }

  // Grab course
  const course = await prisma.course.findUnique({
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
  const model = chatGPT();

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
  const prompt = await promptTemplate.format({ title, description });

  // Create prompt error handling
  if (!prompt) {
    throw new Error("Failed to create prompt");
  }

  // Query openai
  const result = await model.call(prompt);

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
  const prereqs: any[] = [];
  await prisma.coursePrereq.createMany({
    data: parsedResult.map((p: CoursePrereq) => {
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
  prereqs.map(async (prereq: CoursePrereq) => {
    const topicIds: string[] = [];
    await prisma.prereqTopic.createMany({
      data: prereq.topics.map((topic: Maybe<PrereqTopic>) => {
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
    await prisma.coursePrereq.update({
      where: {
        id: prereq.id,
      },
      data: {
        topics: {
          connect: topicIds.map((id: string) => ({ id })),
        },
      },
    });
  });

  // Update course with prereqs and units
  const updatedCourse = await prisma.course.update({
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
});

// Called when job in prereqs queue is completed
prereqsQueue.on("completed", (job, result) => {
  console.log(`Prereq job ${job.id} completed with result ${result}`);
});

// Process for generating units for all jobs in units queue
unitsQueue.process(async (job, done) => {
  console.log("In unitsQueue process: ", job.id);
  // Grab prisma client error handling
  if (!prisma) {
    throw new Error("Failed to find prisma client.");
  }

  // Grab args
  const { courseId } = job.data;

  // Grab args error handling
  if (!courseId) {
    throw new Error("Missing required fields.");
  }

  // Grab course
  const course = await prisma.course.findUnique({
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
  const model = chatGPT();

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
  const prompt = await promptTemplate.format({ title, description });

  // Create prompt error handling
  if (!prompt) {
    throw new Error("Failed to create prompt");
  }

  // Query openai
  const result = await model.call(prompt);

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
  const units: any[] = [];
  await prisma.courseUnit.createMany({
    data: parsedResult.map((u: CourseUnit, index: number) => {
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
  units.map(async (unit: CourseUnit) => {
    const lessonIds: string[] = [];
    await prisma.unitLesson.createMany({
      data: unit.lessons.map((lesson: Maybe<UnitLesson>, index: number) => {
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
    await prisma.courseUnit.update({
      where: {
        id: unit.id,
      },
      data: {
        lessons: {
          connect: lessonIds.map((id: string) => ({ id })),
        },
      },
    });
  });

  // Update course with units
  const updatedCourse = await prisma.course.update({
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
});

// Called when job in prereqs queue is completed
unitsQueue.on("completed", (job, result) => {
  console.log(`Units job ${job.id} completed with result ${result}`);
});
