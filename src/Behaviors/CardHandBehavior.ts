import { AdvancedDynamicTexture, Button, Control, Rectangle, TextBlock } from "@babylonjs/gui";
import { BehaviorName } from "../Global";
import UpdateableBehavior from "../UpdateableBehavior";

export class Card {
    private _guiTexture: AdvancedDynamicTexture;
    private card: Rectangle;

    /**
     * @param {string} title - The title of the card.
     * @param {string} description - The description of the card.
     * @param {string} tooltip - The tooltip of the card.
     * @param {Function} action - The action to be executed when the card is used.
     * @param {number} positionX - The x-coordinate of the position of the card.
     * @param {number} positionY - The y-coordinate of the position of the card.
     * @param {number} width - The width of the card.
     * @param {number} height - The height of the card.
     */

    constructor(
        title: string,
        content: string,
        buttonText: string,
        buttonAction: (eventData: any) => void,
        positionX: number,
        positionY: number,
        width: number,
        height: number
    ) {
        // Create the GUI texture
        this._guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // Create the card rectangle
        this.card = new Rectangle();
        this.card.width = `${width}px`;
        this.card.height = `${height}px`;
        this.card.cornerRadius = 10;
        this.card.color = "white";
        this.card.thickness = 3;
        this.card.background = "linear-gradient(to bottom, #bbbbbb, #ffffff)";
        this.card.paddingBottom = "15px";
        this.card.paddingTop = "10px";
        this.card.left = `${positionX}px`;
        this.card.top = `${positionY}px`;
        this._guiTexture.addControl(this.card);
        this.card.isVisible = false;

        // Create the title text block
        const titleBlock = new TextBlock();
        titleBlock.text = title;
        titleBlock.fontSize = "24px";
        titleBlock.color = "black";
        titleBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        titleBlock.top = 10;
        this.card.addControl(titleBlock);

        // Create the content text block
        const contentBlock = new TextBlock();
        contentBlock.text = content;
        contentBlock.fontSize = "18px";
        contentBlock.color = "black";
        contentBlock.textWrapping = true;
        contentBlock.top = 50;
        contentBlock.left = 5;
        contentBlock.width = 0.9;
        this.card.addControl(contentBlock);

        // Create the button
        const button = Button.CreateSimpleButton("button", buttonText);
        button.width = `${width}px`;
        button.height = `${height}px`;
        button.color = "transparent"; // Make the button text color transparent
        button.background = "transparent"; // Make the button background transparent
        button.cornerRadius = 5;
        button.thickness = 0;
        button.onPointerDownObservable.add(buttonAction);
        button.left = `${(width - button.widthInPixels) / 2}px`;
        button.top = `${(height - button.heightInPixels) / 2}px`;
        this.card.addControl(button);
    }

    public hide(): void {
            this.card.isVisible = false;
    }
    
    public show(): void {
            this.card.isVisible = true;
    }
    }

export class CardHandBehavior extends UpdateableBehavior {
    public name = BehaviorName.CardHand;
    
    private _cards: Card[];

    constructor(cards: Card[] = []) {
        super();
        this._cards = cards;
    }

    public addCard(card: Card): void {
        this._cards.push(card);
    }

    public removeCard(card: Card): void {
        const index = this._cards.indexOf(card);
        if (index > -1) {
            this._cards.splice(index, 1);
        }
    }

    public hideAllCards(): void {
        this._cards.forEach((card) => card.hide());
    }

    public showAllCards(): void {
        this._cards.forEach((card) => card.show());
    }
}