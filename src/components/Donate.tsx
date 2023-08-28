import React, {useEffect, useState} from 'react';
import * as contractDonation from 'donation-contract'
import {Box, Flex, Spinner, Stack, Stat, StatGroup, StatLabel, StatNumber, useColorModeValue} from "@chakra-ui/react";
import {useAccount} from "@/hooks";
import DepositForm from "@/components/DepositForm.tsx";
import WithdrawForm from "@/components/WithdrawForm.tsx";
import * as contractOracleBtc from "oracle-contract";
import {EpochData, PairInfo} from "oracle-contract";

const Donate = () => {
    const account = useAccount()

    const [isLoadingDeposits, setIsLoadingDeposits] = useState(false)
    const [deposits, setDeposits] = useState(0)
    const [contractBalance, setContractBalance] = useState(0)
    const [pairInfo, setPairInfo] = useState<PairInfo & EpochData | null>(null)
    const [isLoadingPairInfo, setIsLoadingPairInfo] = useState<boolean>(false)
    const [isLoadingRecipient, setIsLoadingRecipient] = useState(false)
    const [recipient, setRecipient] = useState<any>(null)

    const getPairInfo = async () => {
        setIsLoadingPairInfo(true)
        try {
            let txPairInfo = await contractOracleBtc.getPairInfo()
            console.log(txPairInfo)

            let txPairDataAtEpoch = await contractOracleBtc.getPairDataAtEpoch({
                epoch_nr: txPairInfo?.last_epoch
            })

            console.log(txPairDataAtEpoch)

            setPairInfo({...txPairInfo, ...txPairDataAtEpoch})
            console.log({...txPairInfo, ...txPairDataAtEpoch})
            setIsLoadingPairInfo(false)
        } catch (e) {
            console.log(e)
            setIsLoadingPairInfo(false)
        }
    }

    useEffect(() => {
        if (contractOracleBtc)
            getPairInfo()
    }, [contractOracleBtc]);

    const getTotalDeposits = async () => {
        try {
            setIsLoadingDeposits(true)
            let txTotalDeposits = await contractDonation.getTotalDeposits()
            console.log(txTotalDeposits)
            setDeposits(parseInt(txTotalDeposits?.toString()) / (10 ** 10))
            setIsLoadingDeposits(false)
        } catch (e) {
            console.log(e)
            setIsLoadingDeposits(false)
        }
    }

    const getContractBalance = async () => {
        try {
            setIsLoadingDeposits(true)
            let txContractBalance = await contractDonation.getContractBalance()
            setContractBalance(parseInt(txContractBalance?.toString()) / (10 ** 10))
            setIsLoadingDeposits(false)
        } catch (e) {
            console.log(e)
            setIsLoadingDeposits(false)
        }
    }

    const getRecipient = async () => {
        try {
            setIsLoadingRecipient(true)
            let txRecipient = await contractDonation.recipient()
            console.log(txRecipient)
            setRecipient(txRecipient)
            setIsLoadingRecipient(false)
        } catch (e) {
            console.log(e)
            setIsLoadingRecipient(false)
        }
    }

    const getData = () => {
        getTotalDeposits()
        getContractBalance()
    }

    useEffect(() => {
        if (contractDonation) {
            getData()
            getRecipient()
        }
    }, [contractDonation]);

    return (
        <Stack>
            <Box
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow={'2xl'}
                borderWidth="1px"
                rounded="lg"
                p={6}
            >
                {(isLoadingDeposits || isLoadingPairInfo)
                    ? <Flex justify={'center'} align={'center'}>
                        <Spinner size='lg'/>
                    </Flex>
                    : <StatGroup>
                        <Stat>
                            <StatLabel>Total deposits</StatLabel>
                            <StatNumber>{deposits}</StatNumber>
                        </Stat>
                        {pairInfo &&
                            <Stat>
                                <StatLabel>Contract balance</StatLabel>
                                <StatNumber>{contractBalance}</StatNumber>
                                {/*<StatNumber>{(pairInfo?.value / 10 ** 10) * contractBalance}</StatNumber>*/}
                            </Stat>
                        }
                    </StatGroup>
                }
            </Box>
            {isLoadingPairInfo
                ? <Flex style={{marginTop: 15}} justify={'center'} align={'center'}>
                    <Spinner size='lg'/>
                </Flex>
                : <>
                    <DepositForm recipient={recipient} pairInfo={pairInfo} submitFormCallback={getData}/>
                    <WithdrawForm recipient={recipient} pairInfo={pairInfo} submitFormCallback={getData}/>
                </>
            }
        </Stack>
    );
};

export default Donate;