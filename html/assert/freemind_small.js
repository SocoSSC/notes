$(function () {
    const imgData = {
        mdx: 0,//鼠标按下时的鼠标位置
        mdy: 0,
        ox: 0,//鼠标按下时的图片位置
        oy: 0,
        cx: 0,//图片实时位置
        cy: 0,
        direction: true,//true竖向滚动，否则横向
        scale: 100,//图片缩放百分比
        imgWidth: 0,//图片原始宽高
        imgHeight: 0,
        modalVisible: false,//模态框的显示状态
    };
    const html = $("html");
    const img = $("#image");
    const imgNode = $("#image>img")[0];
    const modalWrapper = $("#modalWrapper");
    imgNode.draggable = false;
    imgData.imgWidth = imgNode.width;
    imgData.imgHeight = imgNode.height;
    //拖拽图片
    function moveImg(event) {
        imgData.cx = imgData.ox + (event.pageX - imgData.mdx);
        imgData.cy = imgData.oy + (event.pageY - imgData.mdy);
        img.css("left", imgData.cx + "px").css("top", imgData.cy + "px");
        posCheck();
    };
    //图片位置检查
    function posCheck(){
        let ml = window.innerWidth - imgNode.width - 400;
        let mt = window.innerHeight - imgNode.height - 400;
        if(imgData.cx < ml){
            imgData.cx = ml;
            img.css("left", ml + "px");
        }
        if(imgData.cy < mt){
            imgData.cy = mt;
            img.css("top", mt + "px");
        }
        if(imgData.cx > 400){
            imgData.cx = 400;
            img.css("left", "400px")
        }
        if(imgData.cy > 400){
            imgData.cy = 400;
            img.css("top", "400px")
        }
        html.css("background-position", (imgData.cx / 2.5) + "px " + (imgData.cy / 2.5) + "px");
    };
    //图片缩放, 参数为是否放大
    function scaleImg(magnify){
        let newScale = imgData.scale;
        if(magnify){
            if(imgData.scale >= 200){
                return;
            }
            newScale += 5;
        }else {
            if(imgData.scale <= 20){
                return;
            }
            newScale -= 5;
        }
        let ww = window.innerWidth / 2;
        let wh = window.innerHeight / 2;
        let newCx = (imgData.cx - ww) * newScale / imgData.scale + ww;
        let newCy = (imgData.cy - wh) * newScale / imgData.scale + wh;
        let newWidth = imgData.imgWidth * newScale / 100;
        let newHeight = imgData.imgHeight * newScale / 100;
        imgNode.width = newWidth;
        imgNode.height = newHeight;
        imgData.cx = newCx;
        imgData.cy = newCy;
        imgData.scale = newScale;
        img.css("left", imgData.cx + "px").css("top", imgData.cy + "px");
        $("#scale").html(imgData.scale + "%");
        posCheck();
    };
    //模态框的开启关闭状态切换
    function switchModal(){
        imgData.modalVisible = !imgData.modalVisible;
        if(imgData.modalVisible){
            $("#modal_bg,#modal").addClass("show");
            $("#viewer,#noteList").addClass("hide");
        }else{
            $("#modal_bg,#modal").removeClass("show");
            $("#viewer,#noteList").removeClass("hide");
        }
    };
    $("#viewer").mousedown(function (event) {
        imgData.mdx = event.pageX;
        imgData.mdy = event.pageY;
        imgData.ox = parseInt(img.css("left").replace("px", ""));
        imgData.oy = parseInt(img.css("top").replace("px", ""));
        // img.css("transition", "none");
        this.onmousemove = moveImg;
    }).mouseup(function () {
        this.onmousemove = null;
        // img.css("transition", "ease 100ms");
    });
    $("#viewer")[0].onwheel = function (event) {
        if(imgData.direction){
            imgData.cy += event.wheelDelta;
            img.css("top", imgData.cy + "px");
        }else {
            imgData.cx += event.wheelDelta;
            img.css("left", imgData.cx + "px");
        }
        posCheck();
    };
    document.onkeydown = function (event) {
        switch (event.keyCode) {
            case 16://shift
                imgData.direction = false;
                break;
        }
    };
    document.onkeyup = function (event) {
        switch (event.keyCode) {
            case 16://shift
                imgData.direction = true;
                break;
        }
    };
    document.onkeypress = function (event) {
        // console.log(event.keyCode);
        switch (event.keyCode) {
            case 45://缩小 -
                scaleImg(false);
                break;
            case 61://放大 =
                scaleImg(true);
                break;
            case 91://缩小 [
                scaleImg(false);
                break;
            case 93://放大 ]
                scaleImg(true);
                break;
            case 32://空格
                switchModal();
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
            window.open(this.href, "_blank");
        }
        return false;
    });
    //阻止鼠标右键菜单
    document.oncontextmenu = () => {
        return false;
    }
});