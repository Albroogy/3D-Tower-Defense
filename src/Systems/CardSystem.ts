import { Matrix, Ray } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control, Rectangle, TextBlock } from "@babylonjs/gui";
import { canvas, scene, engine, ground } from "../app"
import { TagBehavior } from "../Behaviors/TagBehavior";
import TowerBehavior from "../Behaviors/TowerBehaviour";
import { ElementType, objects, Tag } from "../Gobal";
import UpdateableNode from "../UpdateableNode";

class CardUI {
    private guiTexture: AdvancedDynamicTexture;
    private card: Rectangle;

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
    this.guiTexture = AdvancedDynamicTexture.CreateFullscreenUI("UI");

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
    this.guiTexture.addControl(this.card);

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
  
  // Usage:
  const cardUI = new CardUI(
    "Fire Tower",
    "Damage: 2\nHealth: 3\nAbility: None",
    "Does fire damage",
    (eventData) => {
        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerup", onPointerUp);
    },
    canvas.width/2 - 150, // positionX
    canvas.height/2 - 150, // positionY
    200, // width in pixels
    300 // height in pixels
  );
  


  
function onPointerMove(eventData: PointerEvent) {
    const mouseX = eventData.clientX;
    const mouseY = eventData.clientY;

    // Update the card position
    // card.left = `${mouseX}px`;
    // card.top = `${mouseY}px`;
};

const onPointerUp = (eventData: PointerEvent) => {
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
    finalPos.y = 1.25;
    const tower = new UpdateableNode("TowerNode", scene);
    tower.position = finalPos;
    const tagBehavior = new TagBehavior([Tag.Tower]);
    const towerBehavior = new TowerBehavior(2.5, 100, ElementType.Fire);
    tower.addBehavior(towerBehavior);
    tower.addBehavior(tagBehavior);

    objects.push(tower);
};


class CardHand {
    private cards: CardUI[] = [];
  
    addCard(card: CardUI): void {
      this.cards.push(card);
    }
  
    removeCard(card: CardUI): void {
      const index = this.cards.indexOf(card);
      if (index > -1) {
        this.cards.splice(index, 1);
      }
    }
  
    hideAllCards(): void {
      this.cards.forEach((card) => card.hide());
    }
  
    showAllCards(): void {
      this.cards.forEach((card) => card.show());
    }
}