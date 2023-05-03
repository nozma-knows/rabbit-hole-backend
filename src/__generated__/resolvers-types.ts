import { GraphQLResolveInfo } from 'graphql';
import { Context } from '../graph/resolvers/types';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Course = {
  __typename?: 'Course';
  authorId: Scalars['String'];
  createdAt: Scalars['String'];
  description: Scalars['String'];
  enrollments: Array<Maybe<CourseEnrollment>>;
  id: Scalars['ID'];
  prereqs: Array<Maybe<CoursePrereq>>;
  public: Scalars['Boolean'];
  title: Scalars['String'];
  units: Array<Maybe<CourseUnit>>;
  updatedAt: Scalars['String'];
};

export type CourseEnrollment = {
  __typename?: 'CourseEnrollment';
  course: Course;
  courseId: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  progress?: Maybe<CourseProgress>;
  updatedAt: Scalars['String'];
  userId: Scalars['String'];
};

export type CoursePrereq = {
  __typename?: 'CoursePrereq';
  course: Course;
  courseId: Scalars['String'];
  createdAt: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['ID'];
  title: Scalars['String'];
  topics: Array<Maybe<PrereqTopic>>;
  updatedAt: Scalars['String'];
};

export type CourseProgress = {
  __typename?: 'CourseProgress';
  createdAt: Scalars['String'];
  currentLessonId: Scalars['String'];
  enrollment: CourseEnrollment;
  enrollmentId: Scalars['String'];
  exercisesCompleted: Array<Maybe<Scalars['String']>>;
  id: Scalars['ID'];
  lessonsCompleted: Array<Maybe<Scalars['String']>>;
  quizzesCompleted: Array<Maybe<Scalars['String']>>;
  status: Status;
  updatedAt: Scalars['String'];
};

