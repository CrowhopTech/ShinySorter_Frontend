import { NextRouter, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { parseQueryMode, ImageQueryMode, ImageQuery } from "../rest/images";

const includeModeParam = "includeMode"
const excludeModeParam = "excludeMode"
const includedTagsParam = "includeTags"
const excludedTagsParam = "excludeTags"

function parseIntParam(input: undefined | string | string[]): number[] {
    if (input === undefined) {
        return []
    }
    if (typeof input === "string") {
        if (input.trim().length == 0) {
            return []
        }
        const trySplit = input.split(",")
        if (trySplit.length > 0) {
            return trySplit.map(s => parseInt(s))
        }
        return [parseInt(input)]
    }
    return input.map((str) => parseInt(str))
}

function updateParamsAndNavigate(router: NextRouter,
    includeMode: ImageQueryMode | undefined, excludeMode: ImageQueryMode | undefined, includedTags: number[] | undefined, excludedTags: number[] | undefined) {
    let currentUrlParams = new URLSearchParams(window.location.search)
    if (includeMode !== undefined) {
        currentUrlParams.set(includeModeParam, includeMode.toString())
    }
    if (excludeMode !== undefined) {
        currentUrlParams.set(excludeModeParam, excludeMode.toString())
    }
    if (includedTags !== undefined) {
        currentUrlParams.set(includedTagsParam, includedTags.join(","))
    }
    if (excludedTags !== undefined) {
        currentUrlParams.set(excludedTagsParam, excludedTags.join(","))
    }
    router.push(window.location.pathname + "?" + currentUrlParams.toString(), undefined, { shallow: true })
}

function useImageQuery() {
    const router = useRouter();

    const [includeMode, setIncludeMode] = useState((includeModeParam in router.query) ? parseQueryMode(router.query[includeModeParam]) : "all")
    const [excludeMode, setExcludeMode] = useState((excludeModeParam in router.query) ? parseQueryMode(router.query[excludeModeParam]) : "all")
    const [includedTags, setIncludedTags] = useState((includedTagsParam in router.query) ? parseIntParam(router.query[includedTagsParam]) : [])
    const [excludedTags, setExcludedTags] = useState((excludedTagsParam in router.query) ? parseIntParam(router.query[excludedTagsParam]) : [])

    function setMode(which: "include" | "exclude", newValue: ImageQueryMode) {
        if (which == "include") {
            updateParamsAndNavigate(router, newValue, undefined, undefined, undefined)
        } else if (which == "exclude") {
            updateParamsAndNavigate(router, undefined, newValue, undefined, undefined)
        }
    }

    function setTagState(tag: number, state: "included" | "excluded" | "none") {
        switch (state) {
            case "included": {
                let newIncludedTags = includedTags, newExcludedTags = excludedTags
                if (!newIncludedTags.includes(tag)) {
                    newIncludedTags.push(tag)
                    console.info(newIncludedTags)
                }
                if (newExcludedTags.includes(tag)) {
                    newExcludedTags = newExcludedTags.filter((t) => t !== tag)
                }
                updateParamsAndNavigate(router, undefined, undefined, newIncludedTags, newExcludedTags)
                break
            }
            case "excluded": {
                let newIncludedTags = includedTags, newExcludedTags = excludedTags
                if (newIncludedTags.includes(tag)) {
                    newIncludedTags = newIncludedTags.filter((t) => t !== tag)
                }
                if (!newExcludedTags.includes(tag)) {
                    newExcludedTags.push(tag)
                }
                updateParamsAndNavigate(router, undefined, undefined, newIncludedTags, newExcludedTags)
                break
            }
            case "none": {
                let newIncludedTags = includedTags, newExcludedTags = excludedTags
                if (newIncludedTags.includes(tag)) {
                    newIncludedTags = newIncludedTags.filter((t) => t !== tag)
                }
                if (newExcludedTags.includes(tag)) {
                    newExcludedTags = newExcludedTags.filter((t) => t !== tag)
                }
                updateParamsAndNavigate(router, undefined, undefined, newIncludedTags, newExcludedTags)
                break
            }
        }
    }

    // Handle when URL query parameters change and update the state accordingly (either by the `setParamAndNavigate` function or by the user)
    // This plus the shallow routing is what allows the page to stay static and not have to fully reload, but still apply the updates
    useEffect(() => {
        setIncludeMode(includeModeParam in router.query ? parseQueryMode(router.query[includeModeParam]) : "all")
    }, [router.query[includeModeParam]])
    useEffect(() => {
        setExcludeMode(excludeModeParam in router.query ? parseQueryMode(router.query[excludeModeParam]) : "all")
    }, [router.query[excludeModeParam]])
    useEffect(() => {
        setIncludedTags(includedTagsParam in router.query ? parseIntParam(router.query[includedTagsParam]) : [])
    }, [router.query[includedTagsParam]])
    useEffect(() => {
        setExcludedTags(excludedTagsParam in router.query ? parseIntParam(router.query[excludedTagsParam]) : [])
    }, [router.query[excludedTagsParam]])

    const query = new ImageQuery(includeMode, excludeMode, includedTags, excludedTags)
    const queryProvided = (includeModeParam in router.query) ||
        (excludeModeParam in router.query) ||
        (includedTagsParam in router.query) ||
        (excludedTagsParam in router.query)
    return { query, queryProvided, setMode, setTagState }
}

export default useImageQuery