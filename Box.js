class Box {
    /**
     * Box class
     * @constructor
     * @param {x position} x 
     * @param {y position} y 
     * @param {w width} w 
     * @param {y height} h 
     */
    constructor(x, y, w, h) {
        this.x = x || 0
        this.y = y || 0
        this.w = w
        this.h = h
    }

    /**
     * Check collision between two AABB boxes
     * @param {AABB Box} box1 
     * @param {Other AABB Box} box2 
     */
    static collide(box1, box2) {
        return box1.x + box1.w > box2.x && box1.x < box2.x + box2.w && box1.y + box1.h > box2.y && box1.y < box2.y + box2.h
    }
}