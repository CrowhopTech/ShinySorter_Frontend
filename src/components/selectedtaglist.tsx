import { Divider, Radio, RadioGroup, Stack, VStack, Heading, Spinner } from "@chakra-ui/react"
import React from "react"
import { queryMode } from "../rest/images"
import { Tag, useTags } from "../rest/tags"
import TagListItem from "./taglistitem"

interface SelectedTagListProps {
    selectedMode: queryMode
    selectedTags: number[]
}

function getTagRemoveListItem(tagID: number) {
    return <TagListItem key={tagID} tagID={tagID} showPlusButton={false} showMinusButton={true} />
}

function getIncludedTagsSection(selectedTags: number[] | undefined) {
    if (selectedTags === undefined || selectedTags.length == 0) {
        return <Heading color="white" size="sm" fontStyle="italic" fontWeight="medium">No selected tags</Heading>
    }
    return selectedTags.map(tag => getTagRemoveListItem(tag))
}

const SelectedTagList: React.FC<SelectedTagListProps> = ({ selectedMode, selectedTags }) => {
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
            {getIncludedTagsSection(selectedTags)}
        </VStack>
    </React.Fragment>
}

export default SelectedTagList