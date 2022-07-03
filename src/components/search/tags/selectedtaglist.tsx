import { Divider, Radio, RadioGroup, Stack, VStack, Heading } from "@chakra-ui/react"
import React from "react"
import { FileQueryMode } from "../../../rest/files"
import TagListItem from "./taglistitem"

interface SelectedTagListProps {
    selectedMode: FileQueryMode
    selectedTags: number[]
    onModeChange?: ((mode: FileQueryMode) => void) | undefined
    onTagRemoved?: ((tagID: number) => void) | undefined
}

function getIncludedTagsSection(selectedTags: number[] | undefined, onTagRemoved: ((tagID: number) => void) | undefined) {
    if (selectedTags === undefined || selectedTags.length == 0) {
        return <Heading color="white" size="sm" fontStyle="italic" fontWeight="medium">No selected tags</Heading>
    }
    return selectedTags.map(tag => <TagListItem key={tag} tagID={tag} showPlusButton={false} showMinusButton={true} minusButtonClicked={tagID => onTagRemoved && onTagRemoved(tagID)} />)
}

const SelectedTagList: React.FC<SelectedTagListProps> = ({ selectedMode, selectedTags, onModeChange, onTagRemoved }) => {
    if (selectedTags === undefined) {
        selectedTags = []
    }

    return <React.Fragment>
        <VStack alignItems="flex-start">
            <RadioGroup color="white" defaultValue='all' value={selectedMode} onChange={e => onModeChange && onModeChange(e as FileQueryMode)}>
                <Stack spacing={4} direction='row'>
                    <Radio value='all'>all of</Radio>
                    <Radio value='any'>any of</Radio>
                </Stack>
            </RadioGroup>
        </VStack>
        <Divider />
        <VStack alignItems="flex-start" w="full">
            {getIncludedTagsSection(selectedTags, onTagRemoved)}
        </VStack>
    </React.Fragment>
}

export default SelectedTagList