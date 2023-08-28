import React, {useEffect, useState} from 'react';
import * as contractBtcToken from 'btc-token'
import {
    Badge,
    Box,
    Button,
    Flex,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Heading,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Stack, Text,
    useColorModeValue,
    useToast
} from "@chakra-ui/react";
import {useAccount} from "@/hooks";
import {useForm} from "react-hook-form";

function Mint() {
    const toast = useToast()
    const account = useAccount()

    const [myBalance, setMyBalance] = useState(0)
    const [isLoadingMint, setIsLoadingMint] = useState(false)
    const [isLoadingMyBalance, setIsLoadingMyBalance] = useState(false)

    const {
        reset,
        handleSubmit,
        register,
        formState: {errors},
    } = useForm<{ amount: string }>({
        defaultValues: {
            amount: '',
        },
    })

    const getMyBalance = async () => {
        try {
            setIsLoadingMyBalance(true)
            let txBalance = await contractBtcToken.balance({
                id: account!.address
            })
            setMyBalance(parseInt(txBalance!.toString()) / (10**10))
            setIsLoadingMyBalance(false)
        } catch (e) {
            console.log(e)
            setIsLoadingMyBalance(false)
        }
    }

    const onSubmitMint = async (formData: { amount: string }): Promise<void> => {
        setIsLoadingMint(true)
        try {
            let txMint = await contractBtcToken.mint({
                amount: BigInt(parseInt(formData!.amount) * (10**10)),
                to: account!.address
            }, {fee: 100, secondsToWait: 20, responseType: "full"})

            console.log(txMint)

            toast({
                title: 'Mint Successfully!',
                description: "",
                position: 'bottom-right',
                status: 'success',
                duration: 3000,
                isClosable: true,
                variant: 'subtle'
            })

            getMyBalance()

            reset({amount: ''})
            setIsLoadingMint(false)
        } catch (e) {
            console.log(e)
            reset({amount: ''})
            setIsLoadingMint(false)
            toast({
                title: 'Mint Error!',
                description: "",
                position: 'bottom-right',
                status: 'error',
                duration: 3000,
                isClosable: true,
                variant: 'subtle'
            })
        }
    }

    useEffect(() => {
        if (account) {
            getMyBalance()
        }
    }, [account]);

    return (
        <Stack>
            <Box
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={'2xl'}
                borderWidth="1px"
                rounded="lg"
                p={6}
            >
                <>
                    <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
                        Mint
                    </Heading>
                    <Stack>
                        <form onSubmit={handleSubmit(onSubmitMint)}>
                            <Flex gap={3} align={'flex-end'}>
                                <FormControl isInvalid={!!errors.amount} id="bio" mt={1}>
                                    <FormLabel
                                        fontSize="sm"
                                        fontWeight="md"
                                        color="gray.700"
                                        _dark={{color: 'gray.50'}}
                                    >
                                        {/*Change epoch interval (sec)*/}
                                    </FormLabel>

                                    <NumberInput>
                                        <NumberInputField
                                            shadow="sm"
                                            disabled={isLoadingMint}
                                            fontSize={{sm: 'sm',}}
                                            placeholder="Amount"
                                            {...register('amount', {
                                                required: 'This is required',
                                                min: {value: 0.000000001, message: 'Enter a value greater than 0!'},
                                            })}
                                        />
                                        <NumberInputStepper>
                                            <NumberIncrementStepper/>
                                            <NumberDecrementStepper/>
                                        </NumberInputStepper>
                                    </NumberInput>

                                    <FormErrorMessage>
                                        {errors.amount && errors.amount.message}
                                    </FormErrorMessage>
                                </FormControl>

                                <Button
                                    isLoading={isLoadingMint}
                                    type='submit'
                                    w="7rem"
                                    colorScheme="blue"
                                >
                                    Send
                                </Button>
                            </Flex>
                        </form>
                    </Stack>
                </>
            </Box>
            <Box
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={'2xl'}
                borderWidth="1px"
                rounded="lg"
                p={3}
                mb={20}
            >
                <>
                    <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
                        Your balance
                    </Heading>
                    <Flex align={'center'} justify={'center'}>
                        <Text fontSize='2xl' fontWeight='bold'>
                            <Badge ml='1' fontSize='1em' colorScheme='green'>
                                {myBalance} BTC
                            </Badge>
                        </Text>
                    </Flex>
                </>
            </Box>
        </Stack>
    );
}

export default Mint;
