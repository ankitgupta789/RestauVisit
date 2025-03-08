import React, { useState, useEffect } from "react";
import { FaChair } from "react-icons/fa";
import {
  Box,
  Flex,
  Text,
  Button,
  Input,
  Grid,
  GridItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { addTable, fetchTables, markSlotAsBooked, markSlotAsUnBooked } from "../services/Restaurants/Table";
import { useSelector } from "react-redux";
import NotificationRender from "./NotificationRender";
import Navbar from "./Navbar/Navbar2";

const TableManager = () => {
  const [tables, setTables] = useState([]); // State to store tables
  const [showInput, setShowInput] = useState(false); // State to show input form
  const [capacity, setCapacity] = useState(""); // State to store capacity input
  const [selectedTable, setSelectedTable] = useState(null); // Selected table object for popup
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal control
  const { user } = useSelector((state) => state.profile);

  // Fetch tables from backend
  const loadTables = async () => {
    try {
      const fetchedTables = await fetchTables(user._id); // Pass restaurantId (user._id)
      setTables(fetchedTables);
      console.log(fetchedTables, "fetched tables");
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  useEffect(() => {
    loadTables();
  }, [user._id]);

  const handleAddTable = () => {
    setShowInput(true); // Show input form
  };

  const handleCloseInput = () => {
    setShowInput(false); // Hide input form
    setCapacity(""); // Reset capacity
  };

  const handleSubmit = async () => {
    if (capacity.trim() !== "") {
      try {
        await addTable(user._id, Number(capacity)); // Call backend to add table
        setTables((prev) => [
          ...prev,
          { id: tables.length + 1, capacity: Number(capacity) },
        ]);
        setShowInput(false); // Hide input form
        setCapacity(""); // Reset capacity
        loadTables();
      } catch (error) {
        console.error("Error adding table:", error);
        alert("Failed to add table. Please try again.");
      }
    } else {
      alert("Please enter a valid capacity!");
    }
  };

  const handleTableClick = (table) => {
    setSelectedTable(table); // Set selected table for popup
    onOpen(); // Open the modal
  };

  const handleSlotBooking = async (tableId, timeSlot, userName, index) => {
    try {
      const result = await markSlotAsBooked(tableId, timeSlot, userName);
      if (result) {
        // Update the slot as booked in the frontend
        const updatedSlots = selectedTable.slots.map((slot, i) =>
          i === index ? { ...slot, isBooked: true, userName, showForm: false } : slot
        );
        setSelectedTable({ ...selectedTable, slots: updatedSlots });
        loadTables();
        alert("Slot successfully booked!");
      }
    } catch (error) {
      console.error("Error booking slot:", error);
      alert("Failed to book the slot. Please try again.");
    }
  };

  const handleSlotUnbooking = async (tableId, timeSlot, index) => {
    const confirmUnbooking = window.confirm(
      `Are you sure you want to unbook the slot: ${timeSlot}?`
    );

    if (!confirmUnbooking) {
      // If the user cancels, do nothing
      return;
    }

    try {
      const result = await markSlotAsUnBooked(tableId, timeSlot);
      if (result) {
        // Update the slot as unbooked in the frontend
        const updatedSlots = selectedTable.slots.map((slot, i) =>
          i === index ? { ...slot, isBooked: false, userName: null } : slot
        );
        setSelectedTable({ ...selectedTable, slots: updatedSlots });
        loadTables();
        alert("Slot successfully unbooked!");
      }
    } catch (error) {
      console.error("Error unbooking slot:", error);
      alert("Failed to unbook the slot. Please try again.");
    }
  };

  // Move all useColorModeValue calls to the top level
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const pageBg = useColorModeValue("gray.50", "gray.800");
  const tableBg = useColorModeValue("gray.100", "gray.600");
  const notificationBg = useColorModeValue("blue.50", "blue.900");

  return (
    <Box minH="100vh" bg={pageBg}>
      <Navbar />
      <Flex h="calc(100vh - 64px)">
        {/* Left Side: Table Manager */}
        <Box w="60%" p={6} bg={cardBg}>
          {/* Add Table Button */}
          {!showInput ? (
            <Button
              onClick={handleAddTable}
              colorScheme="green"
              size="lg"
              mb={4}
            >
              Add Table
            </Button>
          ) : (
            <Flex gap={2} mb={4}>
              <Input
                type="number"
                placeholder="Enter table capacity"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
              <Button onClick={handleSubmit} colorScheme="green">
                Submit
              </Button>
              <Button onClick={handleCloseInput} colorScheme="red">
                Close
              </Button>
            </Flex>
          )}

          {/* Display Tables */}
          <Grid templateColumns="repeat(auto-fill, minmax(150px, 1fr))" gap={4}>
            {tables.map((table) => (
              <GridItem
                key={table._id}
                onClick={() => handleTableClick(table)}
                p={4}
                bg={tableBg}
                borderRadius="md"
                cursor="pointer"
                _hover={{ shadow: "md" }}
                textAlign="center"
              >
                <FaChair size={40} color="#4caf50" style={{ marginBottom: "5px" }} />
                <Text fontWeight="bold">Table {table.id}</Text>
                <Text>Capacity: {table.capacity}</Text>
              </GridItem>
            ))}
          </Grid>
        </Box>

        {/* Right Side: Notifications */}
        <Box flex={1} p={6} bg={notificationBg}>
          <NotificationRender />
        </Box>
      </Flex>

      {/* Modal for Selected Table */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Table {selectedTable?.id}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Capacity: {selectedTable?.capacity}</Text>
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Available Slots
            </Text>
            <Grid templateColumns="repeat(4, 1fr)" gap={3}>
              {selectedTable?.slots.map((slot, index) => (
                <Box
                  key={index}
                  p={4}
                  bg={slot.isBooked ? "pink.100" : "green.100"}
                  borderRadius="md"
                  textAlign="center"
                  cursor="pointer"
                  _hover={{ shadow: "md" }}
                  onClick={() => {
                    if (slot.isBooked) {
                      handleSlotUnbooking(selectedTable._id, slot.slot, index);
                    } else {
                      const updatedSlots = selectedTable.slots.map((s, i) =>
                        i === index ? { ...s, showForm: true } : s
                      );
                      setSelectedTable({ ...selectedTable, slots: updatedSlots });
                    }
                  }}
                >
                  <Text fontWeight="bold">{slot.slot}</Text>
                  <Text fontSize="sm" color="gray.600">
                    {slot.isBooked ? "Unbook Table" : "Book Table"}
                  </Text>
                </Box>
              ))}
            </Grid>

            {/* Booking Form */}
            {selectedTable?.slots.map(
              (slot, index) =>
                slot.showForm && (
                  <Box
                    key={index}
                    mt={4}
                    p={4}
                    bg="gray.100"
                    borderRadius="md"
                  >
                    <Text fontSize="lg" fontWeight="bold" mb={2}>
                      Book Slot: {slot.slot}
                    </Text>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const userName = e.target.userName.value;
                        if (userName.trim() === "") {
                          alert("Please enter a valid name.");
                          return;
                        }
                        handleSlotBooking(selectedTable._id, slot.slot, userName, index);
                      }}
                    >
                      <Input
                        type="text"
                        name="userName"
                        placeholder="Enter your name"
                        mb={2}
                      />
                      <Button type="submit" colorScheme="green" w="full">
                        Confirm Booking
                      </Button>
                    </form>
                  </Box>
                )
            )}

            {/* Close Button */}
            <Flex justify="flex-end" mt={6}>
              <Button onClick={onClose} colorScheme="red">
                Close
              </Button>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default TableManager;