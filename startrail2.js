// 设置标尺单位为像素
app.preferences.rulerUnits = Units.PIXELS;

// 打开图像文件
var fileRef = File.openDialog("请选择要处理的图像文件");
if (fileRef) {
    var docRef = app.open(fileRef);

    // 定义旋转的次数和每次旋转的角度
    var numRotations = 30;
    var angleStep = 1; // 每次旋转1度

    // 复制并旋转图层
    for (var i = 1; i <= numRotations; i++) {
        var newLayer = docRef.activeLayer.duplicate();
        newLayer.name = "Rotation " + i;
        newLayer.rotate(i * angleStep, AnchorPosition.MIDDLECENTER);
        newLayer.blendMode = BlendMode.LIGHTEN; // 设置混合模式为“变亮”
    }

    // 合并所有图层
    docRef.flatten();

    // 保存处理后的图像
    var saveFile = File.saveDialog("保存星轨图像为");
    if (saveFile) {
        var jpegOptions = new JPEGSaveOptions();
        jpegOptions.quality = 12; // 设置JPEG质量为最高
        docRef.saveAs(saveFile, jpegOptions, true);
    }

    // 关闭文档
    docRef.close(SaveOptions.DONOTSAVECHANGES);
} else {
    alert("未选择图像文件。");
}
