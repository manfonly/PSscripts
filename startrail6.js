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
        var totalAngleInput = totalAngleGroup.add("edittext", undefined, "30");
        totalAngleInput.characters = 5;

        // 添加旋转中心X坐标输入
        var centerXGroup = dialog.add("group");
        centerXGroup.orientation = "row";
        centerXGroup.add("statictext", undefined, "Rotation Center X:");
        var centerXInput = centerXGroup.add("edittext", undefined, Math.round(docRef.width / 2).toString());
        centerXInput.characters = 5;

        // 添加旋转中心Y坐标输入
        var centerYGroup = dialog.add("group");
        centerYGroup.orientation = "row";
        centerYGroup.add("statictext", undefined, "Rotation Center Y:");
        var centerYInput = centerYGroup.add("edittext", undefined, Math.round(docRef.height / 2).toString());
        centerYInput.characters = 5;

        var okButton = dialog.add("button", undefined, "OK");
        var cancelButton = dialog.add("button", undefined, "Cancel");

        var dialogResult = dialog.show();

        if (dialogResult == 1) { // 用户点击了 OK
            var totalAngle = parseFloat(totalAngleInput.text);
            var centerX = parseFloat(centerXInput.text);
            var centerY = parseFloat(centerYInput.text);

            // 根据图像宽度动态调整旋转次数
            var imageWidth = docRef.width;
            var numRotations = Math.max(30, totalAngle * imageWidth / 600); // 增加旋转次数，至少100次
            var angleStep = totalAngle / numRotations; // 每次旋转的角度

            // 计算旋转中心到四个角落的最大距离
            var topLeft = Math.sqrt(Math.pow(centerX - 0, 2) + Math.pow(centerY - 0, 2));
            var topRight = Math.sqrt(Math.pow(centerX - docRef.width, 2) + Math.pow(centerY - 0, 2));
            var bottomLeft = Math.sqrt(Math.pow(centerX - 0, 2) + Math.pow(centerY - docRef.height, 2));
            var bottomRight = Math.sqrt(Math.pow(centerX - docRef.width, 2) + Math.pow(centerY - docRef.height, 2));
            var maxRadius = Math.max(topLeft, topRight, bottomLeft, bottomRight);

            // 根据最大半径动态调整旋转次数
            var baseRotations = 30; // 基础旋转次数
            var radiusScale = maxRadius / 1000; // 缩放因子，可以根据需要调整
            var numRotations = Math.max(baseRotations, 2 * Math.round(totalAngle * radiusScale));
            var angleStep = totalAngle / numRotations;

            // 创建一个图层组来存放所有旋转的图层
            var starTrailGroup = docRef.layerSets.add();
            starTrailGroup.name = "Star Trails";
            // 复制并旋转图层
            for (var i = 1; i <= numRotations; i++) {
                var newLayer = originalLayer.duplicate();
                newLayer.name = "Rotation " + i;
                
                // 计算旋转角度
                var angleRad = (i * angleStep) * Math.PI / 180;
                
                // 计算图层中心点相对于旋转中心的偏移
                var layerCenterX = docRef.width / 2;
                var layerCenterY = docRef.height / 2;
                var offsetX = layerCenterX - centerX;
                var offsetY = layerCenterY - centerY;
                
                // 计算旋转后的新位置
                var rotatedX = offsetX * Math.cos(angleRad) - offsetY * Math.sin(angleRad);
                var rotatedY = offsetX * Math.sin(angleRad) + offsetY * Math.cos(angleRad);
                
                // 计算需要移动的距离
                var moveX = rotatedX - offsetX;
                var moveY = rotatedY - offsetY;
                
                // 先旋转
                newLayer.rotate(i * angleStep, AnchorPosition.MIDDLECENTER);
                // 再移动到计算出的位置
                newLayer.translate(moveX, moveY);
                
                newLayer.blendMode = BlendMode.LIGHTEN;
                newLayer.opacity = ((numRotations - i) / numRotations) * 100;
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