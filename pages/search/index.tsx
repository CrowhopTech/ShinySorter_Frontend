import { GridItem, SimpleGrid, VStack, Heading, Box, Button } from "@chakra-ui/react"
import ImageResult from "../../src/components/search/imageresult"
import SelectedTagList from "../../src/components/search/tags/selectedtaglist"
import TagSelectList from "../../src/components/search/tags/tagselectlist"
import useImageQuery from "../../src/hooks/imagequery"
import { DedupList } from "../../src/util"

function generateImages(len: number) {
    let arr = []
    for (let i = 0; i < len; i++) {
        arr.push(<ImageResult key={i} />)
    }
    return arr
}

const Index: React.FC = () => {
    const { includeMode, excludeMode, includedTags, excludedTags, setMode, setTagState } = useImageQuery()

    return <SimpleGrid columns={3} columnGap={1} height="100vh" width="100vw" maxW="100vw" bg="gray.900" gridTemplateColumns="min-content min-content auto" overflowX="clip" overflowY="hidden">
        <GridItem bg="gray.700" w="fit-content" minW="250px" padding="10px">
            <TagSelectList hideTags={[...includedTags, ...excludedTags]} tagSelected={(tagID, state) => setTagState(tagID, state)} />
        </GridItem>
        <GridItem bg="gray.700" w="fit-content" minW="250px" padding="10px">
            <VStack alignItems="flex-start">
                <Heading color="white" fontSize="2xl" overflowWrap={"unset"}>Include files with the tags:</Heading>
                <SelectedTagList selectedMode={includeMode} selectedTags={DedupList(includedTags)} onModeChange={newMode => setMode("include", newMode)} onTagRemoved={tagID => setTagState(tagID, "none")} />

                <Box height="5px"></Box>

                <Heading color="white" fontSize="2xl" overflowWrap={"unset"}>But exclude files with the tags:</Heading>
                <SelectedTagList selectedMode={excludeMode} selectedTags={DedupList(excludedTags)} onModeChange={newMode => setMode("exclude", newMode)} onTagRemoved={tagID => setTagState(tagID, "none")} />
            </VStack>
        </GridItem>
        <GridItem bg="gray.700" padding="10px" overflowY="scroll">
            { /* TODO: replace this with a Chakra SimpleGrid to get that nice file grid layout */}
            <VStack alignItems="flex-start" w="full" spacing="1px">
                {generateImages(10)}
            </VStack>
        </GridItem>
    </SimpleGrid>
}

export default Index