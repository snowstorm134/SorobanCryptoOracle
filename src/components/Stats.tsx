import {Box, Flex, SimpleGrid, Stat, StatLabel, StatNumber, useColorModeValue,} from '@chakra-ui/react'
import {ReactNode} from 'react'
import {IconLocation, IconServer, IconUser} from "@tabler/icons-react";

interface StatsCardProps {
    title: string
    stat: string
    icon: ReactNode
}

function StatsCard(props: StatsCardProps) {
    const {title, stat, icon} = props
    return (
        <Stat
            px={{base: 2, md: 4}}
            py={'5'}
            shadow={'xl'}
            borderWidth="2px"
            borderRadius="lg"
            bg={useColorModeValue('white', 'gray.900')}
            boxShadow={'2xl'}
            rounded={'lg'}>
            <Flex
                justifyContent={'space-between'}
            >
                <Box pl={{base: 2, md: 4}}>
                    <StatLabel fontWeight={'medium'} isTruncated>
                        {title}
                    </StatLabel>
                    <StatNumber fontSize={'2xl'} fontWeight={'medium'}>
                        {stat}
                    </StatNumber>
                </Box>
                <Box
                    my={'auto'}
                    color={useColorModeValue('gray.800', 'gray.200')}
                    alignContent={'center'}>
                    {icon}
                </Box>
            </Flex>
        </Stat>
    )
}

export default function Stats() {
    return (
        <Box maxW="7xl" mx={'auto'} pt={5} px={{base: 2, sm: 12, md: 17}}>
            <SimpleGrid columns={{base: 2, md: 3}} spacing={{base: 1, lg: 8}}>
                <StatsCard title={'Users'} stat={'5,000'} icon={<IconUser size={'3em'}/>}/>
                <StatsCard title={'Servers'} stat={'1,000'} icon={<IconServer size={'3em'}/>}/>
                <StatsCard title={'Datacenters'} stat={'7'} icon={<IconLocation size={'3em'}/>}/>
            </SimpleGrid>
        </Box>
    )
}