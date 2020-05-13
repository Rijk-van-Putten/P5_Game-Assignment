/* aanwijzing: gameSettings = [
    snelheid: de snelheid van het object in level 1
    snelheidstoename: hoeveel sneller moet het object in een volgend level gaan?
    diameter: de grootte van het te volgen object
    tijd: hoe lang moet je het object volgen om het te halen?
    ]

   oorspronkelijke settings:
   var gameSettings = [2,0.5,200,2];
*/

var gameSettings = [2,0.5,200,2];

/*  **********************************************************
    **                  BEGIN klasse Doel                 **
    ********************************************************** */


class Doel {
  constructor(d,a,v) {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
    this.vy = random(-100*v,100*v) / 100;
    this.vx = sqrt(pow(v,2)-pow(this.vy,2));
    this.diameter = d;
    this.straal = this.diameter / 2;
    this.kleur = 220;
    this.doorzichtigheid = a;
    this.toonRand = false;
  }

  beweeg() {
      if (this.x > canvas.width - this.straal || this.x < this.straal) {
          this.vx *= -1;
      }
      if (this.y > canvas.height - this.straal || this.y < this.straal) {
          this.vy *= -1;
      }      
      this.x += this.vx;
      this.y += this.vy;      
  }

  wordtGeraakt() {
      if (dist(mouseX,mouseY,this.x,this.y) < this.straal) {
          return true;
      }
      else {
          return false;
      }
  }
  
  teken() {
    push();
    fill(this.kleur,this.kleur,this.kleur,this.doorzichtigheid);
    if (this.toonRand) {
        stroke(this.kleur);
    }
    else {
        noStroke();
    }
    ellipse(this.x,this.y,this.diameter);
    pop();
  }
}

/*  **********************************************************
    **     EINDE klasse Doel         BEGIN klasse Timer     **
    ********************************************************** */


class Timer {
    constructor(t) {
        this.ingesteldeTijd = t*50;
        this.verlopenTijd = 0;
        this.breedte = canvas.width;
        this.hoogte = canvas.height / 10;
    }

    reset() {
        this.verlopenTijd = 0;
    }

    loop() {
        this.verlopenTijd++;
    }

    teken() {
        push();
        strokeWeight(5);
        stroke(255);
        fill(255,255,255,.8);
        rect(0,0,this.breedte,this.hoogte);
        noStroke();
        fill(0,255,0,.8);
        rect(0,0,this.breedte *this.verlopenTijd / this.ingesteldeTijd,this.hoogte);
        fill(200);
        text(round(this.verlopenTijd * 100 / this.ingesteldeTijd)+"%",canvas.width - 50,32);
        pop();
    }
}

/*  **********************************************************
    **    EINDE klasse Timer       BEGIN klasse FollowMe    **
    ********************************************************** */


class Followme {
    constructor(settings) {
    this.level = null;
    this.doel = null;
    this.actief = false;
    this.afgelopen = null;
    this.gewonnen = null;
    this.snelheid = settings[0];
    this.snelheidsToename = settings[1];
    this.diameterDoel = settings[2];
    this.timer = new Timer(settings[3]);
  }
  
  nieuwSpel() {
    this.gewonnen = false;
    this.afgelopen = false;
    this.level = 0;
    this.nieuwLevel();
  }

  nieuwLevel() {
    this.timer.reset();  
    this.doel = new Doel(this.diameterDoel,.5,this.snelheid + this.level*this.snelheidsToename);
    this.level++;
  }

   update() {
    this.doel.beweeg();
    if (this.doel.wordtGeraakt()) {
      this.timer.loop();
    }
    else {
      this.timer.reset();
    }
    if (this.timer.verlopenTijd==this.timer.ingesteldeTijd) {
        this.nieuwLevel();
    }
  }

  tekenScorebord() {
    push();
    fill(0,0,0,.8);
    noStroke();
    textSize(16);
    var marge = 10;
    var hoogte = 50;
    rect(marge,canvas.height - marge - hoogte,100,hoogte);
    fill(255);
    text("Level "+this.level,marge,canvas.height - marge - hoogte,100,hoogte);   
    pop();
  }
  
  beginScherm() {
    push();
    noFill();
    stroke(100,100,100,.3);
    strokeWeight(5);
    textSize(140);
    text(" FollowMe",0,0,canvas.width,canvas.height - 140);
    textSize(32);
    strokeWeight(2);
    fill(0,0,0,0.75);
    text("Volg de cirkel met je muis.\nDruk op een toets om te beginnen.\n",0,0,canvas.width,canvas.height * 2 / 3);
    pop();
  }
  
  eindScherm() {
    var tekst = 'Helaas. Je bent af.';
    if (this.gewonnen) {
      tekst = 'Gefeliciteerd!';
    }
    push();
    fill(0);
    stroke(100,75,50,.8);
    strokeWeight(3);
    text(tekst + '\n\nDruk ENTER voor nieuw spel.',0,0,canvas.width,canvas.height);
    pop();
  }    
  
  teken() {
    background(achtergrond);
    if (!this.actief) {
      this.beginScherm();
    }
    else {
      if (this.afgelopen) {
        this.eindScherm();
      }
      else {
        this.timer.teken();
        this.doel.teken(); 
        this.tekenScorebord();
      }
    }
  }
}

/*  **********************************************************
    **   EINDE klasse FollowMe      BEGIN hoofdprogramma    **
    ********************************************************** */


function preload() {
  achtergrond = loadImage("images/backgrounds/lucht_2.jpg");
}

function setup() {
  canvas = createCanvas(900,600);
  canvas.parent('processing');
  colorMode(RGB,255,255,255,1);
  textFont("Monospace");
  textSize(44);
  textAlign(CENTER,CENTER);  
  frameRate(50);
  spel = new Followme(gameSettings);
  spel.nieuwSpel();
  spel.teken();
}

function draw() {
  spel.update();
  spel.teken();
}

function keyTyped() {
  if (!spel.actief) {
        spel.actief = true;
        spel.teken();
  }
  else {
    if (spel.afgelopen && keyCode == ENTER) {
      spel.nieuwSpel();
      spel.teken();
    }
  }
}

/*  **********************************************************
    **               EINDE hoofdprogramma                   **
    ********************************************************** */