import { Divider, Heading, VStack, Text, Spinner } from "@chakra-ui/react"
import { Tag, useTags } from "../../../rest/tags"
import TagListItem from "./taglistitem"

interface TagSelectListData {
    tagSelected?: (tagID: number, state: "included" | "excluded") => void
    hideTags: number[]
}

const TagSelectList: React.FC<TagSelectListData> = ({ tagSelected, hideTags }) => {
    const { tags, isLoading, isError } = useTags()
    if (isLoading) {
        return <Spinner />
    }

    return <VStack alignItems="flex-start">
        <Heading color="white" fontSize="2xl">Tags</Heading>
        <Text color="white" fontSize="sm" fontStyle="italic">Select tags to include or exclude</Text>
        <Divider />
        <VStack alignItems="flex-start" w="full">
            {
                tags.
                    filter(tag => !hideTags.includes(tag.id)).
                    map(tag => <TagListItem key={tag.id} tagID={tag.id}
                        showPlusButton={true} showMinusButton={true}
                        plusButtonClicked={tagID => tagSelected && tagSelected(tagID, "included")}
                        minusButtonClicked={tagID => tagSelected && tagSelected(tagID, "excluded")} />
                    )
            }
        </VStack>
    </VStack>
}

export default TagSelectList