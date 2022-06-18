import { Heading, Spinner, Center, Text, Image as ImageElement, Grid, GridItem, Box, Button, HStack, IconButton } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import ImageRender from "../../src/components/imagerender"
import GalleryBar from "../../src/components/search/gallerybar"
import useImageQuery from "../../src/hooks/imagequery"
import { ServerAddress, ServerProtocol } from "../../src/rest/constants"
import { ImageQuery, useImages } from "../../src/rest/images"

const navButtonWidth = "25px"

function getBackgroundBox() {
    return <Box position="fixed" top="0" bottom="0" left="0" right="0" bg="gray.900" zIndex={-1} />
}

function getImagesArray(currentImageID: string, { images, isLoading, err }: ReturnType<typeof useImages>) {
    const router = useRouter();

    if (isLoading) {
        return <Spinner />
    }
    if (err != null) {
        return <Text>Failed to load images: {err}</Text>
    }
    if (images == null) {
        return <Text>No images found</Text>
    }

    return images.map(image => {
        let outlined = false
        if (image.id == currentImageID) {
            outlined = true
        }
        return <ImageElement
            _hover={{ opacity: 0.5 }} transition="opacity .2s" cursor="pointer"
            border={outlined ? "4px" : "0px"} borderColor="white" borderRadius="4px" outline="none" h="full"
            fit="contain" src={ServerProtocol + ServerAddress + "/images/contents/" + image.id + "?thumb=true"}
            onClick={() => router.push("/view/" + image.id)}
        />
    })
}

function getNavButton(dir: "next" | "previous") {
    const label = (dir === "next" ? "next-image" : "previous-image")
    const icon = (dir === "next" ? <FaChevronRight /> : <FaChevronLeft />)
    const left = (dir === "previous") ? "0" : "unset"
    const right = (dir === "next") ? "0" : "unset"
    const button = < IconButton aria-label={label}
        icon={icon} position="fixed"
        left={left} right={right}
        top="0" height="100vh" width={navButtonWidth} minWidth={navButtonWidth} fontSize="25px"
        color="white" bg="rgba(75,75,75,.6)" rounded="none" />
    return button
}

const ViewImagePage: React.FC = () => {
    const router = useRouter()

    const { query, queryProvided } = useImageQuery()
    const { images, isLoading, err } = useImages(query)

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

    return <React.Fragment>
        {getBackgroundBox()}
        <ImageRender imageID={imageid} w="100vw" h="100vh" />
        <GalleryBar edgeBorder={navButtonWidth}>
            {
                getImagesArray(imageid, { images, isLoading, err })
            }
        </GalleryBar>
        {getNavButton("previous")}
        {getNavButton("next")}
    </React.Fragment>
}

export default ViewImagePage