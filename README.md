# Pool-Game-Web
Web pool game on web canvas using javascript

Engine created with maths, geometric equations and vector calculations : 

##Ball collision detection
_Collision detection algorithms_

###Box / Box :
```javascript
	/**
	 * Check rect collision between two different balls (rect collision detection)
	 * @param {Other ball} other 
	 */
	do_rect_collide(other) {
		return Box.collide(this.get_AABB(), other.get_AABB())
	}
```

###Point / Circle :
```javascript
	/**
	 * Check collision between a point and the ball circle (circle & point collision detection)
	 * @param {Vector(x, y)} point 
	 */
	do_point_circle_collide(point) {
	   let d = (point.x - this.pos.x) * (point.x - this.pos.x) + (point.y - this.pos.y) * (point.y - this.pos.y)
	   return d <= this.radius * this.radius
	}
```

###Circle / Circle :
```javascript
	/**
	 * Check collision between two different balls (circle collision detection)
	 * @param {Other ball} other 
	 */
	do_circle_collide(other) {
		let abs_dist = Math.abs((this.pos.x - other.pos.x) * (this.pos.x - other.pos.x) + (this.pos.y - other.pos.y) * (this.pos.y - other.pos.y))
		let rad_sum = (this.radius + other.radius) * (this.radius + other.radius)

		return abs_dist <= rad_sum
	}
```
