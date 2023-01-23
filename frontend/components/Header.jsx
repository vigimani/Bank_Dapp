import { Flex, Box } from '@chakra-ui/react';
import { MetamaskButton } from './MetamaskButton';

export const Header = () => {
    return (
        <Flex  h="10vh" p="0rem" justifyContent="space-between" alignItems="center">
        <Box w="100%" h="100px" bgGradient="linear(to-t, green.200, pink.500)" >
            <Flex h="10vh" p="2rem" justifyContent="space-between" alignItems="center">
            <MetamaskButton />
            </Flex>
            </Box>
        </Flex>
    )
}
