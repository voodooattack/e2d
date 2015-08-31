var e2d = require('./index');

var shape = [
	[0.06, 0],
  [1, 0],
  [0.9, 1],
  [0.04, 1],
  [0, 0.6]
];

function moveToLineTo(point, index) {
  return index === 0 ? e2d.moveTo(point[0], point[1]) : e2d.lineTo(point[0], point[1]);
}

var shapeDraw = e2d.path(shape.map(moveToLineTo));
var r = new e2d.Renderer(800, 600);
var shapeSize = [250, 40];
var text = "New Game";
var textStyle = {
  font: (shapeSize[1] * 0.78) + 'px Georgia', 
  textBaseline: 'hanging'
};
var strokeGoldGlow = e2d.strokeStyle('gold',
  e2d.shadowStyle({ shadowBlur: 10, shadowColor: 'gold' },
    e2d.lineStyle({ lineWidth: 3 }, e2d.stroke())
  )
);
r.ready();

r.on('frame', function() {
	return r.render(
  	e2d.translate(100, 100,
      e2d.scale(shapeSize[0], shapeSize[1], shapeDraw), strokeGoldGlow,
      e2d.translate(shapeSize[0] * 0.075, shapeSize[1] * 0.2,
        e2d.textStyle(textStyle, e2d.fillStyle('gold', e2d.shadowStyle({ shadowBlur: 10, shadowColor: 'gold'},e2d.text(text))))
      )
    )
  );
});


var textBoxShape = [
  [0,    0  ],
  [0.9725, 0  ],
  [1,    0.1],
  [1,    1  ],
  [0,    1  ]
];
var speakerBoxShape = [
  [0,   0  ],
  [0.95,0  ],
  [1,   0.5],
  [1,   1  ],
  [0,   1  ]
];
var textBoxDraw = e2d.path(textBoxShape.map(moveToLineTo));
var speakerBoxDraw = e2d.path(speakerBoxShape.map(moveToLineTo));
var lightBlue = 'rgb(135,192,196)';
var fillTransparentLightBlue = e2d.fillStyle(lightBlue, e2d.globalAlpha(0.4, e2d.fill()));
var strokeLightBlueGlow = e2d.strokeStyle(lightBlue,
  e2d.shadowStyle({ shadowBlur: 10, shadowColor: lightBlue },
    e2d.lineStyle({ lineWidth: 2 }, e2d.stroke())
  )
);
r.on('frame', function() {
  return r.render(
    e2d.clearRect(800, 600),
    e2d.translate(800 * 0.01, 600 * 0.54,
      e2d.scale(800 * 0.4, 600 * 0.06, speakerBoxDraw), 
      fillTransparentLightBlue,
      strokeLightBlueGlow
    ),
    e2d.translate(800 * 0.01, 600 * 0.61,
      e2d.scale(800 * 0.98, 600 * 0.38, textBoxDraw), 
      fillTransparentLightBlue,
      strokeLightBlueGlow
    )
  );
});
r.style({ backgroundColor: 'black' });