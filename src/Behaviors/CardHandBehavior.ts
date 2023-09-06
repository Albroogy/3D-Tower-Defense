import { Matrix, Ray } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control, Rectangle, TextBlock } from "@babylonjs/gui";
import { Card } from "../Card";
import { towerCards, upgradeCards } from "../Data/CardData";
import { BehaviorName, engine, gold, scene } from "../Global";
import UpdateableBehavior from "../BabylonUpdateable/UpdateableBehavior";
import { ground } from "../main";

export enum CardType {
    Upgrade,
    Tower,
}

const cardWidth: number = 200;
const cardHeight: number = 300;

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
        card: Card
    ) {
        // Create the GUI texture
        this._guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

        this._card = card;

        // Create the cardRect rectangle
        this.cardRect = new Rectangle();
        this.cardRect.width = `${cardWidth}px`;
        this.cardRect.height = `${cardHeight}px`;
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
        this.cardRect.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        this.cardRect.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;

        // Create the title text block
        const titleBlock = new TextBlock();
        titleBlock.text = this._card.title;
        titleBlock.fontSize = "24px";
        titleBlock.color = "black";
        titleBlock.textHorizontalAlignment = Control.HORIZONTAL_ALIGNMENT_CENTER;
        titleBlock.top = -80;
        this.cardRect.addControl(titleBlock);

        // Create the content text block
        const contentBlock = new TextBlock();
        // contentBlock.text = `${this._card.description}\nStats: ${this._card.attributes}`;
        contentBlock.text = `${this._card.description}`;
        contentBlock.fontSize = "18px";
        contentBlock.color = "black";
        contentBlock.textWrapping = true;
        contentBlock.top = 20;
        contentBlock.left = 5;
        contentBlock.width = 0.9;
        this.cardRect.addControl(contentBlock);

        // Create the button
        const button = Button.CreateSimpleButton("button", "");
        button.width = `${cardWidth}px`;
        button.height = `${cardHeight}px`;
        button.color = "transparent"; // Make the button text color transparent
        button.background = "transparent"; // Make the button background transparent
        button.cornerRadius = 5;
        button.thickness = 0;
        button.onPointerDownObservable.add(() => {            
            if (gold >= this._card.cost) {
                CardUI.activelyDraggedCard = this._card;
            }
        });
        button.left = `${(cardWidth - button.widthInPixels) / 2}px`;
        button.top = `${(cardHeight - button.heightInPixels) / 2}px`;
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

const startX = 0;  // Starting X position (example value)
const startY = 0; // Starting Y position (example value)
const offset = 250;  // Offset distance between each card on the canvas (can be adjusted).

export class CardHandBehavior extends UpdateableBehavior {
    public name = BehaviorName.CardHand;
    
    public _cards: CardUI[];

    constructor() {
        super();
        this._fillCardHand(5);
        this._adjustCardPositions();
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

    private _fillCardHand(count: number): void {
        // Calculate the number of each type of card based on the distribution
        this._cards = [];
        const towerCount = Math.round(0.6 * count);
        const upgradeCount = count - towerCount;
    
        function getRandomFromArray<T>(arr: Array<T>): T {
            const randomIndex = ~~(Math.random() * arr.length);
            return arr[randomIndex];
        }
    
        // Get the specified number of random tower and upgrade cards

        for (let i = 0; i < towerCount; i++) {
            this._cards.push(new CardUI(getRandomFromArray(towerCards)));
        }

        for (let i = 0; i < upgradeCount; i++) {
            this._cards.push(new CardUI(getRandomFromArray(upgradeCards)));
        }
    }
    private _adjustCardPositions(): void {
        this._cards.forEach((cardUI: CardUI, index) => {
            cardUI.setCardLocation((startX + index * offset), startY);
            console.log((startX + index * offset), startY);
        });
    }
}

/**
 * This function is triggered on pointer up event. It determines if a card has been selected, 
 * if yes it creates a tower of the selected element type at the point where the pointer was lifted.
 * If no card was selected, it does nothing.
 * 
 * @param {PointerEvent} eventData - The event data from the pointer up event.
 */
const onPointerUp = (eventData: PointerEvent) => {
    if (!CardUI.activelyDraggedCard) {
        return;
    }

    // Get the mouse position relative to the canvas
    let r: Ray = Ray.CreateNew(scene.pointerX, scene.pointerY,
        engine.getRenderWidth(),
        engine.getRenderHeight(),
        Matrix.Identity(),
        scene.getViewMatrix(),
        scene.getProjectionMatrix()
    );
    const pickingInfo = r.intersectsMesh(ground);
    const finalPos = pickingInfo.pickedPoint;
    if (!finalPos) {
        return;
    }
    finalPos.y = 1.25;

    CardUI.activelyDraggedCard.play(finalPos);
    CardUI.activelyDraggedCard = null;
};

addEventListener("pointerup", onPointerUp);
