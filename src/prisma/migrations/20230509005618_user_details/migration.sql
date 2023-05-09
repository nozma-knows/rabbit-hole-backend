-- CreateTable
CREATE TABLE "UserDetails" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "dob" TIMESTAMP(3) NOT NULL,
    "pronouns" TEXT[],
    "educationLevel" TEXT NOT NULL,
    "occupation" TEXT NOT NULL,
    "interests" TEXT[],
    "learningStyle" TEXT NOT NULL,

    CONSTRAINT "UserDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserDetails_userId_key" ON "UserDetails"("userId");
