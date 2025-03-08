import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { fetchNotifications } from "../../services/NotificationRoutes/restauNotify";
import { fetchItemsByIds } from "../../services/operations/menu";
import {
  Box,
  Flex,
  Text,
  Button,
  ButtonGroup,
  Spinner,
  Stack,
  useColorModeValue,
  Card,
  CardHeader,
  CardBody,
  Divider,
} from "@chakra-ui/react";

const ITEMS_PER_PAGE = 5; // Number of notifications per page

const RecentOnlineOrders = () => {
  const { user } = useSelector((state) => state.profile);
  const restaurantEmail = user._id;

  const [notifications, setNotifications] = useState([]);
  const [expandedIndexes, setExpandedIndexes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemDetails, setItemDetails] = useState({});
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const fetchedNotifications = await fetchNotifications(restaurantEmail);
        setNotifications(fetchedNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    loadNotifications();
  }, [restaurantEmail]);

  const toggleExpand = async (index, items) => {
    if (expandedIndexes.includes(index)) {
      setExpandedIndexes((prev) => prev.filter((i) => i !== index));
    } else {
      if (!itemDetails[index]) {
        const itemIds = items.map((item) => item.itemId);
        try {
          const fetchedItems2 = await fetchItemsByIds(itemIds);
          const fetchedItems = fetchedItems2.data;

          const mergedItems = fetchedItems.map((item) => {
            const correspondingItem = items.find((i) => i.itemId === item._id);
            return {
              ...item,
              quantity: correspondingItem ? correspondingItem.quantity : 0,
            };
          });

          const totalAmount = mergedItems.reduce(
            (sum, item) => sum + item.quantity * item.price,
            0
          );

          setItemDetails((prev) => ({
            ...prev,
            [index]: { items: mergedItems, totalAmount },
          }));
        } catch (error) {
          console.error("Error fetching item details:", error);
        }
      }
      setExpandedIndexes((prev) => [...prev, index]);
    }
  };

  const totalPages = Math.ceil(notifications.length / ITEMS_PER_PAGE); // Total number of pages

  const displayedNotifications = notifications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const cardBg = useColorModeValue("white", "gray.700");
  const buttonColorScheme = useColorModeValue("blue", "teal");

  return (
    <Box
      p={6}
      bg={useColorModeValue("gray.50", "gray.800")}
      borderRadius="lg"
      height="720px" // Fixed height
      overflowY="auto" // Enable vertical scrolling
    >
      <Text fontSize="2xl" fontWeight="bold" mb={6} color={useColorModeValue("gray.800", "white")}>
        Recent Online Orders
      </Text>
      {loading ? (
        <Flex justify="center" align="center" h="40">
          <Spinner size="xl" />
        </Flex>
      ) : notifications.length > 0 ? (
        <Stack spacing={4}>
          {/* Pagination Controls */}
          <Flex justify="center" mt={6}>
            <ButtonGroup spacing={2}>
              <Button
                onClick={handlePreviousPage}
                isDisabled={currentPage === 1}
                colorScheme={buttonColorScheme}
              >
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  colorScheme={currentPage === page ? buttonColorScheme : "gray"}
                  variant={currentPage === page ? "solid" : "outline"}
                >
                  {page}
                </Button>
              ))}
              <Button
                onClick={handleNextPage}
                isDisabled={currentPage === totalPages}
                colorScheme={buttonColorScheme}
              >
                Next
              </Button>
            </ButtonGroup>
          </Flex>
          {displayedNotifications.map((notification, index) => (
            <Card key={index} bg={cardBg} boxShadow="md" _hover={{ boxShadow: "lg" }}>
              <CardHeader>
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontSize="sm" color="gray.600">
                      <Text as="span" fontWeight="bold">User ID:</Text> {notification.userId}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      <Text as="span" fontWeight="bold">Created At:</Text>{" "}
                      {new Date(notification.createdAt).toLocaleString()}
                    </Text>
                  </Box>
                  <Button
                    onClick={() => toggleExpand(index, notification.items)}
                    colorScheme={buttonColorScheme}
                    size="sm"
                  >
                    {expandedIndexes.includes(index) ? "Show Less" : "Show More"}
                  </Button>
                </Flex>
              </CardHeader>
              {expandedIndexes.includes(index) && (
                <CardBody pt={0}>
                  <Divider mb={4} />
                  <Stack spacing={3}>
                    {(itemDetails[index]?.items || []).map((item, itemIndex) => (
                      <Box key={itemIndex} borderBottom="1px" borderColor="gray.200" pb={3}>
                        <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                          {item.name}
                        </Text>
                        <Text fontSize="sm" color="gray.600">{item.description}</Text>
                        <Text fontSize="sm" color="gray.600">
                          <Text as="span" fontWeight="bold">Quantity:</Text> {item.quantity}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          <Text as="span" fontWeight="bold">Price:</Text> ₹{item.price}
                        </Text>
                      </Box>
                    ))}
                  </Stack>
                  <Text fontSize="lg" fontWeight="bold" color="green.500" mt={4}>
                    Total Amount: ₹{itemDetails[index]?.totalAmount || 0}
                  </Text>
                </CardBody>
              )}
            </Card>
          ))}
        </Stack>
      ) : (
        <Text textAlign="center" color="gray.600">No notifications available</Text>
      )}
    </Box>
  );
};

export default RecentOnlineOrders;