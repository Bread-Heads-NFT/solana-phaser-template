import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { ReactNode, useMemo } from 'react';
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { mplCore } from '@metaplex-foundation/mpl-core';
import { generateSigner, signerIdentity } from '@metaplex-foundation/umi';
import { UmiContext } from './useUmi';
import { mplToolbox } from '@metaplex-foundation/mpl-toolbox';

export const UmiProvider = ({
    children,
}: {
    children: ReactNode;
}) => {
    const wallet = useWallet();
    // let nftStorageToken = process.env.NFTSTORAGE_TOKEN;
    // if (!nftStorageToken || nftStorageToken === 'AddYourTokenHere'){
    //   console.error("Add your nft.storage Token to .env!");
    //   nftStorageToken = 'AddYourTokenHere';
    // }

    const umi = useMemo(() => {
        const u = createUmi(process.env.NEXT_PUBLIC_RPC_URL || "https://api.devnet.solana.com")
            .use(mplCore())
            .use(dasApi())
            .use(mplToolbox());

        if (wallet.connected) {
            return u.use(walletAdapterIdentity(wallet));
        }
        const anonSigner = generateSigner(u);
        return u.use(signerIdentity(anonSigner));
    }, [wallet]);

    return <UmiContext.Provider value={{ umi }}>{children}</UmiContext.Provider>;
};