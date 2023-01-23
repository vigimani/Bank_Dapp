import { ListItem, Flex, Input, Button } from '@chakra-ui/react'

export default function Events(transaction) {

    return (
        <ListItem mt="2rem" width="100%">
                {transaction.name}
        </ListItem>
    )
}