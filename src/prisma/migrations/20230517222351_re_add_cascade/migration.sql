-- DropForeignKey
ALTER TABLE "CoursePrereq" DROP CONSTRAINT "CoursePrereq_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseProgress" DROP CONSTRAINT "CourseProgress_enrollmentId_fkey";

-- DropForeignKey
ALTER TABLE "CourseUnit" DROP CONSTRAINT "CourseUnit_courseId_fkey";

-- DropForeignKey
ALTER TABLE "Enrollment" DROP CONSTRAINT "Enrollment_courseId_fkey";

-- DropForeignKey
ALTER TABLE "PrereqTopic" DROP CONSTRAINT "PrereqTopic_prereqId_fkey";

-- DropForeignKey
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_courseProgressId_fkey";

-- DropForeignKey
ALTER TABLE "QuizAttempt" DROP CONSTRAINT "QuizAttempt_quizId_fkey";

-- DropForeignKey
ALTER TABLE "QuizQuestion" DROP CONSTRAINT "QuizQuestion_quizId_fkey";

-- DropForeignKey
ALTER TABLE "QuizResponse" DROP CONSTRAINT "QuizResponse_questionId_fkey";

-- DropForeignKey
ALTER TABLE "QuizResponse" DROP CONSTRAINT "QuizResponse_quizAttemptId_fkey";

-- DropForeignKey
ALTER TABLE "UnitExercise" DROP CONSTRAINT "UnitExercise_unitId_fkey";

-- DropForeignKey
ALTER TABLE "UnitLesson" DROP CONSTRAINT "UnitLesson_unitId_fkey";

-- DropForeignKey
ALTER TABLE "UnitQuiz" DROP CONSTRAINT "UnitQuiz_unitId_fkey";

-- AddForeignKey
ALTER TABLE "PrereqTopic" ADD CONSTRAINT "PrereqTopic_prereqId_fkey" FOREIGN KEY ("prereqId") REFERENCES "CoursePrereq"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoursePrereq" ADD CONSTRAINT "CoursePrereq_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitLesson" ADD CONSTRAINT "UnitLesson_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "CourseUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitExercise" ADD CONSTRAINT "UnitExercise_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "CourseUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "UnitQuiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitQuiz" ADD CONSTRAINT "UnitQuiz_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "CourseUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseUnit" ADD CONSTRAINT "CourseUnit_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResponse" ADD CONSTRAINT "QuizResponse_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizResponse" ADD CONSTRAINT "QuizResponse_quizAttemptId_fkey" FOREIGN KEY ("quizAttemptId") REFERENCES "QuizAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "UnitQuiz"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_courseProgressId_fkey" FOREIGN KEY ("courseProgressId") REFERENCES "CourseProgress"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseProgress" ADD CONSTRAINT "CourseProgress_enrollmentId_fkey" FOREIGN KEY ("enrollmentId") REFERENCES "Enrollment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;
