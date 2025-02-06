import React, { useState } from 'react';
import {
    Box,
    Container,
    Input,
    VStack,
    Heading,
    useToast,
    InputGroup,
    InputRightElement,
    IconButton,
    Spinner,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import ResourcesDisplay from './ResourcesDisplay';

function SearchPage() {
    const [subject, setSubject] = useState('');
    const [resources, setResources] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!subject.trim()) {
            toast({
                title: 'Error',
                description: 'Please enter a subject',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/get-resources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subject }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch resources');
            }

            const data = await response.json();
            setResources(data);
        } catch (error) {
            toast({
                title: 'Error',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxW="container.xl" py={10}>
            <VStack spacing={8}>
                <Heading as="h1" size="xl">
                    Learning Resource Finder
                </Heading>
                <Box w="100%" maxW="600px">
                    <form onSubmit={handleSearch}>
                        <InputGroup size="lg">
                            <Input
                                placeholder="Enter a subject (e.g., JavaScript, Machine Learning)"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                disabled={isLoading}
                            />
                            <InputRightElement>
                                {isLoading ? (
                                    <Spinner />
                                ) : (
                                    <IconButton
                                        aria-label="Search"
                                        icon={<SearchIcon />}
                                        onClick={handleSearch}
                                        type="submit"
                                    />
                                )}
                            </InputRightElement>
                        </InputGroup>
                    </form>
                </Box>
                {resources && <ResourcesDisplay resources={resources} />}
            </VStack>
        </Container>
    );
}

export default SearchPage; 