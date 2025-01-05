import mongoose, { Schema, Document } from "mongoose";

// Define the interface for a Question
interface IQuestion {
    question: string;
    options: string[]; // Array of two options
    correct_answer: string; // The correct answer
}

// Define the interface for the Quiz
export interface IQuiz extends Document {
    courseId: Schema.Types.ObjectId;
    questions: IQuestion[]; // Array of questions
}

// Define the Question Schema
const QuestionSchema = new Schema<IQuestion>({
    question: { type: String, required: true },
    options: { 
        type: [String], 
        required: true, 
        validate: {
            validator: (options: string[]) => options.length === 2, // Specify the type of options
            message: 'There must be exactly two options.'
        }
    },
    correct_answer: { type: String, required: true },
});

// Define the Quiz Schema
const QuizSchema = new Schema<IQuiz>({
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true }, // Ensure each course has a unique quiz
    questions: { type: [QuestionSchema], default: [] }, // Array of questions
});

// Create the Mongoose model
const QuizModel = mongoose.model<IQuiz>("Quiz", QuizSchema);

export default QuizModel;