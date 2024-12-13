import { Scene } from 'phaser';
import EventCenter from "@/events/eventCenter";
import { Umi } from "@metaplex-foundation/umi";
import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@/components/Game';

export class WalletConnect extends Scene {
    private umi: Umi | undefined;

    constructor() {
        super('WalletConnect');
    }

    init() {
        console.log("init");
        // Tell the EventCenter that we are ready to receive events.
        EventCenter.emit("ready");
        // Listen for the "umi" event, which is emitted by the NextJS component when the user connects their wallet.
        EventCenter.on("umi", (umi: Umi) => {
            this.umi = umi;
        });
    }

    create() {
        this.add.sprite(0, 0, "background").setOrigin(0, 0).setDisplaySize(DEFAULT_WIDTH, DEFAULT_HEIGHT);
        this.add
            .text(
                DEFAULT_WIDTH / 2,
                DEFAULT_HEIGHT / 6,
                `Connect your wallet to play.`,
                { fontSize: "30px", fontFamily: "futura", color: "black", align: "center" }
            )
            .setOrigin(0.5);
    }

    update() {
        if (this.umi) {
            this.scene.start('MainMenu', { umi: this.umi });
        }
    }
}