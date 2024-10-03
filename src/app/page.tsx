'use client';
import { UmiProvider } from "@/providers/UmiProvider";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { clusterApiUrl } from "@solana/web3.js";
import { TipLinkWalletAdapter } from "@tiplink/wallet-adapter";
import { TipLinkModalTheme, TipLinkWalletModalProvider, WalletDisconnectButton, WalletMultiButton } from "@tiplink/wallet-adapter-react-ui";
import dynamic from "next/dynamic";
import { useMemo } from "react";

const Game = dynamic(() => import('@/components/Game'), { ssr: false });

require('@tiplink/wallet-adapter-react-ui/styles.css');

export default function Home() {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  const adapter = useMemo(() => new TipLinkWalletAdapter({
    title: "Solana Phaser Template",
    clientId: "694bf97c-d2ac-4dfc-a786-a001812658df",
    theme: 'dark'
  }), []);

  return (
    <main>
      < ConnectionProvider endpoint={endpoint} >
        <WalletProvider wallets={[adapter]} autoConnect>
          <TipLinkWalletModalProvider title="Hello Phaser" logoSrc="/assets/logo.png" theme={TipLinkModalTheme.DARK}>
            <UmiProvider>
              <div className="p-5 w-full">
                <WalletMultiButton className="ml-auto" />
                <Game />
              </div>
            </UmiProvider>
          </TipLinkWalletModalProvider>
        </WalletProvider>
      </ConnectionProvider >
    </main >
  )
}
