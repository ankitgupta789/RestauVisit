import { CloseIcon } from '@chakra-ui/icons'
import { Badge } from '@chakra-ui/react'
import React from 'react'

const UserItem = ({user,handleFunction,admin}) => {
  return (
    <Badge
    px={2}
    py={1}
    borderRadius="lg"
    m={1}
    mb={2}
    variant="solid"
    fontSize={12}
    colorScheme="purple"
    cursor="pointer"
   
  >
    {user.firstName}
    {admin === user._id && <span> (Admin)</span>}
    <CloseIcon pl={1}  onClick={handleFunction} />
  </Badge>
  )
}

export default UserItem
