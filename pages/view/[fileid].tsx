import { Heading, Spinner, Center, Text, Image, Box, IconButton } from "@chakra-ui/react"
import { NextRouter, useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"
import FileRender from "../../src/components/filerender"
import GalleryBar from "../../src/components/search/gallerybar"
import useFileQuery from "../../src/hooks/filequery"
import { ServerAddress, ServerProtocol } from "../../src/rest/constants"
import { FileQuery, useFiles, File, getFile } from "../../src/rest/files"

const navButtonWidth = "25px"

function getBackgroundBox() {
    return <Box position="fixed" top="0" bottom="0" left="0" right="0" bg="gray.900" zIndex={-1} />
}

function getFilesArray(router: NextRouter, currentFileID: string, { files, isLoading, err }: ReturnType<typeof useFiles>, query: FileQuery) {
    if (isLoading) {
        return <Spinner />
    }
    if (err != null) {
        return <Text color="white">Failed to load files: {err}</Text>
    }
    if (files == null) {
        return <Text color="white">No files found</Text>
    }

    return files.map(file => {
        let outlined = false
        if (file.id == currentFileID) {
            outlined = true
        }
        // TODO: fetch file contents through SRF, if we can?
        return <Image key={file.id} alt={file.id}
            _hover={{ opacity: 0.5 }} transition="opacity .2s" cursor="pointer"
            border={outlined ? "4px" : "0px"} borderColor="white" borderRadius="4px" outline="none" h="full"
            fit="contain" src={ServerProtocol + ServerAddress + "/files/contents/" + file.id + "?thumb=true"}
            onClick={() => navigateToFile(router, file.id, query)}
        />
    })
}

function navigateToFile(router: NextRouter, fileID: string, query: FileQuery) {
    let url = new URL("/view/" + fileID, window.location.protocol + window.location.host)
    router.push(query.appendQueryParams(url));
}

function returnToSearch(router: NextRouter, query: FileQuery) {
    let url = new URL("/search", window.location.protocol + window.location.host)
    router.push(query.appendQueryParams(url));
}

function getFileInDirection(dir: "next" | "previous", currentFileID: string, files: never[] | File[]): string | null {
    if (!files) {
        return null
    }

    const indexOfCurrentFile = files.findIndex(file => file.id == currentFileID)

    let fileTarget: string | null = null
    if (indexOfCurrentFile != -1) {
        // The file is in the query
        if (dir == "previous" && indexOfCurrentFile > 0) {
            fileTarget = files[indexOfCurrentFile - 1].id
        }
        if (dir == "next" && indexOfCurrentFile < files.length - 1) {
            fileTarget = files[indexOfCurrentFile + 1].id
        }
    }
    return fileTarget
}

function navigateInDirection(router: NextRouter, dir: "next" | "previous", currentFileID: string, files: never[] | File[], query: FileQuery) {
    const targetFile = getFileInDirection(dir, currentFileID, files)
    if (targetFile == null) {
        return
    }

    navigateToFile(router, targetFile, query)
}

function getNavButton(router: NextRouter, dir: "next" | "previous", currentFileID: string, files: never[] | File[], query: FileQuery) {
    const fileTarget = getFileInDirection(dir, currentFileID, files)

    const label = (dir === "next" ? "next-file" : "previous-file")
    const icon = (dir === "next" ? <FaChevronRight /> : <FaChevronLeft />)
    const left = (dir === "previous") ? "0" : "unset"
    const right = (dir === "next") ? "0" : "unset"
    const button = < IconButton aria-label={label}
        icon={icon} position="fixed"
        left={left} right={right}
        top="0" height="100vh" width={navButtonWidth} minWidth={navButtonWidth} fontSize="25px"
        color="white" bg="rgba(75,75,75,.6)" rounded="none" disabled={fileTarget == null} onClick={() => fileTarget && navigateToFile(router, fileTarget, query)} />
    return button
}

const ViewFilePage: React.FC = () => {
    const router = useRouter()

    const { query, queryProvided } = useFileQuery()
    const { files, isLoading, err } = useFiles(query)

    // TODO: also parse the query string here so we know to show the next/previous buttons
    // TODO: have an "isQuery" parameter, so that even if we have an empty query we can still
    //       show the next/previous buttons and navigate through
    const { fileID } = router.query

    // Set up arrow key navigation
    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            if (!fileID || Array.isArray(fileID)) return;

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
            navigateInDirection(router, dir, fileID, files, query)
        }

        document.addEventListener('keydown', handleKeyDown);

        // Don't forget to clean up
        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        }
    }, [fileID, query, files, router]);

    if (!router.isReady) {
        return <Center w="100vw" h="100vh"><Spinner size="xl" /></Center>
    }

    if (fileID === undefined) {
        return <Heading>No file ID provided</Heading>
    }
    if (typeof fileID !== "string") {
        return <Heading>Invalid type provided for fileID</Heading>
    }

    return <React.Fragment>
        {getBackgroundBox()}
        <FileRender fileID={fileID} w="100vw" h="100vh" />
        <GalleryBar edgeBorder={navButtonWidth} onReturnClick={() => returnToSearch(router, query)}>
            {
                getFilesArray(router, fileID, { files, isLoading, err }, query)
            }
        </GalleryBar>
        {getNavButton(router, "previous", fileID, files, query)}
        {getNavButton(router, "next", fileID, files, query)}
    </React.Fragment>
}

export default ViewFilePage