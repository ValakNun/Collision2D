import { Rect } from './rect.model';
import { Circle } from './circle.model';
import { distanceBetween, Point, Shape, Type } from './shape.model'


export class Line implements Shape {
  readonly center: Point;
  readonly otherEnd: Point;
  readonly type: Type;

  constructor(x: number, y: number, z: number, w: number) {
    this.center = <Point>{ x, y };
    x = z;
    y = w;
    this.otherEnd = <Point>{ x, y };
    this.type = Type.LINE;
  }


  pointBetweenPoints(point: Point, a: Point, b: Point): boolean {
    var px = point.x - a.x;
    var py = point.y - a.y;
    var dx = b.x - a.x;
    var dy = b.y - a.y;
    var dot = px * dx + py * dy;
    return dot >= 0 && (px * px + py * py) <= (dx * dx + dy * dy);
  }

  collides(other: Shape): boolean {
    switch (other.type) {
      case Type.CIRCLE:
        const circ: Circle = Circle.fromShape(other);
        /* Reference: Wiki on vector projection */
        /* First check whether any of the endpoints lie within the circle */
        if (circ.pointWithinCircle(this.center, circ) || circ.pointWithinCircle(this.otherEnd, circ)) {
          return true;
        }
        var x1 = this.center.x;
        var y1 = this.center.y;
        var x2 = this.otherEnd.x;
        var y2 = this.otherEnd.y;
        var cx = circ.center.x;
        var cy = circ.center.y;

        /* Vector d */
        var dx = x2 - x1;
        var dy = y2 - y1;
        var DlenSq = dx * dx + dy * dy;

        /* Vector lc */
        var lcx = cx - x1;
        var lcy = cy - y1;

        /* Project vector lc onto vector d, resulting in vector p */
        var dot = dx * lcx + dy * lcy;
        if (DlenSq > 0) {
          var px = dot * dx / (DlenSq);
          var py = dot * dy / (DlenSq);
        }

        /* Coordinates for the foot of the perpendicular */
        var foot = [0, 0];
        foot[0] = x1 + px;
        foot[1] = y1 + py;

        var PlenSq = px * px + py * py;

        return circ.pointWithinCircle({ x: foot[0], y: foot[1] }, circ) && (px * dx + py * dy) >= 0 && PlenSq <= DlenSq
      case Type.LINE:
        const line2: Line = Line.fromShape(other);
        /* Check if one line is parallel to other or not */
        var x1 = this.center.x;
        var y1 = this.center.y;
        var x2 = this.otherEnd.x;
        var y2 = this.otherEnd.y;
        var w1 = line2.center.x;
        var z1 = line2.center.y;
        var w2 = line2.otherEnd.x;
        var z2 = line2.otherEnd.y;
        /* Equation of line1 in form a1*x+b1*y=c1 */
        var a1 = y2 - y1;
        var b1 = x1 - x2;
        var c1 = x1 * (y2 - y1) + y1 * (x1 - x2);
        /* Equation of line2 in form a2*x + b2*y = c2 */
        var a2 = z2 - z1;
        var b2 = w1 - w2;
        var c2 = w1 * (z2 - z1) + z1 * (w1 - w2);
        /* Determining Determinant for Cramer's rule */
        var det = a1 * b2 - b1 * a2;
        /* If lines are parallel and along same direction, check whether endpoints of one lie on other */
        if (det == 0) {
          if (c1 == c2) {
            if (this.pointBetweenPoints(this.center, line2.center, line2.otherEnd) || this.pointBetweenPoints(this.otherEnd, line2.center, line2.otherEnd)) {
              return true;
            }
            else {
              return false;
            }
          }
          else {
            return false;
          }
        }
        else {
          /* Check point of intersection lies on both line segments */
          var ix = (c1 * b2 - b1 * c2) / det;
          var iy = (a1 * c2 - c1 * a2) / det;
          if (this.pointBetweenPoints({ x: ix, y: iy }, this.center, this.otherEnd) && this.pointBetweenPoints({ x: ix, y: iy }, line2.center, line2.otherEnd)) {
            return true;
          }
          else {
            return false;
          }
        }

      case Type.RECT:
        const rect: Rect = Rect.fromShape(other);
        /* Check whether any of endpoints lie within the Rectangle */
        if (rect.pointWithinRectangle(this.center, rect) || rect.pointWithinRectangle(this.otherEnd, rect)) {
          return true;
        }
        else {
          /* Check line-segment intersection with four line segments */
          const line1 = new Line(rect.center.x - rect.width / 2, rect.center.y - rect.height / 2, rect.center.x - rect.width / 2, rect.center.y + rect.height / 2);
          const line2 = new Line(rect.center.x + rect.width / 2, rect.center.y - rect.height / 2, rect.center.x + rect.width / 2, rect.center.y + rect.height / 2);
          const line3 = new Line(rect.center.x - rect.width / 2, rect.center.y + rect.height / 2, rect.center.x + rect.width / 2, rect.center.y + rect.height / 2);
          const line4 = new Line(rect.center.x - rect.width / 2, rect.center.y - rect.height / 2, rect.center.x + rect.width / 2, rect.center.y - rect.height / 2);
          if (this.collides(line1) || this.collides(line2) || this.collides(line3) || this.collides(line4)) {
            return true;
          }
          else {
            return false;
          }
        }
      default:
        throw new Error(`Invalid shape type!`);
    }
  }

  /**
   * Typecasts a Shape object into this Shape type
   * @param other the Shape object
   * @returns a Circle object
   */
  static fromShape(other: Shape): Line {
    const polymorph = <any>other;
    if (!polymorph.otherEnd) {
      throw new Error('Shape is invalid! Cannot convert to a Line');
    }

    return new Line(polymorph.center.x, polymorph.center.y, polymorph.otherEnd.x, polymorph.otherEnd.y);
  }
}
