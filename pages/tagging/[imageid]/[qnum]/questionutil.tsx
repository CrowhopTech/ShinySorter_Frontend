
import { Question } from '../../../../src/rest/questions';

// Input: list of all questions, current question ORDERING number
export function getQuestionInfo(questions: Question[], currentNum: number): { prevQuestion: Question | null, currentQuestion: Question | null, nextQuestion: Question | null, percentFinished: number } {
    questions?.sort((a, b) => {
        if (a.orderingID > b.orderingID) {
            return 1
        }
        if (a.orderingID < b.orderingID) {
            return -1
        }
        return 0
    })

    // Sort by ordering ID so we can do +/-1 to move around
    var currentQuestionIndex = questions.findIndex(q => q.orderingID >= currentNum)

    // If we hit this case, we're at the last question (no ordering IDs higher than our current one)
    // Return the appropriate result (previous=last question, all others null)
    if (currentQuestionIndex == -1) {
        return {
            prevQuestion: questions[questions.length - 1],
            currentQuestion: null,
            nextQuestion: null,
            percentFinished: 100.0,
        }
    }

    // Some other question than the last: calculate the previous and next
    var previousQuestion: Question | null = null
    var nextQuestion: Question | null = null
    
    if (currentQuestionIndex == 0) {
        previousQuestion = null
    } else {
        previousQuestion = questions[currentQuestionIndex - 1]
    }
    if (currentQuestionIndex >= questions.length - 1) {
        nextQuestion = null
    } else {
        nextQuestion = questions[currentQuestionIndex + 1]
    }

    return {
        prevQuestion: previousQuestion,
        currentQuestion: questions[currentQuestionIndex],
        nextQuestion: nextQuestion,
        percentFinished: (currentQuestionIndex / questions.length) * 100,
    }
}