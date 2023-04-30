$(function () {
    const data = {
        mdx: 0,//鼠标按下时的鼠标位置
        mdy: 0,
        ox: 0,//鼠标按下时的图片位置
        oy: 0,
        cx: 0,//图片实时位置
        cy: 0,
        shift: false,//true竖向滚动，否则横向
        ctrl: false,//ctrl是否按下
        scale: 100,//图片缩放百分比
        imgWidth: 0,//图片原始宽高
        imgHeight: 0,
        cImgW: 0,//当前图片宽高
        cImgH: 0,
        imgCount: 1,//图片数量，垂直排列
        modalVisible: false,//模态框的显示状态
        bgOpacity: 50,//背景透明度
        contrast: 100,//图片对比度
        brightness: 100,//图片亮度
        mouseX: window.innerWidth / 2,//鼠标实时位置
        mouseY: window.innerHeight / 2,
        scBarMoving: false,//是否在用鼠标拖动滚动条
        scBarHove: false,//鼠标是否在滚动条上
        currScBarLeft: 0,//滚动条实时位置
        currScBarTop: 0,
        cScBarH: 100,//滚动条实时高度和宽度
        cScBarW: 100,
        bg1width: 100,//背景1宽高
        bg1height: 100,
        bg1x: 0,//背景1位置
        bg1y: 0,
        bg1osx: 0,//背景1相对图片偏移量
        bg1osy: 0,
        bg1Scale: 100,//背景1缩放百分比
        bg2width: 100,//背景2宽高
        bg2height: 100,
        bg2x: 0,//背景2位置
        bg2y: 0,
        bg2osx: 0,//背景2相对图片偏移量
        bg2osy: 0,
        bg2Scale: 100,//背景2缩放百分比
    };
    const background1 = $("#background1");
    const background2 = $("#background2");
    const viewer = $("#viewer");
    const img = $("#image");
    const imgNode = $("#image>img");
    const modalWrapper = $("#modalWrapper");
    const scBarX = $("#scBarX");
    const scBarY = $("#scBarY");
    const noEase = $("#background1,#background2,#image,#scBarX,#scBarY");
    const body = $("body")[0];
    for (let i = 0; i < imgNode.length; i++) {
        imgNode[i].draggable = false;
    }
    data.imgWidth = imgNode[0].width;
    data.imgHeight = imgNode[0].height;
    data.cImgW = imgNode[0].width;
    data.cImgH = imgNode[0].height;
    data.imgCount = imgNode.length;
    //解析背景图片宽高
    let sizeStrs = background1.css("background-size").replaceAll("px", "").split(" ");
    data.bg1width = parseInt(sizeStrs[0]);
    data.bg1height = parseInt(sizeStrs[1]);
    sizeStrs = background2.css("background-size").replaceAll("px", "").split(" ");
    data.bg2width = parseInt(sizeStrs[0]);
    data.bg2height = parseInt(sizeStrs[1]);
    sizeStrs = null;
    //拖拽图片
    function moveImg(event) {
        data.cx = data.ox + (event.pageX - data.mdx);
        data.cy = data.oy + (event.pageY - data.mdy);
        posSync(false);
    };
    //图片位置同步
    function posSync(scale){
        let iw = data.cImgW + 800;
        let ih = data.cImgH * data.imgCount + 800;
        let ml = window.innerWidth - iw + 400;
        let mt = window.innerHeight - ih + 400;
        if(data.cx < ml){
            data.cx = ml;
        }
        if(data.cy < mt){
            data.cy = mt;
        }
        if(data.cx > 400){
            data.cx = 400;
        }
        if(data.cy > 400){
            data.cy = 400;
        }
        img.css("left", data.cx + "px").css("top", data.cy + "px");
        if(scale){
            background1.css("background-size", (data.bg1width * data.bg1Scale / 100) + "px " + (data.bg1height * data.bg1Scale / 100) + "px");
            background2.css("background-size", (data.bg2width * data.bg2Scale / 100) + "px " + (data.bg2height * data.bg2Scale / 100) + "px");
            data.cScBarW = window.innerWidth * window.innerWidth / iw;
            data.cScBarH = window.innerHeight * window.innerHeight / ih;
            if(data.cScBarW > window.innerWidth){
                data.cScBarW = window.innerWidth;
                data.currScBarLeft = 0;
            }else{
                if(data.cScBarW < 80){
                    data.cScBarW = 80;
                }
                data.currScBarLeft = (window.innerWidth - data.cScBarW) * (400 - data.cx) / (iw - window.innerWidth);
            }
            if(data.cScBarH > window.innerHeight){
                data.cScBarH = window.innerHeight;
                data.currScBarTop = 0;
            }else {
                if(data.cScBarH < 80){
                    data.cScBarH = 80;
                }
                data.currScBarTop = (window.innerHeight - data.cScBarH) * (400 - data.cy) / (ih - window.innerHeight);
            }
            scBarX.css("left", data.currScBarLeft + "px").css("width", data.cScBarW + "px");
            scBarY.css("top", data.currScBarTop + "px").css("height", data.cScBarH + "px");
        }else {
            if(data.cScBarW < window.innerWidth){
                data.currScBarLeft = (window.innerWidth - data.cScBarW) * (400 - data.cx) / (iw - window.innerWidth);
                scBarX.css("left", data.currScBarLeft + "px");
            }
            if(data.cScBarH < window.innerHeight){
                data.currScBarTop = (window.innerHeight - data.cScBarH) * (400- data.cy) / (ih - window.innerHeight);
                scBarY.css("top", data.currScBarTop + "px");
            }
            data.bg1x = data.cx / 2.5 + data.bg1osx;
            data.bg1y = data.cy / 2.5 + data.bg1osy;
            data.bg2x = data.cx / 5 + data.bg2osx;
            data.bg2y = data.cy / 5 + data.bg2osy;
        }
        background1.css("background-position", data.bg1x + "px " + data.bg1y + "px");
        background2.css("background-position", data.bg2x + "px " + data.bg2y + "px");
    };
    function bodyWheel(event) {
        if(data.ctrl){
            scaleImg(data.scale + (event.wheelDelta > 0 ? 5 : -5));
            return;
        }else if(data.shift){
            data.cx += event.wheelDelta;
        }else {
            data.cy += event.wheelDelta;
        }
        posSync(false);
    };
    //图片缩放, 参数为是否放大
    function scaleImg(newScale){
        if(newScale > 400){
            return;
        }
        if(newScale < 20){
            return;
        }
        let ww = data.mouseX;
        let wh = data.mouseY;
        let newCx = (data.cx - ww) * newScale / data.scale + ww;
        let newCy = (data.cy - wh) * newScale / data.scale + wh;
        let bg1Scale = (newScale - 100) / 2.5 + 100;
        let bg2Scale = (newScale - 100) / 5 + 100;
        data.bg1x = (data.bg1x - ww) * bg1Scale / data.bg1Scale + ww;
        data.bg1y = (data.bg1y - wh) * bg1Scale / data.bg1Scale + wh;
        data.bg2x = (data.bg2x - ww) * bg2Scale / data.bg2Scale + ww;
        data.bg2y = (data.bg2y - wh) * bg2Scale / data.bg2Scale + wh;
        if(newScale === 100){
            data.cImgW = data.imgWidth;
            data.cImgH = data.imgHeight;
        }else{
            data.cImgW = data.imgWidth * newScale / 100;
            data.cImgH = data.imgHeight * newScale / 100;
        }
        data.cx = newCx;
        data.cy = newCy;
        data.bg1osx = data.bg1x - (data.cx / 2.5);
        data.bg1osy = data.bg1y - (data.cy / 2.5);
        data.bg2osx = data.bg2x - (data.cx / 5);
        data.bg2osy = data.bg2y - (data.cy / 5);
        data.scale = newScale;
        data.bg1Scale = bg1Scale;
        data.bg2Scale = bg2Scale;
        posSync(true);
        imgNode.attr("width", data.cImgW);
        imgNode.attr("height", data.cImgH);
        $("#scale").html(data.scale + "%");
    };
    //背景图透明度调整
    function opacityBackground(newOpacity) {
        if(newOpacity < 0 || newOpacity > 100){
            return;
        }
        data.bgOpacity = newOpacity;
        background1.css("opacity", data.bgOpacity / 100);
        background2.css("opacity", data.bgOpacity / 100);
        $("#bgOpacity").html(data.bgOpacity + "%");
    }
    //调整图片亮度和对比度
    function changeImgFilter(newBrightness, newContrast) {
        if(newBrightness < 20 || newBrightness > 400){
            return
        }
        if(newContrast < 20 || newContrast > 400){
            return;
        }
        data.brightness = newBrightness;
        data.contrast = newContrast;
        viewer.css("filter", "brightness(" + data.brightness + "%) contrast(" + data.contrast + "%)")
        $("#brightness").html(data.brightness + "%");
        $("#contrast").html(data.contrast + "%");
    }
    //模态框的开启关闭状态切换
    function switchModal(){
        data.modalVisible = !data.modalVisible;
        if(data.modalVisible){
            $("#modal_bg,#modal").addClass("show");
            $("#viewer,#noteList").addClass("hide");
            body.onwheel = null;
        }else{
            $("#modal_bg,#modal").removeClass("show");
            $("#viewer,#noteList").removeClass("hide");
            body.onwheel = bodyWheel;
        }
    };
    //鼠标移动横向滚动条
    function scBarXMove(event){
        data.cx = data.ox - ((event.pageX - data.mdx) * (data.cImgW + 800 - window.innerWidth) / (window.innerWidth - data.cScBarW));
        posSync(false)
    };
    //鼠标移动竖向滚动条
    function scBarYmove(event){
        data.cy = data.oy - ((event.pageY - data.mdy) * (data.cImgH * data.imgCount + 800 - window.innerHeight) / (window.innerHeight - data.cScBarH));
        posSync(false)
    };
    function mosUp() {
        body.onmousemove = null;
        noEase.removeClass("no_ease");
        data.scBarMoving = false;
        if(!data.scBarHove) {
            scBarX.removeClass("hover");
            scBarY.removeClass("hover");
        }
    };
    viewer.mousedown(function (event) {
        if(event.button === 1){
            scaleImg(100);
        }else {
            data.mdx = event.pageX;
            data.mdy = event.pageY;
            data.ox = parseInt(img.css("left").replace("px", ""));
            data.oy = parseInt(img.css("top").replace("px", ""));
            noEase.addClass("no_ease");
            body.onmousemove = moveImg;
        }
    }).mouseup(mosUp);
    //禁用浏览器默认缩放行为
    document.body.addEventListener("wheel", (e) => {
        if(e.ctrlKey && e.deltaY !== 0){
            e.preventDefault();
            return false;
        }
    }, { passive: false });
    body.onwheel = bodyWheel;

    scBarX.mouseover(() => {
        data.scBarHove = true;
        if(!data.scBarMoving){
            scBarX.addClass("hover");
        }
    }).mouseleave(() => {
        data.scBarHove = false;
        if(!data.scBarMoving){
            scBarX.removeClass("hover");
        }
    }).mousedown(function (event) {
        data.scBarMoving = true;
        data.mdx = event.pageX;
        data.ox = data.cx;
        noEase.addClass("no_ease");
        body.onmousemove = scBarXMove;
        return false;
    }).mouseup(mosUp);
    scBarY.mouseover(() => {
        data.scBarHove = true;
        if(!data.scBarMoving){
            scBarY.addClass("hover");
        }
    }).mouseleave(() => {
        data.scBarHove = false;
        if(!data.scBarMoving){
            scBarY.removeClass("hover");
        }
    }).mousedown(function (event) {
        data.scBarMoving = true;
        data.mdy = event.pageY;
        data.oy = data.cy;
        noEase.addClass("no_ease");
        body.onmousemove = scBarYmove;
        return false;
    }).mouseup(mosUp);
    //实时记录鼠标位置
    document.onmousemove = function (event) {
        data.mouseX = event.pageX;
        data.mouseY = event.pageY;
    };
    document.onkeydown = function (event) {
        // console.log(event.keyCode);
        switch (event.keyCode) {
            case 16://shift
                data.shift = true;
                break;
            case 17://ctrl
                data.ctrl = true;
                break;
            case 173://- : 背景透明度-0.05
                opacityBackground(data.bgOpacity - 5);
                break;
            case 61://= : 背景透明度+0.05
                opacityBackground(data.bgOpacity + 5);
                break;
            case 13://回车 : 显示或关闭背景
                opacityBackground(data.bgOpacity === 0 ? 50 : 0);
                break;
            case 219://[ : 缩小5%
                scaleImg(data.scale - 5, event);
                break;
            case 221://] : 放大5%
                scaleImg(data.scale + 5, event);
                break;
            case 220://\ : 缩放重置
            case 9://Tab
                scaleImg(100);
                return false;
            case 32://空格 : 打开笔记列表对话框
                switchModal();
                break;
            case 87://W : 上翻页
            case 101://NUM 5
            case 33://PageUp
                data.cy += (window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight) * 0.9;
                posSync(false);
                break;
            case 83://S : 下翻页
            case 98://NUM 2
            case 34://PageDown
                data.cy -= (window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight) * 0.9;
                posSync(false);
                break;
            case 65://A : 左翻页
            case 97://NUM 1
            case 36://Home
                data.cx += (window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight) * 0.9;
                posSync(false);
                break;
            case 68://D : 右翻页
            case 99://NUM 3
            case 35://End
                data.cx -= (window.innerHeight > window.innerWidth ? window.innerWidth : window.innerHeight) * 0.9;
                posSync(false);
                break;
            case 57://9 : 图像亮度-5%
                changeImgFilter(data.brightness - 5, data.contrast);
                break;
            case 48://0 : 图像亮度+5%
                changeImgFilter(data.brightness + 5, data.contrast);
                break;
            case 56://8 : 图像亮度重置
                changeImgFilter(100, data.contrast);
                break;
            case 79://O : 图像对比度-5%
                changeImgFilter(data.brightness, data.contrast - 5);
                break;
            case 80://P : 图像对比度+5%
                changeImgFilter(data.brightness, data.contrast + 5);
                break;
            case 73://I : 图像对比度重置
                changeImgFilter(data.brightness, 100);
                break;
            case 72://H : 控制台打印快捷键列表
                console.log("top = " + img.css("top"));
                console.log(
`快捷键列表
                   H : 控制台打印快捷键列表                    空格 : 打开笔记列表对话框                
  [ / Ctrl+鼠标上滚轮 : 缩小5%                  ] / Ctrl+鼠标下滚轮 : 放大5%               \\ / Tab : 缩放重置
                   - : 背景透明度-0.05                           = : 背景透明度+0.05          回车 : 显示或关闭背景
                   9 : 图像亮度-5%                               0 : 图像亮度+5%                8 : 图像亮度重置
                   O : 图像对比度-5%                             P : 图像对比度+5%              I : 图像对比度重置
  W / NUM 5 / PageUp : 上翻页                 S / NUM 2 / PageDown : 下翻页 
    A / NUM 1 / Home : 左翻页                      D / NUM 3 / End : 右翻页
`);
                break;
        }
    };
    document.onkeyup = function (event) {
        switch (event.keyCode) {
            case 16://shift
                data.shift = false;
                break;
            case 17://ctrl
                data.ctrl = false;
                break;
        }
    };
    $("#modal_bg,#modal_close,#noteList").click(() => {
        switchModal();
    });
    $("#modal").click(() => {
        return false;
    });
    $("#modal_bg").mousemove(function (event) {
        modalWrapper.css("background-position", (0 - (event.clientX * 280 / window.innerWidth)) + "px " + (0 - (event.clientY * 158 / window.innerHeight)) + "px")
    });
    $("a").click(function(){
        if(this.href){
            if(data.ctrl){
                window.open(this.href, "_self");
            }else {
                window.open(this.href, "_blank");
            }
        }
        return false;
    });
    //阻止鼠标右键菜单
    document.oncontextmenu = () => {
        return false;
    };
    window.onresize = () => {
        posSync(true);
    };
    //初始化图片位置
    data.cx = $("title").text() === "NOTE ENVIRONMENT" ? 0 : 100;
    data.cy = initTop + (window.innerHeight / 2);
    data.bg1x = data.cx / 2.5;
    data.bg1y = data.cy / 2.5;
    data.bg2x = data.cx / 5;
    data.bg2y = data.cy / 5;
    scaleImg(200);
    scaleImg(100);
});