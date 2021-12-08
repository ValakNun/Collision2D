import { Test, TestingModule } from '@nestjs/testing'
import { Circle } from './models/circle.model'
import { Rect } from './models/rect.model'
import { Line } from './models/line.model'
import { PlentinaController } from './plentina.controller'
import { PlentinaService } from './plentina.service'


describe('PlentinaController', () => {
  let plentinaController: PlentinaController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PlentinaController],
      providers: [PlentinaService],
    }).compile();

    plentinaController = app.get<PlentinaController>(PlentinaController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(plentinaController.healthCheck()).toStrictEqual({"name": "Sumit Kumar Jha"});
    });
  });
});

describe('PlentinaService', () => {
  let plentinaService: PlentinaService;

  beforeEach(async () => {
    plentinaService = new PlentinaService();
  });

  describe('doesCircleAndRectCollide', () => {
    const circle = new Circle(10, 10, 2);

    describe('a colliding circle and rectangle', () => {
      const rectangle = new Rect(9, 9, 1, 1);

      it('should return true', () => {
        expect(circle.collides(rectangle)).toBeTruthy;
      });

      it('should return true', () => {
        expect(rectangle.collides(circle)).toBeTruthy;
      });
    });

    describe('a non-colliding circle and rectangle', () => {
      const rectangle = new Rect(5, 5, 2, 2);

      it('should return false', () => {
        expect(circle.collides(rectangle)).toBeFalsy;
      });

      it('should return false', () => {
        expect(rectangle.collides(circle)).toBeFalsy;
      });
    });
  });

  describe('doesCircleAndCircleCollide', () => {
    const circle1 = new Circle(10, 10, 1);

    describe('two colliding circles', () => {
      [
        new Circle(12, 10, 1),
        new Circle(10, 12, 1),
        new Circle(11, 11, 1),
      ].forEach((circle2) => {
        it(`should return true for ${JSON.stringify(circle2)}`, () => {
          expect(circle1.collides(circle2)).toBeTruthy;
        });
      });
    });

    describe('two non-colliding circles', () => {
      const circle2 = new Circle(5, 5, 1);

      it(`should return false for ${JSON.stringify(circle2)}`, () => {
        expect(circle1.collides(circle2)).toBeFalsy;
      });
    });
  });

  describe('doesRectAndRectCollide', () => {
    const rectangle1 = new Rect(9, 9, 1, 1);

    describe('two colliding rectangles', () => {
      const rectangle2 = new Rect(10, 10, 2, 2);
      it('should return true', () => {
        expect(rectangle1.collides(rectangle2)).toBeTruthy;
      });
    });

    describe('two non-colliding rectangles', () => {
      const rectangle2 = new Rect(4, 4, 2, 2);
      it('should return false', () => {
        expect(rectangle1.collides(rectangle2)).toBeFalsy;
      });
    });
  });
  describe('doesLineAndCircleCollide', () => {
    const line = new Line(0, 5, 5, 0);

    describe('non colliding circle and line', () => {
      const circle1 = new Circle(0, 0, 3);
      it('should return false', () => {
        expect(line.collides(circle1)).toBeFalsy;
      });
    });

    describe('colliding line and circle', () => {
      const circle2 = new Circle(0, 0, 7);
      const circle3 = new Circle(0, 0, 4);
      const line2 = new Line(0, 7, 0, 11);
      it('should return true', () => {
        expect(line.collides(circle2)).toBeTruthy;
      });
      /* Checking https://www.wolframalpha.com/input/?i=intersection+of+x%5E2+%2B+y%5E2+%3D+16+and+x%2By+%3D+5 */
      it('should return true', () => {
        expect(line.collides(circle3)).toBeTruthy;
      });
      it('should return true', () => {
        expect(line2.collides(circle2)).toBeTruthy;
      });
    });
  });
  describe('doesLineAndLineCollide', () => {
    const line = new Line(0, 5, 5, 0);

    describe('non colliding lines', () => {
      const line1 = new Line(0, 0, 0, 3);
      const line4 = new Line(1, 0, 1, 3);
      const line5 = new Line(1, 1, 10, 1);
      const line6 = new Line(1, 2, 10, 2);
      const line7 = new Line(-5, -5, 0, 0);
      const line8 = new Line(1, 1 , 10, 10);
      const line11 = new Line(0, 4, 0, 11);
      it('should return false', () => {
        expect(line.collides(line1)).toBeFalsy;
      });
      it('should return false', () => {
        expect(line1.collides(line4)).toBeFalsy;
      });
      it('should return false', () => {
        expect(line5.collides(line6)).toBeFalsy;
      });
      it('should return false', () => {
        expect(line7.collides(line8)).toBeFalsy;
      });
      it('should return false', () => {
        expect(line1.collides(line11)).toBeFalsy;
      });
    });

    describe('colliding lines', () => {
      const line2 = new Line(0, 0, 0, 7);
      const line3 = new Line(0, 0, 2.5, 2.5);
      const line9 = new Line(0, 0, 10, 10);
      const line10 = new Line(10, 0, 0, 10);
      const line11 = new Line(0, 7, 0, 11);
      it('should return true', () => {
        expect(line.collides(line2)).toBeTruthy;
      });
      it('should return true', () => {
        expect(line.collides(line3)).toBeTruthy;
      });
      it('should return true', () => {
        expect(line9.collides(line10)).toBeTruthy;
      });
      it('should return true', () => {
        expect(line2.collides(line11)).toBeTruthy;
      });
    });

  });
  describe('doesLineAndRectangleCollide', () => {
    const line = new Line(0, 5, 5, 0);
    const tRect = new Rect(0, 0, 10, 10);

    describe('non colliding line and rectangle', () => {
      const rect1 = new Rect(0, 0, 2, 2);
      const line3 = new Line(6, 0, 20, 10);
      it('should return false', () => {
        expect(line.collides(rect1)).toBeFalsy;
      });
      it('should return false', () => {
        expect(line3.collides(tRect)).toBeFalsy;
      });
    });

    describe('colliding line and Rectangle', () => {
      const rect2 = new Rect(0, 0, 10, 10);
      const line1 = new Line(0, 0, 20, 10);
      const line2 = new Line(0, 0, 3, 3);
      const line4 = new Line(0, 0, 10, 0);
      const line5 = new Line(0, 0, 0, 2);
      it('should return true', () => {
        expect(line.collides(rect2)).toBeTruthy;
      });
      it('should return true', () => {
        expect(line1.collides(tRect)).toBeTruthy;
      });
      it('should return true', () => {
        expect(line2.collides(tRect)).toBeTruthy;
      });
      it('should return true', () => {
        expect(line4.collides(tRect)).toBeTruthy;
      });
      it('should return true', () => {
        expect(line5.collides(tRect)).toBeTruthy;
      });
    });
  });

});
