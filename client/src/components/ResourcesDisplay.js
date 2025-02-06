import React from 'react';
import {
    Box,
    Heading,
    VStack,
    Tabs,
    TabList,
    TabPanels,
    Tab,
    TabPanel,
    SimpleGrid,
    Badge,
} from '@chakra-ui/react';
import ResourceCard from './ResourceCard';

function ResourcesDisplay({ resources }) {
    const levels = ['beginner', 'intermediate', 'advanced'];

    return (
        <Box w="100%">
            <Tabs isFitted variant="enclosed">
                <TabList mb="1em">
                    {levels.map((level) => (
                        <Tab key={level} textTransform="capitalize">
                            {level}
                        </Tab>
                    ))}
                </TabList>

                <TabPanels>
                    {levels.map((level) => (
                        <TabPanel key={level}>
                            <VStack spacing={6}>
                                <Box w="100%">
                                    <Heading size="md" mb={4}>
                                        Free Resources
                                        <Badge ml={2} colorScheme="green">
                                            Free
                                        </Badge>
                                    </Heading>
                                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                                        {resources[level].free.map((resource, idx) => (
                                            <ResourceCard key={idx} resource={resource} />
                                        ))}
                                    </SimpleGrid>
                                </Box>

                                <Box w="100%">
                                    <Heading size="md" mb={4}>
                                        Paid Resources
                                        <Badge ml={2} colorScheme="purple">
                                            Paid
                                        </Badge>
                                    </Heading>
                                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                                        {resources[level].paid.map((resource, idx) => (
                                            <ResourceCard key={idx} resource={resource} />
                                        ))}
                                    </SimpleGrid>
                                </Box>
                            </VStack>
                        </TabPanel>
                    ))}
                </TabPanels>
            </Tabs>
        </Box>
    );
}

export default ResourcesDisplay; 