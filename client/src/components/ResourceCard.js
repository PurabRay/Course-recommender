import React from 'react';
import {
    Box,
    Heading,
    Text,
    Link,
    VStack,
    Badge,
    HStack,
} from '@chakra-ui/react';

function ResourceCard({ resource }) {
    return (
        <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={4}
            _hover={{ shadow: 'md' }}
            transition="all 0.2s"
        >
            <VStack align="start" spacing={2}>
                <Heading size="sm" noOfLines={2}>
                    {resource.title}
                </Heading>
                
                <HStack>
                    <Badge colorScheme="blue">{resource.type}</Badge>
                    {resource.price && (
                        <Badge colorScheme="purple">
                            {resource.price}
                        </Badge>
                    )}
                </HStack>

                <Text fontSize="sm" color="gray.600" noOfLines={2}>
                    {resource.description}
                </Text>

                {resource.estimatedTime && (
                    <Text fontSize="sm" color="gray.500">
                        Duration: {resource.estimatedTime}
                    </Text>
                )}

                <Link
                    href={resource.url}
                    isExternal
                    color="blue.500"
                    fontSize="sm"
                    noOfLines={1}
                >
                    View Resource →
                </Link>
            </VStack>
        </Box>
    );
}

export default ResourceCard; 