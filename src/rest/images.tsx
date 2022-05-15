import { ServerAddress, ServerProtocol } from "./constants"
import path from "path"

const imagesEndpoint = "images"

export class Image {
    id: string
    md5sum: string
    tags: number[]

    constructor(id: string, md5sum: string, tags: number[]) {
        this.id = id
        this.md5sum = md5sum
        this.tags = tags
    }
}

export async function listImages(): Promise<Image[] | null> {
    const requestPath = ServerProtocol + path.join(ServerAddress, imagesEndpoint)
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
    }).then(j => j as Image[])
}

export async function updateImageTags(imageID: string, selectedTags: number[]): Promise<void> {
    // TODO: sanitize imageID
    const requestPath = ServerProtocol + path.join(ServerAddress, imagesEndpoint, imageID)
    const response = await window.fetch(requestPath, {
        method: "PATCH",
        body: JSON.stringify({
            "tags": selectedTags
        }),
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