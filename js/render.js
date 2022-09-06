//The render engine for the game using canvas

class Render {
  constructor(container) {
    this._container = container || document;
    this._container.classList.add('KKcontainer');

    this._setupCanvas();

    this._redrawCanvas();
  }

  update() {
    this._redrawCanvas();
  }

  _setupCanvas() {
    this._canvas = document.createElement('canvas');
    this._container.appendChild(this._canvas);
    this._canvas.classList.add('KKCanvas');

    this._canvas.tabIndex = 1;
    this._canvas.addEventListener('keydown', (evt) =>
      this._onCanvasKeyDown(evt)
    );
    this._canvas.addEventListener('keyup', (evt) => this._onCanvasKeyUp(evt));

    this._ctx = this._canvas.getContext('2d');
    this._updateCanvasSize();
    window.addEventListener('resize', (evt) => this._updateCanvasSize());
  }

  _updateCanvasSize() {
    this._canvas.width = this._container.offsetWidth;
    this._canvas.height = (9 * this._container.offsetWidth) / 16;

    this._redrawCanvas();
  }

  _onCanvasKeyDown(evt) {
    Tasten[evt.key] = true;
  }

  _onCanvasKeyUp(evt) {
    Tasten[evt.key] = false;
  }

  _redrawCanvas() {
    this._ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    //this._ctx.strokeRect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.strokeStyle = 'black';
    this._ctx.beginPath();
    Object.values(Objekte).forEach((e) => {
      if (!isNaN(e.Radius)) { //Kreis
        //this._ctx.drawImage();
        this._ctx.moveTo(
          ((e.Ecken.x + e.Radius) / breite) * this._canvas.width,
          (e.Ecken.y / höhe) * this._canvas.height
        );
/*         this._ctx.arc(
          ((e.Ecken.x + e.Radius) / breite) * this._canvas.width,
          (e.Ecken.y / höhe) * this._canvas.height,
          1,
          0,
          2 * Math.PI
        ); */
        this._ctx.arc(
          (e.Ecken.x / breite) * this._canvas.width,
          (e.Ecken.y / höhe) * this._canvas.height,
          (e.Radius / breite) * this._canvas.width,
          0,
          2 * Math.PI
        );
        //console.log(e.Typ, (e.Ecken.x + e.Radius) / breite);
      }
      if (Array.isArray(e)) {
        for (let j = 0; j < e.length; j++) {
          const p1 = e[j];
          this._ctx.moveTo(
            (p1.Ecken[p1.Ecken.length - 1].x / breite) * this._canvas.width,
            (p1.Ecken[p1.Ecken.length - 1].y / höhe) * this._canvas.height
          );
          for (let i = 0; i < p1.Ecken.length; i++) {
            const p2 = p1.Ecken[i];
            this._ctx.lineTo(
              (p2.x / breite) * this._canvas.width,
              (p2.y / höhe) * this._canvas.height
            );
          }
        }
      } else {
      }
    });
    this._ctx.stroke();
    /*this._ctx.beginPath();
    this._ctx.rect(0, 0, this._canvas.width, this._canvas.height);
    this._ctx.arc(100, 100, 50, 0, Math.PI * 2);
    this._ctx.stroke();*/
    //console.log("redraw");
  }
}
