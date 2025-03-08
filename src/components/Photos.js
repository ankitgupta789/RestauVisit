import React, { useState, useEffect } from "react";
import { getAllImages, addImage, deleteImage } from '../services/operations/photos';
import { useSelector } from "react-redux";
import Navbar from "./Navbar/Navbar2";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  Grid,
  GridItem,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";

const Photos = () => {
  const [photos, setPhotos] = useState([]);
  const [loadingImage, setLoadingImage] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null); // State to hold the selected photo for zooming
  const [photoToDelete, setPhotoToDelete] = useState(null); // Store the photo to delete
  const { isOpen: isDeleteModalOpen, onOpen: openDeleteModal, onClose: closeDeleteModal } = useDisclosure(); // Delete modal control
  const { isOpen: isZoomModalOpen, onOpen: openZoomModal, onClose: closeZoomModal } = useDisclosure(); // Zoom modal control
  const { user } = useSelector((state) => state.profile);
  const userId = user._id;

  // Fetch all photos on component mount
  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const fetchedPhotos = await getAllImages(userId); // Fetch photos using the getAllImages function
        setPhotos(fetchedPhotos); // Set the photos state with the fetched data
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };
    fetchPhotos();
  }, [userId]);

  // Upload photo to Cloudinary and save URL in the database
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoadingImage(true); // Set loading state while uploading
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "ml_default");

      try {
        // Upload image to Cloudinary
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dvlvjwx5t/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await response.json();

        if (data.secure_url) {
          // Call the existing function to save the image URL in the database
          await addImage(userId, data.secure_url); // Add the image URL to your database

          // Update the local state with the new image URL
          setPhotos([...photos, data.secure_url]);
        }
      } catch (err) {
        console.error("Error uploading image:", err.message);
      } finally {
        setLoadingImage(false); // Reset loading state
      }
    }
  };

  // Function to handle photo click for zooming
  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo); // Set the selected photo to open in the modal
    openZoomModal(); // Open the zoom modal
  };

  // Function to handle delete photo
  const handleDelete = async () => {
    try {
      await deleteImage(userId, photoToDelete); // Call the function to delete the image URL from the database
      setPhotos(photos.filter((p) => p !== photoToDelete)); // Remove the photo from the local state
      closeDeleteModal(); // Close the confirmation modal after successful delete
    } catch (err) {
      console.error("Error deleting photo:", err.message);
    }
  };

  // Chakra UI color mode values
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  return (
    <Box minH="100vh" bg={useColorModeValue("gray.50", "gray.800")}>
      <Navbar />
      <Box p={6}>
        <Text fontSize="2xl" fontWeight="bold" mb={6} color={textColor}>
          Photos
        </Text>

        {/* Upload Section */}
        <Flex align="center" mb={6}>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={loadingImage}
            display="none"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button
              as="span"
              colorScheme="blue"
              isLoading={loadingImage}
              loadingText="Uploading..."
            >
              Upload Image
            </Button>
          </label>
        </Flex>

        {/* Display Photos */}
        <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={4}>
          {photos.length === 0 ? (
            <Text>No photos available.</Text>
          ) : (
            photos.map((photo, index) => (
              <GridItem
                key={index}
                position="relative"
                overflow="hidden"
                borderRadius="md"
                bg={cardBg}
                boxShadow="md"
                _hover={{ boxShadow: "lg" }}
              >
                {/* Delete Button */}
                
                <IconButton
                  aria-label="Delete photo"
                  icon={<DeleteIcon color="error" />}
                  colorScheme="red"
                  size="sm"
                  position="absolute"
                  top={2}
                  right={2}
                  opacity={0}
                  _groupHover={{ opacity: 1 }}
                  transition="opacity 0.2s"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhotoToDelete(photo);
                    openDeleteModal();
                  }}
                />
                <Image
                  src={photo}
                  alt="Uploaded"
                  w="full"
                  h="200px"
                  objectFit="cover"
                  cursor="pointer"
                  onClick={() => handlePhotoClick(photo)}
                />
              </GridItem>
            ))
          )}
        </Grid>

        {/* Modal for Zoomed Photo */}
        <Modal isOpen={isZoomModalOpen} onClose={closeZoomModal} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Zoomed Photo</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Image src={selectedPhoto} alt="Zoomed" w="full" h="auto" />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal isOpen={isDeleteModalOpen} onClose={closeDeleteModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Delete Photo</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>Are you sure you want to delete this photo?</Text>
            </ModalBody>
            <Flex justify="flex-end" p={4}>
              <Button colorScheme="red" mr={3} onClick={handleDelete}>
                Delete
              </Button>
              <Button onClick={closeDeleteModal}>Cancel</Button>
            </Flex>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
};

export default Photos;
