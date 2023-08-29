import { AdvancedDynamicTexture, Button, Control, Rectangle, TextBlock } from "@babylonjs/gui";
import { Card } from "../Cards";
import { BehaviorName, gold } from "../Global";
import UpdateableBehavior from "../UpdateableBehavior";

export enum CardType {
    Upgrade,
    Tower,
}

export class CardUI {
    public static activelyDraggedCard: Card | null;
    private _guiTexture: AdvancedDynamicTexture;
    public cardRect: Rectangle;
    public positionX: number = 0;
    public positionY: number = 0;
    private _card: Card;

    /**
     * @param {number} width - The width of the cardRect.
     * @param {number} height - The height of the cardRect.
     */

    constructor(
        card: Card,
        width: number,
        height: number,
    ) {
        // Create the GUI texture
        this._guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        this._card = card;

        // Create the cardRect rectangle
        this.cardRect = new Rectangle();
        this.cardRect.width = `${width}px`;
        this.cardRect.height = `${height}px`;
        this.cardRect.cornerRadius = 10;
        this.cardRect.color = "white";
        this.cardRect.thickness = 3;
        this.cardRect.background = "linear-gradient(to bottom, #bbbbbb, #ffffff)";
        this.cardRect.paddingBottom = "15px";
        this.cardRect.paddingTop = "10px";
        this.cardRect.left = `${this.positionX}px`;
        this.cardRect.top = `${this.positionY}px`;
        this._guiTexture.addControl(this.cardRect);
        this.cardRect.isVisible = false;

        // Create the title text block
        const titleBlock = new TextBlock();
        titleBlock.text = this._card.title;
        titleBlock.fontSize = "24px";
        titleBlock.color = "black";
        titleBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        titleBlock.top = 10;
        this.cardRect.addControl(titleBlock);

        // Create the content text block
        const contentBlock = new TextBlock();
        contentBlock.text = `${this._card.description}\nStats: ${this._card.attributes}`;
        contentBlock.fontSize = "18px";
        contentBlock.color = "black";
        contentBlock.textWrapping = true;
        contentBlock.top = 50;
        contentBlock.left = 5;
        contentBlock.width = 0.9;
        this.cardRect.addControl(contentBlock);

        // Create the button
        const button = Button.CreateSimpleButton("button", "");
        button.width = `${width}px`;
        button.height = `${height}px`;
        button.color = "transparent"; // Make the button text color transparent
        button.background = "transparent"; // Make the button background transparent
        button.cornerRadius = 5;
        button.thickness = 0;
        button.onPointerDownObservable.add(() => {            
            if (gold >= this._card.cost) {
                CardUI.activelyDraggedCard = this._card;
            }
        });
        button.left = `${(width - button.widthInPixels) / 2}px`;
        button.top = `${(height - button.heightInPixels) / 2}px`;
        this.cardRect.addControl(button);
    }

    public hide(): void {
        this.cardRect.isVisible = false;
    }
    
    public show(): void {
        this.cardRect.isVisible = true;
    }

    public setCardLocation(x: number, y: number): void {
        this.positionX = x; 
        this.positionY = y;

        this.cardRect.left = `${this.positionX}px`;
        this.cardRect.top = `${this.positionY}px`;
    }
}

export class CardHandBehavior extends UpdateableBehavior {
    public name = BehaviorName.CardHand;
    
    private _cards: CardUI[];

    constructor(cards: CardUI[] = []) {
        super();
        this._cards = cards;
    }

    public addCard(cardRect: CardUI): void {
        this._cards.push(cardRect);
    }

    public removeCard(cardRect: CardUI): void {
        const index = this._cards.indexOf(cardRect);
        if (index > -1) {
            this._cards.splice(index, 1);
        }
    }

    public hideAllCards(): void {
        this._cards.forEach((cardRect) => cardRect.hide());
    }

    public showAllCards(): void {
        this._cards.forEach((cardRect) => cardRect.show());
    }
}