// 设置标尺单位为像素
app.preferences.rulerUnits = Units.PIXELS;

// 检查是否有活动的文档
if (app.documents.length > 0) {
    var docRef = app.activeDocument;

    // 检查是否有选定的图层
    if (docRef.activeLayer) {
        var originalLayer = docRef.activeLayer;

        // 定义旋转的次数和每次旋转的角度
        var numRotations = 100; // 增加旋转次数
        var angleStep = 0.5; // 减小每次旋转的角度

        // 创建一个图层组来存放所有旋转的图层
        var starTrailGroup = docRef.layerSets.add();
        starTrailGroup.name = "Star Trails";

        // 复制并旋转图层
        for (var i = 1; i <= numRotations; i++) {
            var newLayer = originalLayer.duplicate();
            newLayer.name = "Rotation " + i;
            newLayer.rotate(i * angleStep, AnchorPosition.MIDDLECENTER);
            newLayer.blendMode = BlendMode.LIGHTEN; // 设置混合模式为“变亮”
            newLayer.move(starTrailGroup, ElementPlacement.INSIDE);
        }

        // 合并星轨图层组
        var mergedLayer = starTrailGroup.merge();

        // 应用高斯模糊以平滑过渡
        var blurRadius = 2; // 根据需要调整模糊半径
        mergedLayer.applyGaussianBlur(blurRadius);

        // 提示用户处理完成
        alert("星轨效果已生成！");
    } else {
        alert("请先选择一个图层。");
    }
} else {
    alert("没有打开的文档。");
}
