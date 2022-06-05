import { Divider, Radio, RadioGroup, Stack, VStack, Heading } from "@chakra-ui/react"
import React from "react"
import { queryMode } from "../rest/images"
import { Tag } from "../rest/tags"
import TagListItem from "./taglistitem"

interface SelectedTagListProps {
    selectedMode: queryMode
    selectedTags: number[]
    tagsList: Tag[] | undefined
}

function getTagRemoveListItem(tagsList: Tag[], id: number) {
    let tag = tagsList.find(t => t.id == id)
    if (tag === undefined) {
        throw new Error(`Tag ${id} not found`)
    }
    return <TagListItem tag={tag} showPlusButton={false} showMinusButton={true}/>
}

function getIncludedTagsSection(tagsList: Tag[] | undefined, selectedTags: number[] | undefined) {
    if (tagsList === undefined) {
        throw new Error("tagsList is undefined")
    }
    if (selectedTags === undefined || selectedTags.length == 0) {
        return <Heading color="white" size="sm" fontStyle="italic" fontWeight="medium">No selected tags</Heading>
    }
    return selectedTags.map(tag => getTagRemoveListItem(tagsList, tag))
}

const SelectedTagList: React.FC<SelectedTagListProps> = ({ selectedMode, selectedTags, tagsList }) => {
    if (selectedTags === undefined) {
        selectedTags = []
    }

    return <React.Fragment>
        <VStack alignItems="flex-start">
            <RadioGroup color="white" defaultValue='all' value={selectedMode}>
                <Stack spacing={4} direction='row'>
                    <Radio value='all'>all of</Radio>
                    <Radio value='any'>any of</Radio>
                </Stack>
            </RadioGroup>
        </VStack>
        <Divider />
        <VStack alignItems="flex-start" w="full">
            { getIncludedTagsSection(tagsList, selectedTags) }
        </VStack>
    </React.Fragment>
}

export default SelectedTagList