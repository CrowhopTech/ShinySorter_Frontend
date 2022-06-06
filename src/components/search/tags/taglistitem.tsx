import { HStack, IconButton, Spinner, Text } from "@chakra-ui/react"
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa"
import { useTag } from "../../../rest/tags"

type TagClickEvent = (tagID: number) => void

interface TagListItemProps {
    showPlusButton: boolean
    showMinusButton: boolean

    plusButtonClicked?: TagClickEvent
    minusButtonClicked?: TagClickEvent

    tagID: number
}

const TagListItem: React.FC<TagListItemProps> = ({ showPlusButton, showMinusButton, tagID, plusButtonClicked, minusButtonClicked }) => {
    const { tag, isLoading, isError } = useTag(tagID)
    let textSection = <Spinner />
    if (!isLoading) {
        textSection = <Text color="white">{tag.userFriendlyName}</Text>
    }

    return <HStack>
        {showPlusButton && <IconButton color="green.500" icon={<FaPlusCircle />} onClick={() => { plusButtonClicked && plusButtonClicked(tag.id) }} aria-label={"add-tag"} variant="ghost" size="{15}" isRound />}
        {showMinusButton && <IconButton color="red.500" icon={<FaMinusCircle />} onClick={() => { minusButtonClicked && minusButtonClicked(tag.id) }} aria-label={"remove-tag"} variant="ghost" size="{15}" isRound />}
        {textSection}
    </HStack>
}

export default TagListItem