//jshint worker: true, browser: true, undef: true, unused: true
/* global e2d */
importScripts('standalone.js');


var r = e2d.Renderer.create(800, 600),
    activeItem = "",
    menuItems = [
      { x: 800 - 150 - 40, y: 350, width: 150, height: 40, text: "Start Game",  id: "menu1" },
      { x: 800 - 150 - 40 - 30, y: 400, width: 150, height: 40, text: "Options",  id: "menu2" },
      { x: 800 - 150 - 40 - 15, y: 450, width: 150, height: 40, text: "Load Game",  id: "menu3" },
      { x: 800 - 150 - 40 + 15, y: 500, width: 150, height: 40, text: "Quit",  id: "menu4" }
    ],
    moveTo = e2d.moveTo,
    lineTo = e2d.lineTo;

function instructionMap(point, index) {
  return index === 0 ? moveTo(point[0], point[1]) : lineTo(point[0], point[1]);
}

function menuItem(item) {
  var contents, textContents;
  var path = [
    [item.width, item.height],
    [0.035 * item.width, item.height],
    [0, 0.75 * item.height],
    [0.1 * item.width, 0],
    [item.width, 0]
  ];
  
  var outlinePath = e2d.path(
    path.map(instructionMap)
  );
  
  if (activeItem === item.id) {
    contents = e2d.fillStyle('gold',
      outlinePath,
      e2d.fill()
    );
      

    textContents = e2d.fillStyle('black',
      e2d.shadowStyle({ shadowColor: 'black', shadowBlur: 2 },
        e2d.text(item.text)
      )
    );
  } else {
    contents = [
      outlinePath
    ];
    
    textContents = e2d.fillStyle('gold',
      e2d.text(item.text)
    );
  }
  return e2d.textStyle({ 
      font: (item.height - 20) + "px Calibri",
      textAlign: "left",
      textBaseline: "middle"
    },
    e2d.shadowStyle({ shadowColor: 'gold', shadowBlur: 10 },
      e2d.translate(item.x, item.y,
        
        e2d.lineStyle({ lineWidth: 3, strokeStyle: 'gold' },
          contents,
          e2d.stroke()
        ),
        e2d.hitRegion(item.id, path),
        e2d.translate(item.width * 0.12, item.height * 0.5,
          textContents 
        )
        
      )
    )
  );
}

var mouse = { x: 0, y: 0, state: 'up' };


r.on('mouse', function (data) {
  activeItem = data.activeRegions[0];
  
  if (data.activeRegions.length > 0) {
    r.style({
      cursor: 'pointer'
    });
  } else {
    r.style({
      cursor: null
    });
  }
});
function frame() {
  
  r.render(
    e2d.fillRect(800, 600),
    menuItems.map(menuItem)
  );
}

r.on('frame', frame);
r.ready();