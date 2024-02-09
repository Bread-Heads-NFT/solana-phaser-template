'use client';
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

  const adapter = useMemo(() => new TipLinkWalletAdapter(), []);

  return (
    <main>
      < ConnectionProvider endpoint={endpoint} >
        <WalletProvider wallets={[adapter]} autoConnect>
          <TipLinkWalletModalProvider title="cHack" logoSrc="/dapp_icon.png" theme={TipLinkModalTheme.DARK}>
            <div className="p-5 w-full">
              <WalletMultiButton className="ml-auto" />
              <Game />
            </div>
          </TipLinkWalletModalProvider>
        </WalletProvider>
      </ConnectionProvider >
    </main >
  )
}
