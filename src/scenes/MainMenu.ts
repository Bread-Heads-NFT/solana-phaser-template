import { DEFAULT_HEIGHT, DEFAULT_WIDTH } from '@/components/Game';
import { Umi } from '@metaplex-foundation/umi';
import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene {
    private umi!: Umi;
    background!: GameObjects.Image;
    logo!: GameObjects.Image;
    title!: GameObjects.Text;
    welcome!: GameObjects.Text;

    constructor() {
        super('MainMenu');
    }

    init(args: { umi: Umi }) {
        this.umi = args.umi;
    }

    create() {
        this.background = this.add.image(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 2, 'background').setSize(DEFAULT_WIDTH, DEFAULT_HEIGHT);

        this.logo = this.add.image(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT / 4, 'logo');

        this.welcome = this.add.text(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT * 0.4, 'Welcome', {
            fontFamily: 'Arial Black', fontSize: 32, color: '#ffffff',
            stroke: '#000000', strokeThickness: 6,
            align: 'center'
        }).setOrigin(0.5);

        this.welcome = this.add.text(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT * 0.5, this.umi.identity.publicKey.toString(), {
            fontFamily: 'Arial Black', fontSize: 24, color: '#0f0',
            stroke: '#000000', strokeThickness: 4,
            align: 'center'
        }).setOrigin(0.5);

        this.title = this.add.text(DEFAULT_WIDTH / 2, DEFAULT_HEIGHT * 0.7, 'Start Game', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game', { umi: this.umi });

        });
    }
}