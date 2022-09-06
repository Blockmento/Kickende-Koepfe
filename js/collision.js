class CD {
  static teste(Fig1 = new Figur(), Fig2 = new Figur()) {
    //Fig1: bewegtes Objekt
    //Fig2: unbewegtes Objekt
    console.log("test");
    let j = 0;
    if (!isNaN(Fig1.Radius) && isNaN(Fig2.Radius)) {
      console.log("test2");
      //CD für eine Kreis (Ball) und eine Beliebige andere Figur mit mindestens 2 Ecken
      //a,b: zwei Punkte von Figur 2
      //p: Mittelpunkt von Figur 1
      //d: Entfernung zwischen ab und p
      //g: Gerade durch a,b
      //h: Gerade durch M, mit v

      for (let i = 0; i < Fig2.Ecken.length; i++) {
        if (i == Fig2.Ecken.length - 1) j = 0;
        else j = i + 1;

        let ab = new Vektor(
          Fig2.Ecken[j].x - Fig2.Ecken[i].x,
          Fig2.Ecken[j].y - Fig2.Ecken[i].y
        );

        let g = new Gerade(Fig2.Ecken[j].zuVektor(), ab);
        let h = new Gerade(Fig1.Ecken.zuVektor(), Fig1.Geschwindigkeit);

        let t1 = Fig1.Radius / ab.Betrag();
        let t2 = Fig1.Radius / Fig1.Geschwindigkeit.Betrag();

        console.log(t1, t2);

        let s = g.Schnittpunkt(h);
        console.log(s);
        let re = (Fig1.Radius ^ 2) / (g.r.x + g.r.y);
        if (-re < s.λg && s.λg < 1 + re) {
        }
      }
    }
  }
}

class CD_old {
  //Collision Detection
  constructor(Fig1, Fig2) {
    //this.Fig1 = Fig1; //bewegtes Objekt
    //this.Fig2 = Fig2; //unbewegtes Objekt
    //this.teste();
  }
  static teste(Fig1 = new Figur(), Fig2 = new Figur(), v = new Vektor()) {
    //Fig1: bewegtes Objekt
    //Fig2: unbewegtes Objekt
    //v: Bewegungsvektor von Fig1

    Fig1.x += v.x;
    Fig1.y += v.y;

    let j = 0;
    if (!isNaN(Fig1.Radius) && isNaN(Fig2.Radius)) {
      //CD für eine Kreis (Ball) und eine Beliebige andere Figur mit mindestens 2 Ecken
      //a,b: zwei Punkte von Figur 2
      //p: Mittelpunkt von Figur 1
      //c: Sockelpunkt zum Vektor mit der geringsten Entfernung zu p; cp ist Orthogonal zu ab
      //d: Entfernung zwischen ab und p (Betrag von cp)
      for (let i = 0; i < Fig2.Ecken.length; i++) {
        if (i == Fig2.Ecken.length - 1) j = 0;
        else j = i + 1;

        let ab = new Vektor(
          Fig2.Ecken[j].x - Fig2.Ecken[i].x,
          Fig2.Ecken[j].y - Fig2.Ecken[i].y
        );
        let ap = new Vektor(
          Fig1.Ecken[0].x - Fig2.Ecken[i].x,
          Fig1.Ecken[0].y - Fig2.Ecken[i].y
        );

        //Faktor zum erreichen des Sockelpunktes für den kürzesten Vektor zwischen ab und p
        let t = this.Punktprodukt(ab, ap) / this.Punktprodukt(ab, ab); //keine Ahnung mehr, warum es funktioniert, aber es funktioniert

        let c;
        if (t > 1) c = Fig2.Ecken[j];
        else {
          if (t < 0) c = Fig2.Ecken[i];
          else
            c = new Punkt(
              Fig2.Ecken[i].x + t * ab.x,
              Fig2.Ecken[i].y + t * ab.y
            );
        }

        let d = new Vektor(
          Fig1.Ecken[0].x - c.x,
          Fig1.Ecken[0].y - c.y
        ).Betrag();

        if (Fig1.Radius >= d) return true; //fals die Entfehrnung zwischen Mittelpunkt und Strecke kleiner ist als der Radius ist der Ball in der Figur drin
      }
      return false;
    } else if (Fig1 instanceof Ball && !isNaN(Fig2.Radius)) {
      //CD für Kreis (Ball) und Kreis
      //d: Entfernung zwischen den Mittelpunkten der Kreise
      //r: Die addierten Radien von Fig1 und Fig2
      let d = new Vektor(
        Fig1.Ecken[0].x - Fig2.Ecken[0].x,
        Fig1.Ecken[0].y - Fig2[0].y
      ).Betrag();
      let r = Fig1.Radius + Fig2.Radius;

      if (d <= r) return true;
      //die Entfernung zwischen den Mittelpunkten ist kleiner als die addierten Radien -> die Kreise überschneiden sich
      else return false;
    }
  }

  static Punktprodukt(v1 = new Vektor(), v2 = new Vektor()) {
    return v1.x * v2.x + v1.y * v2.y;
  }

  static _aufSegment(p = new Punkt(), q = new Punkt(), r = new Punkt()) {
    //errechne den Vektor pr
    let v = new Vektor(r.x - p.x, r.y - p.y);
    //errechne t für x (q=k*v+op)
    let t = (q.x - p.x) / v.x;
    if (/*t == (q.y - p.y) / v.y &&*/ t <= 1 && t >= 0) {
      return true;
    }
    return false;
  }

  static Schnittpunkt(
    p = new Punkt(),
    r = new Punkt(),
    x = new Punkt(),
    b = new Vektor(),
    collision = true
  ) {
    /*
    g: Gerade durch Punkt x in Richtung b
    s: Gerade durch die Punkte p und r
    t: vielfaches zum erreichen von SP (Schnittpunkt) auf der geraden g
    */
    let g = new Gerade(x.zuVektor(), b);
    let s = new Gerade(p.zuVektor(), new Vektor(r.x - p.x, r.y - p.y));

    if (s.u.x / g.u.x == s.u.y / g.u.y) {
      //die Richtungsvektoren sind Kolinear -> es gibt keinen/unendlich Schnittpunkte
      if (g.p.x == s.p.x && g.p.y == s.p.y) return true;
      //die Stützvektoren sind gleich
      else return false; //die Stützvektoren sind ungleich
    }

    //s=g
    let t =
      (-g.p.x * s.u.y + g.p.y * s.u.x + s.p.x * s.u.y - s.p.y * s.u.x) /
      (g.u.x * s.u.y - g.u.y * s.u.x);
    if (
      this._aufSegment(p, new Punkt(g.p.x + t * g.u.x, g.p.y + t * g.u.y), r) &&
      collision
    ) {
      console.log("Kollision");
      return true;
    }
    if (!collision) return new Punkt(g.p.x + t * g.u.x, g.p.y + t * g.u.y);
    else {
      console.log("keine Kollision");
      return false;
    }
  }

  static Entfernung(p, r) {
    return Math.abs(new Vektor(r.x - p.x, r.y - p.y).Betrag());
  }
}

class CD_Return {
  constructor(CD = false, v = new Vektor()) {
    this.CD = CD;
    this.v = v;
  }
}
