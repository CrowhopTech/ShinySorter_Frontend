import { Heading, Text, Image as ChakraImage, Spinner, Center } from "@chakra-ui/react"
import { ServerAddress, ServerProtocol } from "../rest/constants"
import { useImage, Image } from "../rest/images"
import ReactPlayer from 'react-player/lazy'

interface ImageRenderProps {
    imageID: string
    w?: any, h?: any
    onClick?: () => void
}

function selectImageElement(w: any, h: any, mimeType: string, imageID: string) {
    if (mimeType == undefined) {
        return <Text color="white">MIME type is not set!</Text>
    }
    if (mimeType.startsWith("video")) {
        return <ReactPlayer controls playing muted width={w} height={h} url={ServerProtocol + ServerAddress + "/images/contents/" + imageID} />
    } else if (mimeType.startsWith("image")) {
        return <ChakraImage src={ServerProtocol + ServerAddress + "/images/contents/" + imageID} h="full" w={w} objectFit="contain" />
    } else {
        return <Text>Unknown MIME type</Text>
    }
}

function selectImageSection(w: any, h: any, imageID: string, image: Image | null, isLoading: boolean, err: any) {
    // If we have some data to show, always try to show it
    if (image != null) {
        return selectImageElement(w, h, image.mimeType, image.id)
    }
    // If we have an error to show, always try to show it
    if (err != null) {
        return <Text>Failed to load image '{imageID}': {err.toString()}</Text>
    }

    // Default to showing a spinner
    return <Spinner size="xl" />
}

const ImageRender: React.FC<ImageRenderProps> = ({ imageID, w, h, onClick }) => {
    const { image, isLoading, err } = useImage(imageID)

    return <Center w={w} h={h} maxH="100vh" onClick={() => onClick && onClick()}>
        {selectImageSection(w, h, imageID, image, isLoading, err)}
    </Center>
}

export default ImageRender