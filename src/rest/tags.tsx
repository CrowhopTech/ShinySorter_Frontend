import { ServerAddress, ServerProtocol } from "./constants"
import path from "path"
import useSWR from "swr"

const fetcher = (input: RequestInfo, init?: RequestInit | undefined) => fetch(input, init).then(res => res.json())

const listTagsEndpoint = "tags"
const listTagsRequestPath = ServerProtocol + path.join(ServerAddress, listTagsEndpoint)

export class Tag {
    id: number
    name: string
    userFriendlyName: string
    description: string

    constructor(id: number, name: string, userFriendlyName: string, description: string) {
        this.id = id
        this.name = name
        this.userFriendlyName = userFriendlyName
        this.description = description
    }
}

export function useTags() {
    const { data, error } = useSWR(listTagsRequestPath, fetcher)
    if (error) {
        throw new Error(error)
    }

    return {
        tags: data as Tag[],
        isLoading: !error && !data,
        isError: false
    }
}

export function useTag(tagID: number) {
    if (tagID === undefined) {
        throw new Error("tagID is undefined")
    }

    const { data, error } = useSWR(listTagsRequestPath, fetcher)
    if (error) {
        throw new Error(error)
    }

    if (!error && !data) {
        return {
            tag: {} as Tag,
            isLoading: true,
            isError: false,
        }
    }

    const tags = data as Tag[]
    const tag = tags.find(t => t.id == tagID)

    if (!tag) {
        throw new Error(`tag ${tagID} is not found`)
    }

    return {
        tag: tag,
        isLoading: !error && !data,
        isError: false
    }
}