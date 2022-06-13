import { ServerAddress, ServerProtocol } from "./constants"
import path from "path"
import { rawListeners } from "process"
import useSWR from "swr"

const fetcher = (input: RequestInfo, init?: RequestInit | undefined) => fetch(input, init).then(res => res.json())

const imagesEndpoint = "images"

export class Image {
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

export type ImageQueryMode = "any" | "all"

export class ImageQuery {
    includeMode: ImageQueryMode
    excludeMode: ImageQueryMode
    includeTags: number[]
    excludeTags: number[]
    tagged: boolean

    constructor(includeMode?: ImageQueryMode, excludeMode?: ImageQueryMode, includedTags?: number[], excludedTags?: number[], tagged?: boolean) {
        this.includeMode = includeMode ? includeMode : "all"
        this.excludeMode = excludeMode ? excludeMode : "all"
        this.includeTags = includedTags ? includedTags : []
        this.excludeTags = excludedTags ? excludedTags : []
        this.tagged = tagged !== undefined ? tagged : true
    }

    getURL() {
        const requestPath = ServerProtocol + path.join(ServerAddress, imagesEndpoint)
        const requestURL = new URL(requestPath);
        requestURL.searchParams.append("hasBeenTagged", this.tagged.toString())
        if (this.includeTags.length > 0) {
            requestURL.searchParams.append("includeTags", this.includeTags.join(","))
            requestURL.searchParams.append("includeOperator", this.includeMode)
        }
        if (this.excludeTags.length > 0) {
            requestURL.searchParams.append("excludeTags", this.excludeTags.join(","))
            requestURL.searchParams.append("excludeOperator", this.excludeMode)
        }
        return requestURL.toString()
    }
}

export function parseQueryMode(input: string | string[] | undefined): ImageQueryMode {
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

export async function listImages(query: ImageQuery): Promise<Image[] | null> {
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
            return [] as Image[]
        }
        return j as Image[]
    })
}

export async function getImage(imageID: string): Promise<Image> {
    const requestPath = ServerProtocol + path.join(ServerAddress, imagesEndpoint, imageID)
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
        return j as Image
    })
}

export async function updateImageTags(imageID: string, selectedTags: number[], markAsTagged: boolean | undefined = undefined): Promise<void> {
    // TODO: sanitize imageID
    const requestPath = ServerProtocol + path.join(ServerAddress, imagesEndpoint, imageID)
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

export function useImages(query: ImageQuery) {
    const { data, error } = useSWR(query.getURL(), fetcher)
    if (error) {
        throw new Error(error)
    }

    return {
        images: data as Image[],
        isLoading: !error && !data,
        isError: false
    }
}

export function useImage(imageID: string) {
    // TODO: validate the imageID
    const { data, error } = useSWR(ServerProtocol + path.join(ServerAddress, imagesEndpoint, imageID), fetcher)
    if (error) {
        return {
            image: null,
            isLoading: false,
            err: error
        }
    }

    return {
        image: data as Image,
        isLoading: !error && !data,
        err: null
    }
}