/*
  Warnings:

  - A unique constraint covering the columns `[quizId,courseProgressId,attempt]` on the table `QuizAttempt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "QuizAttempt_quizId_courseProgressId_attempt_key" ON "QuizAttempt"("quizId", "courseProgressId", "attempt");
