import { ServerAddress, ServerProtocol } from "./address"
import path from "path"

const listQuestionsEndpoint = "questions"

export class TagOption {
    tagID: number
    optionText: string

    constructor(id: number, text: string) {
        this.tagID = id
        this.optionText = text
    }
}

export class Question {
    questionID: number
    orderingID: number
    requiresQuestion: number
    questionText: string
    mutuallyExclusive: boolean
    tagOptions: TagOption[]

    constructor(id: number, orderingID: number, requiresQuestion: number, questionText: string, mutuallyExclusive: boolean, tagOptions: TagOption[]) {
        this.questionID = id
        this.orderingID = orderingID
        this.requiresQuestion = requiresQuestion
        this.questionText = questionText
        this.mutuallyExclusive = mutuallyExclusive
        this.tagOptions = tagOptions
    }
}

export async function listQuestions(): Promise<Question[] | null> {
    const requestPath = ServerProtocol + path.join(ServerAddress, listQuestionsEndpoint)
    const response = await fetch(requestPath, {
        method: "GET"
    }).catch(err => {
        console.error(`Error: ${err}`);
        return null
    })

    if (response == null) {
        return null
    }

    if (!response.ok) {
        const responseText = await response.text()
        console.error(`${response.status} ${response.statusText}: ${responseText}`)
        return null
    }

    return await response.json().catch(err => {
        console.error(`Error decoding JSON: ${err}`)
        return null
    }).then(j => j as Question[])
}