export type CourseUnit = {
  __typename?: 'CourseUnit';
  course: Course;
  courseId: Scalars['String'];
  createdAt: Scalars['String'];
  description: Scalars['String'];
  exercises?: Maybe<Array<Maybe<UnitExercise>>>;
  id: Scalars['ID'];
  lessons: Array<Maybe<UnitLesson>>;
  quizzes: Array<Maybe<UnitQuiz>>;
  title: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type CreateCourseInput = {
  authorId: Scalars['ID'];
  description: Scalars['String'];
  title: Scalars['String'];
};

export type GenerateLessonInput = {
  courseDescription: Scalars['String'];
  courseTitle: Scalars['String'];
  lessonId: Scalars['String'];
  lessonTitle: Scalars['String'];
  pastTopics: Scalars['String'];
  topics: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createCourse: Course;
  deleteCourse: Course;
  generateExercises: Array<Maybe<UnitExercise>>;
  generateLesson: UnitLesson;
  generatePrereqs: Course;
  generateQuiz: UnitQuiz;
  generateUnits: Course;
  toggleCourseEnrollment: CourseEnrollment;
};


export type MutationCreateCourseArgs = {
  input: CreateCourseInput;
};


export type MutationDeleteCourseArgs = {
  id: Scalars['String'];
};


export type MutationGenerateExercisesArgs = {
  id: Scalars['String'];
};


export type MutationGenerateLessonArgs = {
  input: GenerateLessonInput;
};


export type MutationGeneratePrereqsArgs = {
  id: Scalars['String'];
};


export type MutationGenerateQuizArgs = {
  id: Scalars['String'];
};


export type MutationGenerateUnitsArgs = {
  id: Scalars['String'];
};


export type MutationToggleCourseEnrollmentArgs = {
  courseId: Scalars['String'];
  userId: Scalars['String'];
};

export type PrereqTopic = {
  __typename?: 'PrereqTopic';
  createdAt: Scalars['String'];
  description: Scalars['String'];
  id: Scalars['ID'];
  prereq: CoursePrereq;
  prereqId: Scalars['String'];
  title: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  allCourses?: Maybe<Array<Maybe<Course>>>;
  course?: Maybe<Course>;
  courses: Array<Maybe<Course>>;
  enrolledIn: Array<Maybe<CourseEnrollment>>;
};


export type QueryCourseArgs = {
  id: Scalars['String'];
};


export type QueryCoursesArgs = {
  authorId: Scalars['String'];
};


export type QueryEnrolledInArgs = {
  userId: Scalars['String'];
};

export type QuizQuestion = {
  __typename?: 'QuizQuestion';
  answer: Scalars['String'];
  choices: Array<Maybe<Scalars['String']>>;
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  question: Scalars['String'];
  unit: CourseUnit;
  unitId: Scalars['String'];
  updatedAt: Scalars['String'];
};

export enum Status {
  Completed = 'COMPLETED',
  InProgress = 'IN_PROGRESS',
  Pending = 'PENDING'
}

export type UnitExercise = {
  __typename?: 'UnitExercise';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  task: Scalars['String'];
  unit: CourseUnit;
  unitId: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UnitLesson = {
  __typename?: 'UnitLesson';
  content: Scalars['String'];
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  title: Scalars['String'];
  topics: Scalars['String'];
  unit: CourseUnit;
  unitId: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type UnitQuiz = {
  __typename?: 'UnitQuiz';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  questions: Array<Maybe<QuizQuestion>>;
  unit: CourseUnit;
  unitId: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Course: ResolverTypeWrapper<Course>;
  CourseEnrollment: ResolverTypeWrapper<CourseEnrollment>;
  CoursePrereq: ResolverTypeWrapper<CoursePrereq>;
  CourseProgress: ResolverTypeWrapper<CourseProgress>;
  CourseUnit: ResolverTypeWrapper<CourseUnit>;
  CreateCourseInput: CreateCourseInput;
  GenerateLessonInput: GenerateLessonInput;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Mutation: ResolverTypeWrapper<{}>;
  PrereqTopic: ResolverTypeWrapper<PrereqTopic>;
  Query: ResolverTypeWrapper<{}>;
  QuizQuestion: ResolverTypeWrapper<QuizQuestion>;
  Status: Status;
  String: ResolverTypeWrapper<Scalars['String']>;
  UnitExercise: ResolverTypeWrapper<UnitExercise>;
  UnitLesson: ResolverTypeWrapper<UnitLesson>;
  UnitQuiz: ResolverTypeWrapper<UnitQuiz>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean'];
  Course: Course;
  CourseEnrollment: CourseEnrollment;
  CoursePrereq: CoursePrereq;
  CourseProgress: CourseProgress;
  CourseUnit: CourseUnit;
  CreateCourseInput: CreateCourseInput;
  GenerateLessonInput: GenerateLessonInput;
  ID: Scalars['ID'];
  Mutation: {};
  PrereqTopic: PrereqTopic;
  Query: {};
  QuizQuestion: QuizQuestion;
  String: Scalars['String'];
  UnitExercise: UnitExercise;
  UnitLesson: UnitLesson;
  UnitQuiz: UnitQuiz;
}>;

export type CourseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Course'] = ResolversParentTypes['Course']> = ResolversObject<{
  authorId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enrollments?: Resolver<Array<Maybe<ResolversTypes['CourseEnrollment']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  prereqs?: Resolver<Array<Maybe<ResolversTypes['CoursePrereq']>>, ParentType, ContextType>;
  public?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  units?: Resolver<Array<Maybe<ResolversTypes['CourseUnit']>>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CourseEnrollmentResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CourseEnrollment'] = ResolversParentTypes['CourseEnrollment']> = ResolversObject<{
  course?: Resolver<ResolversTypes['Course'], ParentType, ContextType>;
  courseId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  progress?: Resolver<Maybe<ResolversTypes['CourseProgress']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CoursePrereqResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CoursePrereq'] = ResolversParentTypes['CoursePrereq']> = ResolversObject<{
  course?: Resolver<ResolversTypes['Course'], ParentType, ContextType>;
  courseId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  topics?: Resolver<Array<Maybe<ResolversTypes['PrereqTopic']>>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CourseProgressResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CourseProgress'] = ResolversParentTypes['CourseProgress']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  currentLessonId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  enrollment?: Resolver<ResolversTypes['CourseEnrollment'], ParentType, ContextType>;
  enrollmentId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  exercisesCompleted?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lessonsCompleted?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  quizzesCompleted?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['Status'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type CourseUnitResolvers<ContextType = Context, ParentType extends ResolversParentTypes['CourseUnit'] = ResolversParentTypes['CourseUnit']> = ResolversObject<{
  course?: Resolver<ResolversTypes['Course'], ParentType, ContextType>;
  courseId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  exercises?: Resolver<Maybe<Array<Maybe<ResolversTypes['UnitExercise']>>>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lessons?: Resolver<Array<Maybe<ResolversTypes['UnitLesson']>>, ParentType, ContextType>;
  quizzes?: Resolver<Array<Maybe<ResolversTypes['UnitQuiz']>>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MutationResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = ResolversObject<{
  createCourse?: Resolver<ResolversTypes['Course'], ParentType, ContextType, RequireFields<MutationCreateCourseArgs, 'input'>>;
  deleteCourse?: Resolver<ResolversTypes['Course'], ParentType, ContextType, RequireFields<MutationDeleteCourseArgs, 'id'>>;
  generateExercises?: Resolver<Array<Maybe<ResolversTypes['UnitExercise']>>, ParentType, ContextType, RequireFields<MutationGenerateExercisesArgs, 'id'>>;
  generateLesson?: Resolver<ResolversTypes['UnitLesson'], ParentType, ContextType, RequireFields<MutationGenerateLessonArgs, 'input'>>;
  generatePrereqs?: Resolver<ResolversTypes['Course'], ParentType, ContextType, RequireFields<MutationGeneratePrereqsArgs, 'id'>>;
  generateQuiz?: Resolver<ResolversTypes['UnitQuiz'], ParentType, ContextType, RequireFields<MutationGenerateQuizArgs, 'id'>>;
  generateUnits?: Resolver<ResolversTypes['Course'], ParentType, ContextType, RequireFields<MutationGenerateUnitsArgs, 'id'>>;
  toggleCourseEnrollment?: Resolver<ResolversTypes['CourseEnrollment'], ParentType, ContextType, RequireFields<MutationToggleCourseEnrollmentArgs, 'courseId' | 'userId'>>;
}>;

export type PrereqTopicResolvers<ContextType = Context, ParentType extends ResolversParentTypes['PrereqTopic'] = ResolversParentTypes['PrereqTopic']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  prereq?: Resolver<ResolversTypes['CoursePrereq'], ParentType, ContextType>;
  prereqId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = Context, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  allCourses?: Resolver<Maybe<Array<Maybe<ResolversTypes['Course']>>>, ParentType, ContextType>;
  course?: Resolver<Maybe<ResolversTypes['Course']>, ParentType, ContextType, RequireFields<QueryCourseArgs, 'id'>>;
  courses?: Resolver<Array<Maybe<ResolversTypes['Course']>>, ParentType, ContextType, RequireFields<QueryCoursesArgs, 'authorId'>>;
  enrolledIn?: Resolver<Array<Maybe<ResolversTypes['CourseEnrollment']>>, ParentType, ContextType, RequireFields<QueryEnrolledInArgs, 'userId'>>;
}>;

export type QuizQuestionResolvers<ContextType = Context, ParentType extends ResolversParentTypes['QuizQuestion'] = ResolversParentTypes['QuizQuestion']> = ResolversObject<{
  answer?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  choices?: Resolver<Array<Maybe<ResolversTypes['String']>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  question?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['CourseUnit'], ParentType, ContextType>;
  unitId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UnitExerciseResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UnitExercise'] = ResolversParentTypes['UnitExercise']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  task?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['CourseUnit'], ParentType, ContextType>;
  unitId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UnitLessonResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UnitLesson'] = ResolversParentTypes['UnitLesson']> = ResolversObject<{
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  topics?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['CourseUnit'], ParentType, ContextType>;
  unitId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type UnitQuizResolvers<ContextType = Context, ParentType extends ResolversParentTypes['UnitQuiz'] = ResolversParentTypes['UnitQuiz']> = ResolversObject<{
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  questions?: Resolver<Array<Maybe<ResolversTypes['QuizQuestion']>>, ParentType, ContextType>;
  unit?: Resolver<ResolversTypes['CourseUnit'], ParentType, ContextType>;
  unitId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = Context> = ResolversObject<{
  Course?: CourseResolvers<ContextType>;
  CourseEnrollment?: CourseEnrollmentResolvers<ContextType>;
  CoursePrereq?: CoursePrereqResolvers<ContextType>;
  CourseProgress?: CourseProgressResolvers<ContextType>;
  CourseUnit?: CourseUnitResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  PrereqTopic?: PrereqTopicResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  QuizQuestion?: QuizQuestionResolvers<ContextType>;
  UnitExercise?: UnitExerciseResolvers<ContextType>;
  UnitLesson?: UnitLessonResolvers<ContextType>;
  UnitQuiz?: UnitQuizResolvers<ContextType>;
}>;
