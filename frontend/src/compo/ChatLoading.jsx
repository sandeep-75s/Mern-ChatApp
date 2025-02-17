import React from 'react'
import { SkeletonText } from "../components/ui/skeleton"
const ChatLoading = () => {
  return (
    <SkeletonText noOfLines={5} colorPalette="gray.100" gap="5" height="35px"/>
  )
}

export default ChatLoading
