import { Box, Button, HStack, IconButton, VStack } from "@chakra-ui/react";
import { ReactNode, ReactPropTypes, useState } from "react";
import { FaAngleDown, FaAngleUp, FaSearch } from "react-icons/fa";

const galleryBarBottomHeight = 30
const galleryHeight = 150
const galleryBarHeight = galleryHeight + galleryBarBottomHeight

function makePx(value: number) {
    return `${value}px`
}

interface GalleryBarProps {
    edgeBorder?: any
    onReturnClick?: () => void
}

const GalleryBar: React.FC<GalleryBarProps> = ({ edgeBorder, children, onReturnClick }) => {
    let [toggled, setToggled] = useState(false)

    return <Box position="fixed" top={makePx(toggled ? 0 : -galleryHeight)} left={edgeBorder ? edgeBorder : "0"} right={edgeBorder ? edgeBorder : "0"} h={makePx(galleryBarHeight)} bg="rgba(75,75,75,.6)" transition="top .5s" >
        <VStack h="full" w="full" spacing={0}>
            <HStack h={makePx(galleryHeight)} maxH={makePx(galleryHeight)} padding={"8px"} minW="full" w="full">
                <IconButton icon={<FaSearch />} aria-label="return to search" onClick={() => onReturnClick && onReturnClick()} />
                <HStack h="full" overflowX="auto" w="full">
                    {children}
                </HStack>
            </HStack>
            <IconButton color="white" icon={toggled ? <FaAngleUp /> : <FaAngleDown />} aria-label="toggle gallery bar" w="full" h={makePx(galleryBarBottomHeight)} onClick={() => setToggled(!toggled)} rounded="none" bg="rgba(75,75,75,.6)" />
        </VStack>
    </Box >
}

export default GalleryBar;