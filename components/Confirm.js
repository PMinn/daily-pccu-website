import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    cn
} from "@nextui-org/react";

export default function Confirm({ title, content, disclosure, confirm, placement = "center", className = "" }) {
    return (
        <Modal
            isOpen={disclosure.isOpen}
            onOpenChange={disclosure.onOpenChange}
            placement={placement}
            scrollBehavior="inside"
            hideCloseButton={true}
            className={cn('max-w-[90%]', className)}
        >
            <ModalContent>
                {
                    onClose => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
                            <ModalBody>{content}</ModalBody>
                            <ModalFooter className='justify-center'>
                                <Button color="default" variant="faded" className='grow' onPress={onClose}>取消</Button>
                                <Button color="primary" className='grow' onPress={() => {
                                    confirm();
                                    onClose();
                                }}>確認</Button>
                            </ModalFooter>
                        </>
                    )
                }
            </ModalContent>
        </Modal>
    )
}