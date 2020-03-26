# Pool-Game-Web
Web pool game on web canvas using javascript

Engine created with maths, geometric equations and vector calculations : 

## Ball collision detection
_Collision detection algorithms_

### Box / Box :
```javascript
	/**
	 * Check rect collision between two different balls (rect collision detection)
	 * @param {Other ball} other 
	 */
	do_rect_collide(other) {
		return Box.collide(this.get_AABB(), other.get_AABB())
	}
```

### Point / Circle :
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

### Circle / Circle :
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

## Ball collision response
Method that allows to replace and change the trajectory of two differents balls taht collides with each other

```javascript
if (this.do_rect_collide(other)) {
			if (this.do_circle_collide(other)) {
				let fDistance = Math.sqrt((this.pos.x - other.pos.x)*(this.pos.x - other.pos.x) + (this.pos.y - other.pos.y)*(this.pos.y - other.pos.y));

				// Normal
				let nx = (other.pos.x - this.pos.x) / fDistance;
				let ny = (other.pos.y - this.pos.y) / fDistance;

				// Tangent
				let tx = -ny;
				let ty = nx;

				// Dot Product Tangent
				let dpTan1 = this.velocity.x * tx + this.velocity.y * ty;
				let dpTan2 = other.velocity.x * tx + other.velocity.y * ty;

				// Dot Product Normal
				let dpNorm1 = this.velocity.x * nx + this.velocity.y * ny;
				let dpNorm2 = other.velocity.x * nx + other.velocity.y * ny;

				// Conservation of momentum in 1D
				let m1 = (dpNorm1 * (this.mass - other.mass) + 2 * other.mass * dpNorm2) / (this.mass + other.mass);
				let m2 = (dpNorm2 * (other.mass - this.mass) + 2 * this.mass * dpNorm1) / (this.mass + other.mass);

				// Calculate displacement required
				let fOverlap = 0.5 * (fDistance - this.radius - other.radius);

				// Displace Current Ball away from collision
				this.pos.x -= fOverlap * (this.pos.x - other.pos.x) / fDistance;
				this.pos.y -= fOverlap * (this.pos.y - other.pos.y) / fDistance;

				// Displace Target Ball away from collision
				other.pos.x += fOverlap * (this.pos.x - other.pos.x) / fDistance;
				other.pos.y += fOverlap * (this.pos.y - other.pos.y) / fDistance;

				// Wikipedia Version - Maths is smarter but same
				let kx = (this.velocity.x - other.velocity.x)
				let ky = (this.velocity.y - other.velocity.y)
				let p = 2.0 * (nx * kx + ny * ky) / (this.mass + other.mass)
				this.velocity.x = this.velocity.x - p * other.mass * nx
				this.velocity.y = this.velocity.y - p * other.mass * ny
				other.velocity.x = other.velocity.x + p * this.mass * nx
				other.velocity.y = other.velocity.y + p * this.mass * ny
			}
		}
```
