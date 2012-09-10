var loadImages = function(paths, callback) {
    if(paths.length > 1)
        loadImage(paths.pop(), function() { loadImages(paths, callback); });
    else
        loadImage(paths.pop(), callback);
}

var loadImage = function(path, callback) {
    var img = document.createElement("img");
    img.onload = function() { if(callback) callback(img); };
    img.src = path;
};

var getImageData = function(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    return ctx.getImageData(0, 0, img.width, img.height);
};

function rgbByteToFloat(r, g, b) {
    return [r / 256, g / 256, b / 256];
}

function mix(start, end, mix) {
    return start * (1 - mix) + end * mix;
}

function mod(x, y) {
    return ((x % y) + y) % y;
}

function sign(x) {
    return x < 0 ? -1 : 1;
}

function clamp(x, min, max) {
    return Math.min(Math.max(x, min), max);
}

function absClamp(x, min, max) {
    if(Math.abs(x) < min)
        return 0;
    if(Math.abs(x) > max)
        return max * sign(x);
    else
        return x;
}

function bindFn(fn, thisObject) {
    return function() { fn.apply(thisObject, arguments); };
}