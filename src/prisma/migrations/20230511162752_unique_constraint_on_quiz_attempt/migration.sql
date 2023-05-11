/*
  Warnings:

  - A unique constraint covering the columns `[attempt,quizId,courseProgressId]` on the table `QuizAttempt` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "QuizAttempt_attempt_quizId_courseProgressId_key" ON "QuizAttempt"("attempt", "quizId", "courseProgressId");
