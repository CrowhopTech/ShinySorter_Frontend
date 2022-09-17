import { Heading, Text, Image as ChakraImage, Spinner, Center } from "@chakra-ui/react"
import { ServerAddress, ServerProtocol } from "../rest/address"
import { useFile, File } from "../rest/files"
import ReactPlayer from 'react-player/lazy'

interface FileRenderProps {
    fileID: string
    w?: any, h?: any
    onClick?: () => void
}

function selectImageElement(w: any, h: any, mimeType: string, imageID: string) {
    if (mimeType == undefined) {
        return <Text color="white">MIME type is not set!</Text>
    }
    if (mimeType.startsWith("video")) {
        return <ReactPlayer controls playing muted width={w} height={h} url={ServerProtocol + ServerAddress + "/files/contents/" + imageID} />
    } else if (mimeType.startsWith("image")) {
        return <ChakraImage src={ServerProtocol + ServerAddress + "/files/contents/" + imageID} h="full" w={w} objectFit="contain" />
    } else {
        return <Text>Unknown MIME type</Text>
    }
}

function selectImageSection(w: any, h: any, fileID: string, image: File | null, isLoading: boolean, err: any) {
    // If we have some data to show, always try to show it
    if (image != null) {
        return selectImageElement(w, h, image.mimeType, image.id)
    }
    // If we have an error to show, always try to show it
    if (err != null) {
        return <Text color="white">Failed to load file &apos;{fileID}&apos;: {err.toString()}</Text>
    }

    // Default to showing a spinner
    return <Spinner size="xl" />
}

const FileRender: React.FC<FileRenderProps> = ({ fileID, w, h, onClick }) => {
    const { file, isLoading, err } = useFile(fileID)

    return <Center w={w} h={h} maxH="100vh" onClick={() => onClick && onClick()}>
        {selectImageSection(w, h, fileID, file, isLoading, err)}
    </Center>
}

export default FileRender