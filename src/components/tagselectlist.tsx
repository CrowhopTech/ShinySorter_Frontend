import { Divider, Heading, VStack, Text, Spinner } from "@chakra-ui/react"
import { Tag, useTags } from "../rest/tags"
import TagListItem from "./taglistitem"

interface TagSelectListData {
}

const TagSelectList: React.FC<TagSelectListData> = ({ }) => {
    const { tags, isLoading, isError } = useTags()
    if (isLoading) {
        return <Spinner />
    }

    return <VStack alignItems="flex-start">
        <Heading color="white" fontSize="2xl">Tags</Heading>
        <Text color="white" fontSize="sm" fontStyle="italic">Select tags to include or exclude</Text>
        <Divider />
        <VStack alignItems="flex-start" w="full">
            {tags.map(tag => <TagListItem key={tag.id} tagID={tag.id} showPlusButton={true} showMinusButton={true} />)}
        </VStack>
    </VStack>
}

export default TagSelectList