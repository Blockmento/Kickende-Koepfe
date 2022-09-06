/*Objekt Types:
Hindernisse (Figur & Kreis)
Tore (Tor)
Spieler (Spieler [Figur])
Boden (Figur)
Powerups (Kreis)


Objekte{Spielball:Ball,Spieler1:Spieler,Spieler2:Spieler,Tore:[Tor,Tor],Hindernisse:[Figur,Figur,...],Powerups[Figur,Figur,...]}
*/
/*
Die Größen zum Rechnen und zum Rendern sind unterschiedlich -> 1m = einer Längeneinheit beim Rechnen
Rechenspielfeldgröße: 20/11,25
Als Koordinatensystem wird das System vom Canvas genommen

0___________>5
 |
 |   
 |    x(2,2)
 |
 |
5\/
*/
//Konstanten
const fps = 60;
const Seitenverhaltnis = 16 / 9;
const breite = 20;
const höhe = 11.25;
//const höhe = 3000;
let t = 0;
let g = 9.81; //m/s²

let Objekte = {};
Objekte.Spielball = new Ball(
  new Punkt(0, höhe),
  0.114,
  new Vektor(0 / fps, 0 / fps),
  0.45
);

console.log("v0=" + Objekte.Spielball.Geschwindigkeit.Betrag() * fps + "m/s");

let Eingeholt = false;

Objekte.Hindernisse = [];

Objekte.Spieler1 = new Spieler(
  new Punkt(15, 5),
  0.5,
  0,
  new Figur([
    new Punkt(-1, 0),
    new Punkt(1, 0),
    new Punkt(1, 1),
    new Punkt(-1, 1),
  ])
);
Objekte.Spieler2 = new Spieler(
  new Punkt(5, 5),
  0.5,
  1,
  new Figur([
    new Punkt(-1, 0),
    new Punkt(1, 0),
    new Punkt(1, 1),
    new Punkt(-1, 1),
  ])
);
//Spielfeldumrandung
Objekte.Hindernisse.push(
  new Figur([new Punkt(0, 0), new Punkt(breite, 0)], "Hindernis"),
  new Figur([new Punkt(breite, 0), new Punkt(breite, höhe)], "Hindernis"),
  new Figur([new Punkt(breite, höhe), new Punkt(0, höhe)], "Hindernis"),
  new Figur([new Punkt(0, höhe), new Punkt(0, 0)], "Hindernis")
);

Objekte.Hindernisse.push(
  new Figur(
    [new Punkt(1, 1), new Punkt(2, 1), new Punkt(2, 2), new Punkt(1, 2)],
    "Hindernis"
  )
);

let Tasten = {};
//k = ((r)/(g.betrag)))

class game {
  constructor() {
    this.tickzeit = {};
    this._v = {};

    this._setup();
  }

  _setup() {
    console.log("setup");
    setInterval(this.tick.bind(this), 1000 / fps);
  }

  tick() {
    //Ini
    let startzeit = performance.now();

    //Bewegungen berechnen
    this._v.Spielball = new Vektor(
      Objekte.Spielball.Geschwindigkeit.x,
      Objekte.Spielball.Geschwindigkeit.y + g / fps ** 2
    );
    let _a_Luft = Objekte.Spielball.Reibung();
    if (g == (_a_Luft.Betrag() * fps ** 2).toFixed(2) && !Eingeholt) {
      console.log(
        `eingeholt! ${t} Ticks = ${(t / fps).toFixed(
          2
        )}s; ${Objekte.Spielball.Ecken.y.toFixed(2)}m Gefallen \n${(
          Objekte.Spielball.Geschwindigkeit.Betrag() * fps
        ).toFixed(2)}m/s schnell`
      );
      Eingeholt = true;
    }
    /* if (Objekte.Spielball.Ecken.y.toFixed(0) == höhe.toFixed(0)) {
      console.log(
        `Ticks = ${(t / fps).toFixed(2)}s; ${(
          Objekte.Spielball.Geschwindigkeit.Betrag() * fps
        ).toFixed(2)}m/s schnell \n${Objekte.Spielball.Ecken.x}m weit geflogen`
      );
    } */

    this._v.Spielball.x += _a_Luft.x;
    this._v.Spielball.y += _a_Luft.y;

    t += 1;

    //Kollision
    for (let i = 0; i < Objekte.Hindernisse.length; i++) {
      const e = Objekte.Hindernisse[i];
    }
    /*
    Object.values(Objekte).forEach((e) => {
      //console.log(e);
      if (e.cd) {
        
      } else {
        if (e.Typ === 'Spieler') {
        }
      }
    });*/

    //Bewegungen ausführen
    Objekte.Spielball.Bewege(this._v.Spielball);
    Objekte.Spielball.Geschwindigkeit = this._v.Spielball;

    //Abschluss
    Renderer.update();
    this.leistung(startzeit);
  }

  leistung(t0 = NaN) {
    //Aktuelle Frametime in ms
    this.tickzeit.now = performance.now() - t0;
    //Ini
    if (t == 1) {
      //console.log('ini');
      this.tickzeit.avg = this.tickzeit.now;
      this.tickzeit.min = this.tickzeit.now;
      this.tickzeit.max = this.tickzeit.now;
      this.tickzeit.sum = this.tickzeit.now;
      this.tickzeit.trueavg = this.tickzeit.now;
    }
    //Summe
    this.tickzeit.sum += this.tickzeit.now;
    //Durchnistliche Frametime
    this.tickzeit.trueavg = this.tickzeit.sum / t;
    (this.tickzeit.avg + this.tickzeit.now) / 2;
    //min
    if (this.tickzeit.now < this.tickzeit.min) {
      this.tickzeit.min = this.tickzeit.now;
    }
    //max
    if (this.tickzeit.now > this.tickzeit.max)
      this.tickzeit.max = this.tickzeit.now;
  }
}

const Renderer = new Render(document.getElementById("KK"));
const Spiel = new game();

//setInterval(game.tick, 1000 / fps);
