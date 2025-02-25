// 设置标尺单位为像素
app.preferences.rulerUnits = Units.PIXELS;

// 检查是否有活动的文档
if (app.documents.length > 0) {
    var docRef = app.activeDocument;

    // 检查是否有选定的图层
    if (docRef.activeLayer) {
        var originalLayer = docRef.activeLayer;

        // 创建对话框
        var dialog = new Window("dialog", "Star Trail Settings");
        dialog.orientation = "column";
        dialog.alignChildren = "left";

        var totalAngleGroup = dialog.add("group");
        totalAngleGroup.orientation = "row";
        totalAngleGroup.add("statictext", undefined, "Total Rotation Angle (degrees):");
        var totalAngleInput = totalAngleGroup.add("edittext", undefined, "360");
        totalAngleInput.characters = 5;

        var okButton = dialog.add("button", undefined, "OK");
        var cancelButton = dialog.add("button", undefined, "Cancel");

        var dialogResult = dialog.show();

        if (dialogResult == 1) { // 用户点击了 OK
            var totalAngle = parseFloat(totalAngleInput.text);

            // 根据图像宽度动态调整旋转次数
            var imageWidth = docRef.width;
            var numRotations = Math.max(50, totalAngle * imageWidth / 600); // 增加旋转次数，至少100次
            var angleStep = totalAngle / numRotations; // 每次旋转的角度

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
            alert("操作已取消。");
        }
    } else {
        alert("请先选择一个图层。");
    }
} else {
    alert("没有打开的文档。");
}