import { ServerAddress, ServerProtocol } from "./address"
import path from "path"
import { rawListeners } from "process"
import useSWR from "swr"

const fetcher = (input: RequestInfo, init?: RequestInit | undefined) => fetch(input, init).then(res => res.json())

const filesEndpoint = "files"

export class File {
    id: string
    md5sum: string
    tags: number[]
    mimeType: string

    constructor(id: string, md5sum: string, tags: number[], mimeType: string) {
        this.id = id
        this.md5sum = md5sum
        this.tags = tags
        this.mimeType = mimeType
    }
}

export type FileQueryMode = "any" | "all"

export class FileQuery {
    includeMode: FileQueryMode
    excludeMode: FileQueryMode
    includeTags: number[]
    excludeTags: number[]
    tagged: boolean

    constructor(includeMode?: FileQueryMode, excludeMode?: FileQueryMode, includedTags?: number[], excludedTags?: number[], tagged?: boolean) {
        this.includeMode = includeMode ? includeMode : "all"
        this.excludeMode = excludeMode ? excludeMode : "all"
        this.includeTags = includedTags ? includedTags : []
        this.excludeTags = excludedTags ? excludedTags : []
        this.tagged = tagged !== undefined ? tagged : true
    }

    getQueryParams(): URLSearchParams {
        const params = new URLSearchParams()
        params.append("hasBeenTagged", this.tagged.toString())
        if (this.includeTags.length > 0) {
            params.append("includeTags", this.includeTags.join(","))
            params.append("includeOperator", this.includeMode)
        }
        if (this.excludeTags.length > 0) {
            params.append("excludeTags", this.excludeTags.join(","))
            params.append("excludeOperator", this.excludeMode)
        }
        return params
    }

    appendQueryParams(input: URL): URL {
        this.getQueryParams().forEach((value, key) => input.searchParams.append(key, value))
        return input
    }

    getURL() {
        return this.appendQueryParams(new URL(ServerProtocol + path.join(ServerAddress, filesEndpoint))).toString()
    }
}

export function parseQueryMode(input: string | string[] | undefined): FileQueryMode {
    if (typeof input !== "string") {
        throw new Error(`Invalid type ${typeof input} for query mode, must be string`)
    }
    switch (input) {
        case "any":
            return "any"
        case "all":
            return "all"
        default:
            throw new Error(`Unknown query mode: ${input}`)
    }
}

export async function listFiles(query: FileQuery): Promise<File[] | null> {
    const response = await fetch(query.getURL(), {
        method: "GET",
    }).catch(err => {
        console.error(`Error: ${err}`);
        throw err
    })

    if (response == null) {
        return null
    }

    if (!response.ok && response.status != 404) {
        const responseText = await response.text()
        console.error(`${response.status} ${response.statusText}: ${responseText}`)
        throw new Error(responseText)
    }

    return await response.json().catch(err => {
        console.error(`Error decoding JSON: ${err}`)
        throw new Error(`Error decoding JSON: ${err}`)
    }).then(j => {
        if (j == "[]") {
            return [] as File[]
        }
        return j as File[]
    })
}

export async function getFile(fileID: string): Promise<File> {
    const requestPath = ServerProtocol + path.join(ServerAddress, filesEndpoint, fileID)
    const response = await fetch(requestPath, {
        method: "GET",
    }).catch(err => {
        console.error(`Error: ${err}`);
        throw err
    })

    if (response == null) {
        throw new Error("respons was null")
    }

    if (!response.ok) {
        const responseText = await response.text()
        console.error(`${response.status} ${response.statusText}: ${responseText}`)
        throw new Error(responseText)
    }

    return await response.json().catch(err => {
        console.error(`Error decoding JSON: ${err}`)
        throw new Error(`Error decoding JSON: ${err}`)
    }).then(j => {
        return j as File
    })
}

export async function updateFileTags(fileID: string, selectedTags: number[], markAsTagged: boolean | undefined = undefined): Promise<void> {
    // TODO: sanitize fileID
    const requestPath = ServerProtocol + path.join(ServerAddress, filesEndpoint, fileID)
    const requestBody = {
        "tags": selectedTags,
        "hasBeenTagged": markAsTagged
    }
    const response = await window.fetch(requestPath, {
        method: "PATCH",
        body: JSON.stringify(requestBody),
        headers: {
            "Content-Type": "application/json"
        }
    }).catch(err => {
        console.error(`Error: ${err}`);
        return
    })

    if (response == null) {
        return
    }

    if (!response.ok) {
        const responseText = await response.text()
        console.error(`${response.status} ${response.statusText}: ${responseText}`)
        return
    }
}

export function useFiles(query: FileQuery) {
    const { data, error } = useSWR(query.getURL(), fetcher)
    if (error) {
        return {
            files: [],
            isLoading: false,
            err: error
        }
    }

    return {
        files: data as File[],
        isLoading: !error && !data,
        err: null
    }
}

export function useFile(fileID: string) {
    // TODO: validate the fileID
    const { data, error } = useSWR(ServerProtocol + path.join(ServerAddress, filesEndpoint, fileID), fetcher)
    if (error) {
        return {
            file: null,
            isLoading: false,
            err: error
        }
    }

    return {
        file: data as File,
        isLoading: !error && !data,
        err: null
    }
}