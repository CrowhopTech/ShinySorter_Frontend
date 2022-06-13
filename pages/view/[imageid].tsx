import { Heading, Spinner, Center } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React from "react"
import ImageRender from "../../src/components/imagerender"

const ViewImagePage: React.FC = () => {
    const router = useRouter()

    // TODO: also parse the query string here so we know to show the next/previous buttons
    // TODO: have an "isQuery" parameter, so that even if we have an empty query we can still
    //       show the next/previous buttons and navigate through
    const { imageid } = router.query

    if (!router.isReady) {
        return <Center w="100vw" h="100vh"><Spinner size="xl" /></Center>
    }

    if (imageid === undefined) {
        return <Heading>No image ID provided</Heading>
    }
    if (typeof imageid !== "string") {
        return <Heading>Invalid type provided for imageid</Heading>
    }

    return <ImageRender imageID={imageid} w="100vw" h="100vh" />
}

export default ViewImagePage