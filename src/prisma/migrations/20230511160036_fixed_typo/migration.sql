/*
  Warnings:

  - You are about to drop the column `unitQuizId` on the `QuizAttempt` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_unitQuizId_fkey";

-- AlterTable
ALTER TABLE "QuizAttempt" DROP COLUMN "unitQuizId";

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "UnitQuiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
