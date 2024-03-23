import { Chip, tv } from "@nextui-org/react";

const checkbox = tv({
    slots: {
        base: "border-default hover:bg-default-200",
        content: "text-default-500"
    },
    variants: {
        isSelected: {
            true: {
                base: "border-primary bg-primary hover:bg-primary-600 hover:border-primary-600",
                content: "text-primary-foreground pl-1"
            }
        },
        isFocusVisible: {
            true: {
                base: "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background",
            }
        }
    }
})

const demo = tv({
    slots: {
        base: "",
        content: "text-default-500"
    },
    variants: {
        isSelected: {
            true: {
                base: "border-primary bg-primary",
                content: "text-primary-foreground pl-1"
            }
        },
        isFocusVisible: {
            true: {
                base: "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background",
            }
        }
    }
})

export const WayChip = ({ isSelected, isFocusVisible, children, getLabelProps, props, isDemo }) => {
    var styles;
    if (isDemo) {
        styles = demo({ isSelected, isFocusVisible });
    } else {
        styles = checkbox({ isSelected, isFocusVisible });
    }
    if (!getLabelProps) getLabelProps = () => ({});
    return (
        <Chip
            classNames={{
                base: styles.base(),
                content: styles.content(),
            }}
            startContent={isSelected ? (
                <svg
                    aria-hidden="true"
                    fill="none"
                    focusable="false"
                    height="1em"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                    width="1em"
                    className="ml-1 text-primary-foreground"
                    {...props}
                >
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            )
                :
                null
            }
            variant="faded"
            {...getLabelProps()}
        >
            {children ? children : isSelected ? "Enabled" : "Disabled"}
        </Chip>
    );
}

