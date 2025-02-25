var doc = app.activeDocument;
var layer = doc.activeLayer;
var iterations = 36;
var angleStep = 10;
var opacityStep = 100 / iterations;

// 检查并解锁背景图层
if (layer.isBackgroundLayer) {
  layer.isBackgroundLayer = false;
}

// 转换为智能对象（兼容性写法）
var idnewPlacedLayer = stringIDToTypeID('newPlacedLayer');

// 执行转换操作
executeAction(idnewPlacedLayer, undefined, DialogModes.NO);
// 更新图层引用
layer = doc.activeLayer;

// 后续操作...
doc.resizeCanvas(doc.width, doc.height, AnchorPosition.MIDDLECENTER);

var xCenter = doc.width / 2;
var yCenter = doc.height / 2;
doc.guides.add(Direction.VERTICAL, xCenter);
doc.guides.add(Direction.HORIZONTAL, yCenter);

for (var i=1; i<=iterations; i++) {
  var newLayer = layer.duplicate();
  var matrix = app.getCustomMatrix();
  matrix.tx = -xCenter;
  matrix.ty = -yCenter;
  newLayer.applyTransformMatrix(
    matrix,
    xCenter,
    yCenter,
    Transformation.REPLACE,
    InterpolationType.BICUBIC
  );
  newLayer.rotate(angleStep * i, AnchorPosition.MIDDLECENTER);
  newLayer.blendMode = BlendMode.LIGHTEN;
  newLayer.opacity = 100 - (opacityStep * i);
}

doc.activeLayer = layer;
