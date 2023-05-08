import { ElementType } from "../Gobal";

export default class CollisionSystem {
    public static calculateDamage(damage: number, Element1: ElementType, Element2: ElementType): number {
        let multiplier = 1; // default multiplier is 1
        switch (Element1) {
          case ElementType.Fire:
            switch (Element2) {
              case ElementType.Water:
                multiplier = 0.5; // Water resists Fire
                break;
              case ElementType.Metal:
                multiplier = 2; // Metal is weak to Fire
                break;
              default:
                break; // no interaction
            }
            break;
          case ElementType.Earth:
            switch (Element2) {
              case ElementType.Air:
                multiplier = 0.5; // Air resists Earth
                break;
              case ElementType.Metal:
                multiplier = 2; // Metal is strong against Earth
                break;
              default:
                break; // no interaction
            }
            break;
          case ElementType.Water:
            switch (Element2) {
              case ElementType.Fire:
                multiplier = 2; // Fire is weak to Water
                break;
              case ElementType.Metal:
                multiplier = 0.5; // Metal resists Water
                break;
              default:
                break; // no interaction
            }
            break;
          case ElementType.Air:
            switch (Element2) {
              case ElementType.Earth:
                multiplier = 2; // Earth is weak to Air
                break;
              case ElementType.Metal:
                multiplier = 0.5; // Metal resists Air
                break;
              default:
                break; // no interaction
            }
            break;
          case ElementType.Metal:
            switch (Element2) {
              case ElementType.Fire:
              case ElementType.Earth:
                multiplier = 0.5; // Metal resists Fire and Earth
                break;
              case ElementType.Water:
              case ElementType.Air:
                multiplier = 2; // Metal is weak to Water and Air
                break;
              default:
                break; // no interaction
            }
            break;
          default:
            break; // no interaction
        }
        // Apply the multiplier to the damage and return the result
        return damage * multiplier;
    }
}
