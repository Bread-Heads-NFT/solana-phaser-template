import { DEFAULT_WIDTH } from '@/components/Game';
import { DasApiInterface } from '@metaplex-foundation/digital-asset-standard-api';
import { create } from '@metaplex-foundation/mpl-core';
import { createFungible, mintV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata';
import { transferSol } from '@metaplex-foundation/mpl-toolbox';
import { generateSigner, publicKey, RpcInterface, sol, Umi } from '@metaplex-foundation/umi';
import { Scene } from 'phaser';

export class Game extends Scene {
    private umi!: Umi;
    camera!: Phaser.Cameras.Scene2D.Camera;
    background!: Phaser.GameObjects.Image;
    msg_text!: Phaser.GameObjects.Text;
    player!: Phaser.Physics.Arcade.Sprite;
    nftStar!: Phaser.Physics.Arcade.Sprite;
    tokenStar!: Phaser.Physics.Arcade.Sprite;
    transferStar!: Phaser.Physics.Arcade.Sprite;
    showNftsStar!: Phaser.Physics.Arcade.Sprite;
    platforms!: Phaser.Physics.Arcade.StaticGroup;
    nfts!: Phaser.Physics.Arcade.Group;
    stars!: Phaser.Physics.Arcade.Group;
    cursors!: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor() {
        super('Game');
    }

    init(args: { umi: Umi }) {
        this.umi = args.umi;
    }

    create() {
        this.createAnims();

        this.add.image(400, 300, 'sky');

        this.platforms = this.physics.add.staticGroup();
        this.nfts = this.physics.add.group({ collideWorldBounds: true });

        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        this.platforms.create(DEFAULT_WIDTH / 2, 200, 'ground').setScale(.5, 1).refreshBody();
        this.platforms.create(125, 300, 'ground').setScale(.5, 1).refreshBody();
        this.platforms.create(DEFAULT_WIDTH - 125, 300, 'ground').setScale(.5, 1).refreshBody();
        this.platforms.create(DEFAULT_WIDTH / 2, 400, 'ground').setScale(.5, 1).refreshBody();

        this.add.text(DEFAULT_WIDTH / 2, 200, 'Transfer SOL', {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5);
        this.add.text(125, 300, 'Mint Token', {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5);
        this.add.text(DEFAULT_WIDTH - 125, 300, 'Show NFTs', {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5);
        this.add.text(DEFAULT_WIDTH / 2, 400, 'Mint NFT', {
            fontFamily: 'Arial Black', fontSize: 18, color: '#ffffff',
            stroke: '#000000', strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5);

        this.player = this.physics.add.sprite(DEFAULT_WIDTH / 2, 450, 'dude');

        this.player.setCollideWorldBounds(true);

        // @ts-ignore
        this.cursors = this.input.keyboard.createCursorKeys();

        this.nftStar = this.physics.add.sprite(DEFAULT_WIDTH / 2, 350, 'star');
        this.tokenStar = this.physics.add.sprite(125, 250, 'star');
        this.transferStar = this.physics.add.sprite(DEFAULT_WIDTH / 2, 150, 'star');
        this.showNftsStar = this.physics.add.sprite(DEFAULT_WIDTH - 125, 250, 'star');

        // @ts-ignore
        this.nftStar.body.allowGravity = false;
        // @ts-ignore
        this.tokenStar.body.allowGravity = false;
        // @ts-ignore
        this.transferStar.body.allowGravity = false;
        // @ts-ignore
        this.showNftsStar.body.allowGravity = false;

        this.physics.add.collider(
            this.player,
            this.platforms
        );

        this.physics.add.collider(this.nfts, this.platforms);

        this.physics.add.overlap(this.player, this.nftStar, this.collectNftStar, undefined, this);
        this.physics.add.overlap(this.player, this.tokenStar, this.collectTokenStar, undefined, this);
        this.physics.add.overlap(this.player, this.transferStar, this.collectTransferStar, undefined, this);
        this.physics.add.overlap(this.player, this.showNftsStar, this.collectShowNftsStar, undefined, this);
    }

    update() {
        const { left, right, up } = this.cursors;

        if (left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }
        else if (right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        // @ts-ignore
        if (up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-600);
        }
    }


    createAnims() {
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
    }

    collectNftStar(
        player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Tilemaps.Tile,
        star: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Tilemaps.Tile
    ) {
        // @ts-ignore
        star.disableBody(true, true);

        create(this.umi, {
            asset: generateSigner(this.umi),
            name: 'Year of Bread Demo',
            uri: 'https://bafkreig67ecw6u2r5ogzgal4xjvhehuz5fyly2o4abokulyx7hncm3ck6e.ipfs.nftstorage.link/'
        }).sendAndConfirm(this.umi).then((res) => {
            console.log(res);
        });
    }

    collectTokenStar(
        player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Tilemaps.Tile,
        star: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Tilemaps.Tile
    ) {
        // @ts-ignore
        star.disableBody(true, true);

        const tokenMint = generateSigner(this.umi);
        createFungible(this.umi, {
            name: 'Bread Token',
            uri: 'https://xn5nn6e4qbjwvwruwgkqu55rdtd6xxouxuzjnkz44copbxhzmisq.arweave.net/u3rW-JyAU2raNLGVCnexHMfr3dS9MparPOCc8Nz5YiU/',
            sellerFeeBasisPoints: {
                basisPoints: 0n,
                identifier: '%',
                decimals: 2,
            },
            decimals: 9,
            mint: tokenMint,
        }).add(
            mintV1(this.umi, {
                mint: tokenMint.publicKey,
                tokenStandard: TokenStandard.Fungible,
                tokenOwner: this.umi.identity.publicKey,
                amount: 1000,
            })).sendAndConfirm(this.umi).then((res) => {
                console.log(res);
            });
    }

    collectTransferStar(
        player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Tilemaps.Tile,
        star: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Tilemaps.Tile
    ) {
        // @ts-ignore
        star.disableBody(true, true);

        transferSol(this.umi, {
            destination: publicKey('5Z5UuzZhqUfz48tsoBn8JczTgUh3KbRhoPX8qwSXAve1'),
            amount: sol(0.001),
        }).sendAndConfirm(this.umi).then((res) => {
            console.log(res);
        });
    }

    collectShowNftsStar(
        player: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Tilemaps.Tile,
        star: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Physics.Arcade.Body | Phaser.Tilemaps.Tile
    ) {
        this.showNfts().then(() => console.log('showed nfts'));
        // @ts-ignore
        star.disableBody(true, true);
    }

    async showNfts() {
        const rpc = this.umi.rpc as RpcInterface & DasApiInterface;
        const res = await rpc.getAssetsByOwner({
            owner: this.umi.identity.publicKey,
            limit: 10,
        });

        // For each asset, add an object to the scene with the asset's image.
        res.items.forEach((asset) => {
            if (asset.content.links && "image" in asset.content.links) {
                // Load the image from the asset's content.
                this.load.image(asset.id, asset.content.links["image"] as string);
                // Once the image is loaded, add it to the scene at a random X offset.
                this.load.on(`filecomplete-image-${asset.id}`, () => {
                    this.nfts.add(this.physics.add.image(Phaser.Math.Between(0, DEFAULT_WIDTH), 0, asset.id)
                        .setDisplaySize(50, 50));
                });
                this.load.start();
            }
        });
    }
}