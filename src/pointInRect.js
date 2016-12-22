let pointInRect = ([px, py], [[x, y], [width, height]]) => px > x && py > y && px < width && py < height;

module.exports = pointInRect;