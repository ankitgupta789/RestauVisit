import { ViewIcon } from '@chakra-ui/icons';
import { Button, IconButton, Image, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, useDisclosure } from '@chakra-ui/react';
import React from 'react'


const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const capitalizedUsername = user?.firstName
    ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()
    : '';

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton display={{ base: 'flex' }} icon={<ViewIcon />} onClick={onOpen} />
      )}

      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent h="410px" backgroundImage="linear-gradient(to right, #ffffff, #f0f0f0)">
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {capitalizedUsername}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {user?.pic && (
              <Image
                borderRadius="full"
                boxSize="150px"
                src={user.pic}
                alt={user.firstName}
              />
            )}
            {user?.email && (
              <Text fontSize={{ base: '28px', md: '30px' }} fontFamily="Work sans">
                Email: {user.email}
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
