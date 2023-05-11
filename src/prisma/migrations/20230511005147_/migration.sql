-- AlterTable
ALTER TABLE "CourseUnit" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "UnitLesson" ADD COLUMN     "order" INTEGER NOT NULL DEFAULT 0;
