import { ServerAddress, ServerProtocol } from "./constants"
import path from "path"
import _ from "lodash"

const listTagsEndpoint = "tags"

let tagsCache: Tag[] | null = null
let tagsMap: Map<number, Tag> | null = null

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

function updateInCache(tags: Tag[]): Tag[] {
    if (tagsMap == null) {
        tagsMap = new Map()
    }
    for (const tag of tags) {
        tagsMap!.set(tag.id, tag)
    }
    return tags
}

async function updateTagsCache() {
    const requestPath = ServerProtocol + path.join(ServerAddress, listTagsEndpoint)
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

    tagsCache = await response.json().catch(err => {
        console.error(`Error decoding JSON: ${err}`)
        return null
    }).then(j => updateInCache(j as Tag[]))
}

export async function ListTags(): Promise<Tag[]> {
    if (tagsCache == null) {
        await updateTagsCache()
    }

    if (tagsCache == null) {
        throw new Error("tagsCache is still null after updateTagsCache()")
    }

    return tagsCache
}

export async function GetTag(id: number): Promise<Tag> {
    if (tagsMap == null) {
        await updateTagsCache()
    }

    if (tagsMap == null) {
        throw new Error("tagsMap is still null after updateTagsCache()")
    }

    let tag = tagsMap.get(id)
    if (tag == undefined) {
        throw new Error(`tag ${id} is not found`)
    }

    return tag
}

export async function GetTagsMap(): Promise<Map<number, Tag>> {
    if (tagsMap == null) {
        await updateTagsCache()
    }

    if (tagsMap == null) {
        throw new Error("tagsMap is still null after updateTagsCache()")
    }

    return tagsMap
}