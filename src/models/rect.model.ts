import { Circle } from './circle.model'
import { Line } from './line.model';
import { Point, Shape, Type } from './shape.model'

export class Rect implements Shape {
  readonly center: Point;
  readonly width: number;
  readonly height: number;
  readonly type: Type;

  constructor(x: number, y: number, width: number, height: number) {
    this.center = <Point>{ x, y };
    this.type = Type.RECT;
    this.width = width;
    this.height = height;
  }

  pointWithinRectangle(point: Point, rect: Rect): boolean{
    var xMax = rect.center.x + rect.width/2;
    var xMin = rect.center.x - rect.width/2;
    var yMax = rect.center.y + rect.height/2;
    var yMin = rect.center.y - rect.height/2;
    return point.x >= xMin && point.x <= xMax && point.y >= yMin && point.y <= yMax; 
  }

  collides(other: Shape): boolean {
    switch (other.type) {
      case Type.CIRCLE:
        const circ: Circle = Circle.fromShape(other);
        return circ.collides(this);
      case Type.RECT:
        /* Reference: http://www.jeffreythompson.org/collision-detection/rect-rect.php */
        const rect: Rect = Rect.fromShape(other);
        /* Coordinates for left top vertex */
        const r1x = this.center[0] - this.width/2;
        const r1y = this.center[1] + this.height/2;
        const r1w = this.width;
        const r1h = this.height;
        /* Cordinates for left top vertex of second rectangle */
        const r2x = rect.center[0] - rect.width/2;
        const r2y = rect.center[1] + rect.height/2;
        const r2w = rect.width;
        const r2h = rect.height;
        return r1x + r1w >= r2x &&    // r1 right edge past r2 left
        r1x <= r2x + r2w &&           // r1 left edge past r2 right
        r1y + r1h >= r2y &&           // r1 top edge past r2 bottom
        r1y <= r2y + r2h              // r1 bottom edge past r2 top
      case Type.LINE:
        const line : Line = Line.fromShape(other);
        return line.collides(this) 
      default:
        throw new Error(`Invalid shape type!`);
    }
  }

  /**
   * Typecasts a Shape object into this Shape type
   * @param other the Shape object
   * @returns a Rect object
   */
  static fromShape(other: Shape): Rect {
    const polymorph = <any>other;
    if (!polymorph.width || !polymorph.height) {
      throw new Error('Shape is invalid! Cannot convert to a Rectangle');
    }

    return new Rect(
      polymorph.center.x,
      polymorph.center.y,
      polymorph.width,
      polymorph.height,
    );
  }
}
