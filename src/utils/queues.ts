import Queue from "bull";

export const generatePrereqsQueue = new Queue("generate lessons");
export const generateUnitsQueue = new Queue("generate units");
