import React, {useState} from 'react';
import * as contractDonation from 'donation-contract'
import {
    Alert,
    AlertIcon,
    AlertTitle,
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
    Stack,
    Text,
    useColorModeValue,
    useToast
} from "@chakra-ui/react";
import {useAccount} from "@/hooks";
import {useForm} from "react-hook-form";
import {EpochData, PairInfo} from "oracle-contract";

const DepositForm = ({submitFormCallback, pairInfo, recipient}: {
    submitFormCallback: any,
    recipient: any,
    pairInfo: PairInfo & EpochData | null
}) => {
    const toast = useToast()
    const account = useAccount()
    const [isLoadingDeposit, setIsLoadingDeposit] = useState(false)
    const [calculateValue, setCalculateValue] = useState(0)

    const {
        reset,
        handleSubmit,
        getValues,
        register,
        formState: {errors},
    } = useForm<{ amount: string }>({
        defaultValues: {
            amount: '',
        },
    })

    const onSubmitDeposit = async (formData: { amount: string }): Promise<void> => {
        if (account) {
            setIsLoadingDeposit(true)
            try {
                let txDeposit = await contractDonation.deposit({
                    amount: BigInt(parseInt(formData!.amount) * (10 ** 10)),
                    user: account!.address
                }, {fee: 100, secondsToWait: 20, responseType: "full"})

                toast({
                    title: 'Deposit Successfully!',
                    description: "",
                    position: 'bottom-right',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                    variant: 'subtle'
                })

                if (submitFormCallback) {
                    setTimeout(() => {
                        submitFormCallback()
                    }, 1000)
                }

                reset({amount: ''})
                setIsLoadingDeposit(false)
            } catch (e) {
                console.log(e)
                reset({amount: ''})
                setIsLoadingDeposit(false)
                toast({
                    title: 'Deposit Error!',
                    description: "",
                    position: 'bottom-right',
                    status: 'error',
                    duration: 3000,
                    isClosable: true,
                    variant: 'subtle'
                })
            }
        } else {
            toast({
                title: 'Connect wallet!',
                description: "",
                position: 'bottom-right',
                status: 'error',
                duration: 3000,
                isClosable: true,
                variant: 'subtle'
            })
        }
    }

    const handlerCalculateValue = () => {
        if (pairInfo && getValues) {
            // @ts-ignore
            setCalculateValue(Number(Number(getValues()!.amount) / (Number(pairInfo!.value) / (10 ** 5))).toFixed(12))
        }
    }

    return (
        <Box
            bg={useColorModeValue('white', 'gray.800')}
            boxShadow={'2xl'}
            borderWidth="1px"
            rounded="lg"
            p={6}
        >
            <>
                <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
                    Deposit (BTC)
                </Heading>
                <Stack>
                    {account?.address !== recipient
                        ? <form onSubmit={handleSubmit(onSubmitDeposit)}>
                            <Flex gap={3} align={'flex-start'}>
                                <FormControl isInvalid={!!errors.amount} id="bio" mt={1}>
                                    <FormLabel
                                        fontSize="sm"
                                        fontWeight="md"
                                        color="gray.700"
                                        _dark={{color: 'gray.50'}}
                                    >
                                    </FormLabel>

                                    <NumberInput>
                                        <NumberInputField
                                            shadow="sm"
                                            disabled={isLoadingDeposit}
                                            fontSize={{sm: 'sm',}}
                                            {...register('amount', {
                                                required: 'This is required',
                                                min: {value: 0.000000001, message: 'Enter a value greater than 0!'},
                                            })}
                                            placeholder="Amount"
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
                                    style={{marginTop: 10}}
                                    isLoading={isLoadingDeposit}
                                    type='submit'
                                    w="7rem"
                                    colorScheme="blue"
                                >
                                    Deposit
                                </Button>
                            </Flex>
                            <Flex style={{marginTop: 10}} align={'center'} justify={'space-between'}>
                                <Button
                                    isLoading={isLoadingDeposit}
                                    type='button'
                                    w="7rem"
                                    size={'sm'}
                                    variant={'outline'}
                                    colorScheme="blue"
                                    onClick={handlerCalculateValue}
                                >
                                    Calculate
                                </Button>

                                <Text fontSize='xl' fontWeight='bold'>
                                    <Badge ml='1' fontSize='0.8em' colorScheme='blue'>
                                        {calculateValue} BTC
                                    </Badge>
                                </Text>
                            </Flex>
                        </form>
                        : <Alert status='info'>
                            <AlertIcon/>
                            <AlertTitle>Not permit</AlertTitle>
                        </Alert>
                    }
                </Stack>
            </>
        </Box>
    );
};

export default DepositForm;
