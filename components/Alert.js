import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, cn } from "@nextui-org/react";

export default function Alert({
    title = "",
    content = "",
    disclosure,
    callback,
    placement = "center",
    className = "",
    color = "primary",
    isDismissable = true
}) {
    const dismissableProp = {
        isDismissable: false,
        isKeyboardDismissDisabled: true
    }
    return (
        <Modal
            isOpen={disclosure.isOpen}
            onOpenChange={disclosure.onOpenChange}
            placement={placement}
            scrollBehavior="inside"
            className={cn('max-w-[90%]', className)}
            hideCloseButton={true}
            {...(isDismissable ? {} : dismissableProp)}
        >
            <ModalContent>
                {
                    onClose => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                            <ModalBody>
                                <p>{content}</p>
                            </ModalBody>
                            <ModalFooter className='justify-center'>
                                <Button color={color} className='grow' onPress={() => {
                                    onClose();
                                    if (typeof callback === 'function') callback();
                                }}>確認</Button>
                            </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    )
}