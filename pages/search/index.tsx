import { GridItem, SimpleGrid, VStack, Heading, Box, Button, Spinner } from "@chakra-ui/react"
import { NextRouter, useRouter } from "next/router"
import ImageResult from "../../src/components/search/imageresult"
import SelectedTagList from "../../src/components/search/tags/selectedtaglist"
import TagSelectList from "../../src/components/search/tags/tagselectlist"
import useImageQuery from "../../src/hooks/imagequery"
import { Image, ImageQuery, useImages } from "../../src/rest/images"
import { DedupList } from "../../src/util"

function onImageResultClick(router: NextRouter, imageID: string, query: ImageQuery) {
    let url = new URL("/view/" + imageID, window.location.protocol + window.location.host)
    router.push(query.appendQueryParams(url))
}

function getImagesSection(router: NextRouter, loading: boolean, data: Image[] | null | undefined, query: ImageQuery) {
    if (loading) {
        return <Spinner />
    }

    if (!data) {
        data = []
    }

    return <VStack alignItems="flex-start" w="full" spacing="1px">
        {data.map(img => <ImageResult key={img.id} image={img} onClick={imageID => onImageResultClick(router, imageID, query)} />)}
    </VStack>
}

const Index: React.FC = () => {

    const router = useRouter()
    const { query, setMode, setTagState } = useImageQuery()

    const { images, isLoading, err } = useImages(query)
    if (isLoading) {
        return <Spinner />
    }
    if (err) {
        return <div>Error: {err}</div>
    }

    return <SimpleGrid columns={3} columnGap={1} height="100vh" width="100vw" maxW="100vw" bg="gray.900" gridTemplateColumns="min-content min-content auto" overflowX="clip" overflowY="hidden">
        <GridItem bg="gray.700" w="fit-content" minW="250px" padding="10px">
            <TagSelectList hideTags={[...query.includeTags, ...query.excludeTags]} tagSelected={(tagID, state) => setTagState(tagID, state)} />
        </GridItem>
        <GridItem bg="gray.700" w="fit-content" minW="250px" padding="10px">
            <VStack alignItems="flex-start">
                <Heading color="white" fontSize="2xl" overflowWrap={"unset"}>Include files with the tags:</Heading>
                <SelectedTagList selectedMode={query.includeMode} selectedTags={DedupList(query.includeTags)} onModeChange={newMode => setMode("include", newMode)} onTagRemoved={tagID => setTagState(tagID, "none")} />

                <Box height="5px"></Box>

                <Heading color="white" fontSize="2xl" overflowWrap={"unset"}>But exclude files with the tags:</Heading>
                <SelectedTagList selectedMode={query.excludeMode} selectedTags={DedupList(query.excludeTags)} onModeChange={newMode => setMode("exclude", newMode)} onTagRemoved={tagID => setTagState(tagID, "none")} />
            </VStack>
        </GridItem>
        <GridItem bg="gray.700" padding="10px" overflowY="scroll">
            { /* TODO: replace this with a Chakra SimpleGrid to get that nice file grid layout */}
            {getImagesSection(router, isLoading, images, query)}
        </GridItem>
    </SimpleGrid>
}

export default Index