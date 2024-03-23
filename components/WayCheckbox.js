import { useCheckbox, Chip, VisuallyHidden, tv } from "@nextui-org/react";
import { WayChip } from "./WayChip";



export const WayCheckbox = (props) => {
    const { children, isSelected, isFocusVisible, getBaseProps, getLabelProps, getInputProps } = useCheckbox({ ...props });

    return (
        <label {...getBaseProps()}>
            <VisuallyHidden>
                <input {...getInputProps()} />
            </VisuallyHidden>
            <WayChip
                isSelected={isSelected}
                isFocusVisible={isFocusVisible}
                children={children}
                getLabelProps={getLabelProps}
                props={props}
            />
        </label>
    );
}

