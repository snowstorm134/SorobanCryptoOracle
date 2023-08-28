import {useAccount, useIsMounted} from "@/hooks";
import {Button} from "@chakra-ui/react";
import {IconWallet} from "@tabler/icons-react";
import {setAllowed} from "@stellar/freighter-api";
import CopyButton from "@/components/CopyButton.tsx";
import {formatShortAddress} from "@/utils/utils.tsx";

export const Wallet = () => {
    const mounted = useIsMounted()
    const account = useAccount()

    return (
        <>
            {mounted && account
                ? <CopyButton
                    str={formatShortAddress(account?.address?.toString())}
                    value={account?.address}
                    size={'xs'}
                />
                : <Button
                    fontSize={'sm'}
                    fontWeight={600}
                    color={'white'}
                    bg={'pink.400'}
                    rightIcon={<IconWallet/>}
                    onClick={setAllowed}
                    _hover={{bg: 'pink.300'}}
                >
                    Connect
                </Button>
            }
        </>
    )
};
