var color
var parser
var graph
let img
var canvas
var fileInput
var resultLabel

var hintLabel

const draw_size = 20

function setup() {
    //componentSetup()
    fileInput = createFileInput(handleFile)
    canvas = createCanvas(200, 200)

    eraser = createButton("清除")
    eraser.id("eraser-button")
    eraser.mousePressed(changeBackground)

    parser = createButton("送出")
    parser.mousePressed(parseImage)
    parser.id("parse-button")

    resultLabel = createP("辨識結果：")
    hintLabel = createP("您可以選擇上傳圖片檔並按送出或是使用上方手寫板（綠框）來進行辨識")
    hintLabel.id('hint-label')

    fileInput.parent('tool-list')
    eraser.parent('tool-list')
    parser.parent('tool-list')
    resultLabel.parent('container')
    canvas.parent('container')
    hintLabel.parent('container')

    color = color(0, 0, 0)
    background(255)
    colorMode(RGB)
}

function componentSetup() {
    header = createElement('h2', '雲端技術實務期末專題-虛擬化部署手寫數字辨識網頁')
    href = createA('https://hackmd.io/@qaz5823091/rJJBHWcUn', '過程筆記')
}

function draw() {
    if (img) {
        image(img, 200, 200);
    }
}

function mouseReleased() {
    parseImage()
}

function mouseClicked() {
    stampCircle(color)
}

function mouseDragged() {
    stroke(color)
    if (mouseX < 390) {
        strokeWeight(draw_size)
        line(mouseX, mouseY, pmouseX, pmouseY)
    }
}

function changeBackground() {
    background(255)

    if (img) {
        img.remove()
    }
}


function handleFile(file) {
    if (img) {
        img.remove()
    }

    if (file.type == 'image') {
        img = createImg(file.data)
        img.size(200, 200)
        img.parent('container')
    }
    else {
        img = null
    }
}

function parseImage() {
    let imageData

    if (img) {
        imageData = img.elt.currentSrc
    }
    else {
        imageData = canvas.elt.toDataURL("image/png")
    }


    httpPost('/', 'text', imageData, function onSuccess(result) {
        resultLabel.html('辨識結果：' + result)
    })
}

function stampCircle(c){
    fill(color)
    noStroke()
    circle(mouseX, mouseY, draw_size, draw_size)
}