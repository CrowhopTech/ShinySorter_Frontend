import { ServerAddress, ServerProtocol } from "./constants"
import path from "path"
import { rawListeners } from "process"

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

export type queryMode = "any" | "all"

export function parseQueryMode(input: string | string[] | undefined): queryMode {
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

export async function listImages(tagged: boolean|undefined = undefined): Promise<Image[] | null> {
    const requestPath = ServerProtocol + path.join(ServerAddress, imagesEndpoint)
    const requestURL = new URL(requestPath);
    if (tagged != undefined) {
        requestURL.searchParams.append("hasBeenTagged", `${tagged}`)
    }
    const response = await fetch(requestURL.toString(), {
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

export async function updateImageTags(imageID: string, selectedTags: number[], markAsTagged: boolean|undefined=undefined): Promise<void> {
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