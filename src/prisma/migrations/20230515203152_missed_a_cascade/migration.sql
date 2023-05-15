-- DropForeignKey
ALTER TABLE "PrereqTopic" DROP CONSTRAINT "PrereqTopic_prereqId_fkey";

-- AddForeignKey
ALTER TABLE "PrereqTopic" ADD CONSTRAINT "PrereqTopic_prereqId_fkey" FOREIGN KEY ("prereqId") REFERENCES "CoursePrereq"("id") ON DELETE CASCADE ON UPDATE CASCADE;
