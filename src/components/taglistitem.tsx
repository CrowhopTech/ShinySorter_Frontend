import { HStack, IconButton, Text } from "@chakra-ui/react"
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa"
import { Tag } from "../rest/tags"

type TagClickEvent = (tagID: number) => void

interface TagListItemProps {
    showPlusButton: boolean
    showMinusButton: boolean
    
    plusButtonClicked?: TagClickEvent
    minusButtonClicked?: TagClickEvent
    
    tag: Tag
}

const TagListItem: React.FC<TagListItemProps> = ({showPlusButton, showMinusButton, tag, plusButtonClicked, minusButtonClicked}) => {
    return <HStack>
        { showPlusButton && <IconButton color="green.500" icon={<FaPlusCircle />} onClick={() => { if (plusButtonClicked !== undefined) { plusButtonClicked(tag.id) }}} aria-label={"add-tag"} variant="ghost" size="{15}" isRound />}
        { showMinusButton && <IconButton color="red.500" icon={<FaMinusCircle />} onClick={() => { if (minusButtonClicked !== undefined) { minusButtonClicked(tag.id) }}} aria-label={"remove-tag"} variant="ghost" size="{15}" isRound /> }
        <Text color="white">{tag.userFriendlyName}</Text>
    </HStack>
}

export default TagListItem