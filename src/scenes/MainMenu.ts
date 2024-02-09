import { Scene, GameObjects } from 'phaser';

export class MainMenu extends Scene {
    background!: GameObjects.Image;
    logo!: GameObjects.Image;
    title!: GameObjects.Text;

    constructor() {
        super('MainMenu');
    }

    create() {
        this.background = this.add.image(320, 240, 'background').setSize(640, 480);

        this.logo = this.add.image(320, 200, 'logo');

        this.title = this.add.text(320, 360, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.input.once('pointerdown', () => {

            this.scene.start('Game');

        });
    }
}