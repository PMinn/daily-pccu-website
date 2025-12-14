import { Checkbox, Link, User, Chip, cn } from "@heroui/react";

export const WeatherCheckbox = ({ value, city }) => {
    return (
        <Checkbox
            classNames={{
                base: cn(
                    "inline-flex max-w-md w-full bg-content1 m-0",
                    "hover:bg-content2 items-center justify-start",
                    "cursor-pointer rounded-lg gap-2 p-4 border-2 border-transparent",
                    "data-[selected=true]:border-primary"
                ),
                label: "w-full",
            }}
            value={value}
        >
            <div className="w-full flex justify-between items-center gap-2">
                <span>{value}</span>
                <span className="text-tiny text-default-500">{city}</span>
            </div>
        </Checkbox>
    );
};

