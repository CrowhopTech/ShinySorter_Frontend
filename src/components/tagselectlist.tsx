import { Divider, Heading, VStack, Text } from "@chakra-ui/react"
import { ReactElement } from "react"
import { Tag } from "../rest/tags"
import TagListItem from "./taglistitem"

interface TagSelectListData {
    tagsList: Tag[] | undefined
}

function getTagElements(tags: Tag[] | undefined): ReactElement[] {
    if (tags === undefined) {
        return []
    }

    let tagElements: ReactElement[] = []
    tags.forEach((tag) => {
        tagElements.push(<TagListItem key={tag.id} tag={tag} showPlusButton={true} showMinusButton={true} />)
    })
    return tagElements
}

const TagSelectList: React.FC<TagSelectListData> = ({ tagsList }) => {
    return <VStack alignItems="flex-start">
        <Heading color="white" fontSize="2xl">Tags</Heading>
        <Text color="white" fontSize="sm" fontStyle="italic">Select tags to include or exclude</Text>
        <Divider />
        <VStack alignItems="flex-start" w="full">
            { getTagElements(tagsList) }
        </VStack>
    </VStack>
}

export default TagSelectList