import React, { useEffect, useState } from "react";
import { fetchRecentReservations } from "../../services/Restaurants/BookTable"; // Backend function for fetching recent reservations
import { useSelector } from "react-redux";
import {
  Box,
  Flex,
  Text,
  Spinner,
  Stack,
  Card,
  CardBody,
  Avatar,
  useColorModeValue,
} from "@chakra-ui/react";

const RecentBookings = () => {
  const { user } = useSelector((state) => state.profile); // Get user details from Redux
  const userId = user?._id; // Extract user ID
  const [bookings, setBookings] = useState([]); // State for bookings
  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState(null); // State for errors

  // Move useColorModeValue to the top level
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");

  // Fetch bookings on component mount
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetchRecentReservations(userId); // Fetch recent bookings
        setBookings(response.data); // Set bookings in state
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bookings.");
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  // Display loading or error message if applicable
  if (loading) {
    return (
      <Flex justify="center" align="center" height="600px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" height="600px">
        <Text color="red.500">{error}</Text>
      </Flex>
    );
  }

  return (
    <Box
      // bg={useColorModeValue("gray.50", "gray.800")}
      // borderRadius="lg"
      // p={6}
      // height="720px" // Fixed height
      // overflowY="auto" // Enable vertical 
      className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 h-[720px] overflow-y-auto"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={6} color={textColor}>
        Recent Bookings
      </Text>
      {bookings.length === 0 ? (
        <Text color="gray.600">No recent bookings found.</Text>
      ) : (
        <Stack spacing={4}>
          {bookings.map((booking, index) => (
            <Card key={index} bg={cardBg} boxShadow="md" _hover={{ boxShadow: "lg" }}>
              <CardBody>
                <Flex justify="space-between" align="center">
                  {/* Booking Details */}
                  <Box>
                    <Text fontSize="sm" color="gray.600">
                      <Text as="span" fontWeight="bold">Customer ID:</Text> {booking.customerId}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      <Text as="span" fontWeight="bold">Date:</Text>{" "}
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      <Text as="span" fontWeight="bold">Time:</Text> {booking.slot}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      <Text as="span" fontWeight="bold">Guests:</Text> {booking.guests}
                    </Text>
                  </Box>

                  {/* User Image */}
                  <Box flexShrink={0} ml={4}>
                    {booking.userImage ? (
                      <Avatar
                        src={booking.userImage}
                        name="User"
                        size="lg"
                        border="2px"
                        borderColor="gray.300"
                      />
                    ) : (
                      <Avatar
                        name="No Image"
                        size="lg"
                        bg="gray.300"
                        color="gray.500"
                        border="2px"
                        borderColor="gray.300"
                      />
                    )}
                  </Box>
                </Flex>
              </CardBody>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default RecentBookings;
