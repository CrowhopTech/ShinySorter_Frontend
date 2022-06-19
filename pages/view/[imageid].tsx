import { Heading, Spinner, Center, Text, Image as ImageElement, Grid, GridItem, Box, Button, HStack, IconButton } from "@chakra-ui/react"
import { NextRouter, useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import ImageRender from "../../src/components/imagerender"
import GalleryBar from "../../src/components/search/gallerybar"
import useImageQuery from "../../src/hooks/imagequery"
import { ServerAddress, ServerProtocol } from "../../src/rest/constants"
import { ImageQuery, useImages, Image, getImage } from "../../src/rest/images"

const navButtonWidth = "25px"

function getBackgroundBox() {
    return <Box position="fixed" top="0" bottom="0" left="0" right="0" bg="gray.900" zIndex={-1} />
}

function getImagesArray(currentImageID: string, { images, isLoading, err }: ReturnType<typeof useImages>, query: ImageQuery) {
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
        // TODO: fetch image contents through SRF, if we can?
        return <ImageElement
            _hover={{ opacity: 0.5 }} transition="opacity .2s" cursor="pointer"
            border={outlined ? "4px" : "0px"} borderColor="white" borderRadius="4px" outline="none" h="full"
            fit="contain" src={ServerProtocol + ServerAddress + "/images/contents/" + image.id + "?thumb=true"}
            onClick={() => navigateToImage(router, image.id, query)}
        />
    })
}

function navigateToImage(router: NextRouter, imageID: string, query: ImageQuery) {
    let url = new URL("/view/" + imageID, window.location.protocol + window.location.host)
    router.push(query.appendQueryParams(url));
}

function returnToSearch(router: NextRouter, query: ImageQuery) {
    let url = new URL("/search", window.location.protocol + window.location.host)
    router.push(query.appendQueryParams(url));
}

function getImageInDirection(dir: "next" | "previous", currentImageID: string, images: never[] | Image[]): string | null {
    if (!images) {
        return null
    }

    const indexOfCurrentImage = images.findIndex(image => image.id == currentImageID)

    let imageTarget: string | null = null
    if (indexOfCurrentImage != -1) {
        // The image is in the query
        if (dir == "previous" && indexOfCurrentImage > 0) {
            imageTarget = images[indexOfCurrentImage - 1].id
        }
        if (dir == "next" && indexOfCurrentImage < images.length - 1) {
            imageTarget = images[indexOfCurrentImage + 1].id
        }
    }
    return imageTarget
}

function navigateInDirection(router: NextRouter, dir: "next" | "previous", currentImageID: string, images: never[] | Image[], query: ImageQuery) {
    const targetImg = getImageInDirection(dir, currentImageID, images)
    if (targetImg == null) {
        return
    }

    navigateToImage(router, targetImg, query)
}

function getNavButton(router: NextRouter, dir: "next" | "previous", currentImageID: string, images: never[] | Image[], query: ImageQuery) {
    const imageTarget = getImageInDirection(dir, currentImageID, images)

    const label = (dir === "next" ? "next-image" : "previous-image")
    const icon = (dir === "next" ? <FaChevronRight /> : <FaChevronLeft />)
    const left = (dir === "previous") ? "0" : "unset"
    const right = (dir === "next") ? "0" : "unset"
    const button = < IconButton aria-label={label}
        icon={icon} position="fixed"
        left={left} right={right}
        top="0" height="100vh" width={navButtonWidth} minWidth={navButtonWidth} fontSize="25px"
        color="white" bg="rgba(75,75,75,.6)" rounded="none" disabled={imageTarget == null} onClick={() => imageTarget && navigateToImage(router, imageTarget, query)} />
    return button
}

const ViewImagePage: React.FC = () => {
    const router = useRouter()

    const { query, queryProvided } = useImageQuery()
    console.log("akrpan: ", query)
    const { images, isLoading, err } = useImages(query)

    // TODO: also parse the query string here so we know to show the next/previous buttons
    // TODO: have an "isQuery" parameter, so that even if we have an empty query we can still
    //       show the next/previous buttons and navigate through
    const { imageid } = router.query

    // Set up arrow key navigation
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (!imageid || Array.isArray(imageid)) return;

            let dir: "next" | "previous" | null = null
            if (e.code == "ArrowLeft") {
                dir = "previous"
            }
            if (e.code == "ArrowRight") {
                dir = "next"
            }
            if (!dir) {
                return
            }
            navigateInDirection(router, dir, imageid, images, query)
        }

        document.addEventListener('keydown', handleKeyDown);

        // Don't forget to clean up
        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [imageid, query]);

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
        <GalleryBar edgeBorder={navButtonWidth} onReturnClick={() => returnToSearch(router, query)}>
            {
                getImagesArray(imageid, { images, isLoading, err }, query)
            }
        </GalleryBar>
        {getNavButton(router, "previous", imageid, images, query)}
        {getNavButton(router, "next", imageid, images, query)}
    </React.Fragment>
}

export default ViewImagePage