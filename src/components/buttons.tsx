import { ArrowLeftIcon, ArrowRightIcon, CheckCircleIcon } from "@chakra-ui/icons";
import { HStack, Button } from "@chakra-ui/react";
import { debug } from "console";

interface ButtonsData {
    isFinished: boolean;
    onBack: () => void;
    onNext: () => void;
    onSave: () => void;
    canGoBack: boolean;
}

const Buttons: React.FC<ButtonsData> = ({ isFinished, onBack, onNext, onSave, canGoBack }) => {
    let nextButton = <Button aria-label="next" leftIcon={<ArrowRightIcon />} onClick={onNext}>Next</Button>

    if (isFinished) {
        nextButton = <Button colorScheme="green" aria-label="done" leftIcon={<CheckCircleIcon />} onClick={onSave}>Done</Button>
    }

    return <HStack w="full" alignItems="flex-end">
        <Button aria-label="back" leftIcon={<ArrowLeftIcon />} onClick={onBack} disabled={!canGoBack}>Back</Button>
        {nextButton}
    </HStack>
}

export default Buttons;