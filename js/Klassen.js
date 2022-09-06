class Punkt {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  zuVektor() {
    return new Vektor(this.x, this.y);
  }
  Bewege(v) {
    /*
    v: Vektor, um den der Punkt bewegt werden soll
    */
    this.x += v.x;
    this.y += v.y;
  }
}

class Vektor {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }
  zuPunkt() {
    return new Punkt(this.x, this.y);
  }
  Betrag() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }
  Rotiere(w) {
    let r = w * (Math.PI / 180);
    let _x = this.x; //nicht so schön, aber ansonsten schlägt die Berechnung für y fehl
    this.x =
      this.x * Math.cos(r).toFixed(10) - this.y * Math.sin(r).toFixed(10);
    this.y = _x * Math.sin(r).toFixed(10) + this.y * Math.cos(r).toFixed(10); //weil float blöd ist muss ich runden
  }
  normalEinheits() {
    return new Vektor(this.x / this.Betrag(), this.y / this.Betrag());
  }
}

class Gerade {
  //Geradengleichung
  //->  ->     ->
  //x = p + λ * r
  constructor(p = new Vektor(), r = new Vektor()) {
    this.p = p;
    this.r = r;
  }
  Schnittpunkt(h = new Gerade()) {
    //g=p+λ1*r
    //h=q+λ2*s
    //g=h
    let λg =
      (-this.p.x * h.r.y + this.p.y * h.r.x + h.p.x * h.r.y - h.p.y * h.r.x) /
      (this.r.x * h.r.y - this.r.y * h.r.x);
    //let λh =(-this.p.x * this.r.y +this.p.y * this.r.x +h.p.x * this.r.y -h.p.y * this.r.x) /(this.r.x * h.r.y - this.r.y * h.r.x);
    let λh = (this.p.x - h.p.x + this.r.x * λg) / h.r.x;
    return { λg, λh };
  }
}

class Figur {
  constructor(
    Ecken = [new Punkt()],
    Typ = "",
    Radius = NaN,
    cd = false
    //Normalen = [new Vektor()]
  ) {
    this.Ecken = Ecken;
    this.Typ = Typ;
    this.Radius = Radius;
    this.cd = cd;
    //this.Normalen = berechne_Normalen();

    if (this.Ecken.length == 1 && isNaN(this.Radius))
      return new Error(
        "Eine Figur braucht mindestens zwei Ecken oder einen Radius und einen Mittelpunkt (Ecke)!"
      );
  }
  Bewege(v = new Vektor()) {
    if (isNaN(this.Radius)) {
      this.Ecken.forEach((e) => {
        e.Bewege(v);
      });
    } else this.Ecken.Bewege(v);
  }
}

class Tor extends Figur {
  constructor(Ecken, Team = NaN) {
    super(Ecken, (Typ = "Tor"));
    this.Team = Team;
  }
  Verkleinere() {}
}

class Spieler extends Figur {
  constructor(
    Ecken = [new Punkt()],
    Radius = NaN,
    Team = NaN,
    Fuss = new Figur(),
    Geschwindigkeit = new Vektor(),
    Offset = new Vektor()
  ) {
    super(Ecken, "Spieler", Radius);
    this.Team = Team;
    this.Fuss = Fuss;
    this.Geschwindigkeit = Geschwindigkeit;
    this.Offset = Offset;
    //this.Bewege()=_BewegeS();
  }
  Bewege(v = new Vektor()) {
    super.Bewege(v);
    this.Offset.x += v.x;
    this.Offset.y += v.y;
  }
}

class Ball extends Figur {
  constructor(
    Ecken = [new Punkt(0, 0)],
    Radius = 0, //m
    Geschwindigkeit = new Vektor(0, 0), //m/Tick
    Masse = 1 //kg
  ) {
    super(Ecken, "Ball", Radius, true);
    this.Geschwindigkeit = Geschwindigkeit;
    this.Masse = Masse;
  }
  Reibung() {
    //F= 0.5*A*c*p*v^2
    let F =
      0.5 *
      Math.PI *
      this.Radius ** 2 *
      0.2 *
      1.225 *
      this.Geschwindigkeit.Betrag() ** 2;

    let a = F / this.Masse;

    let z;
    if (this.Geschwindigkeit.x + this.Geschwindigkeit.y == 0) z = 0;
    else z = -a / this.Geschwindigkeit.Betrag();

    a = new Vektor(this.Geschwindigkeit.x * z, this.Geschwindigkeit.y * z);

    return a;
  }
}
