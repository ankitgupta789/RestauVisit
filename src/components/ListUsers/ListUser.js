import React from 'react'
import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";



const ListUser = ({user,handleFunction}) => {

  return (
    <Box
    onClick={handleFunction}
    cursor="pointer"
    bg="#E8E8E8"
    _hover={{
      background: "#38B2AC",
      color: "white",
    }}
    w="100%"
    style={{display:"flex",alignItems:"center",justifyItems:"space-between"}}
    color="black"
    px={3}
    py={2}
    mb={2}
    borderRadius="lg"
    >
        <Avatar
         mr={2}
         size="sm"
         cursor="pointer"
         name={user.firstName}
         src={user.pic}
        />
        <Box>
        <Text>{user.firstName}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
        </Box>
    
    </Box>
  )
}

export default ListUser
