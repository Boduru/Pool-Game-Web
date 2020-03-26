class Ball {
	/**
	 * Ball class
	 * @param {ID of the ball} id 
	 * @param {Position x on the canvas} x 
	 * @param {Position y on the canvas} y 
	 * @param {Radius of the ball} radius 
	 * @param {Mass of the ball} mass 
	 * @param {Color of the ball} color 
	 */
	constructor(id, x, y, radius, mass, color) {
		this.id = id
		this.mass = mass
		this.color = color
		this.radius = radius
		this.pos = new Vector(x, y)
		this.velocity = new Vector(0, 0)
		this.friction = 0.007
	}

	/**
	 * Return AABB Box of the ball
	 */
	get_AABB() {
		let x = this.pos.x - this.radius
		let y = this.pos.y - this.radius
		let w = 2 * this.radius
		let h = w

		return new Box(x, y, w, h)
	}

	/**
	 * Update the ball on the canvas
	 * @param {Elapsed time between the previous frame and the current frame (in milliseconds)} deltaTime 
	 * @param {Canvas reference} canvas 
	 * @param {Current position of the mouse relative to the canvas} mouse_pos 
	 * @param {Ball list} balls 
	 */
	update(deltaTime, canvas, mouse_pos, balls) {
		this.apply_friction()
		this.wall_collide(canvas)
		
		for(var i=0; i < balls.length; i++) {
			if (this.id != balls[i].id) {
				this.resolve_ball_collisions(balls[i])
			}
		}

		this.pos.x += this.velocity.x * deltaTime / 1000
		this.pos.y += this.velocity.y * deltaTime / 1000
	}

	/**
	 * Check rect collision between two different balls (rect collision detection)
	 * @param {Other ball} other 
	 */
	do_rect_collide(other) {
		return Box.collide(this.get_AABB(), other.get_AABB())
	}

	/**
	 * Check collision between two different balls (circle collision detection)
	 * @param {Other ball} other 
	 */
	do_circle_collide(other) {
		let abs_dist = Math.abs((this.pos.x - other.pos.x) * (this.pos.x - other.pos.x) + (this.pos.y - other.pos.y) * (this.pos.y - other.pos.y))
		let rad_sum = (this.radius + other.radius) * (this.radius + other.radius)

		return abs_dist <= rad_sum
	}

	/**
	 * Check collision between a point and the ball circle (circle & point collision detection)
	 * @param {Vector(x, y)} point 
	 */
	do_point_circle_collide(point) {
	   let d = (point.x - this.pos.x) * (point.x - this.pos.x) + (point.y - this.pos.y) * (point.y - this.pos.y)
	   return d <= this.radius * this.radius
	}

	/**
	 * Collision reponse between the two balls
	 * @param {Other ball} other 
	 */
	resolve_ball_collisions(other) {
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
	}

	/**
	 * Apply friction to the ball (slow down the speed)
	 */
	apply_friction() {
		this.velocity.x -= this.velocity.x * this.friction
		this.velocity.y -= this.velocity.y * this.friction
	}

	/**
	 * Check collisions between the pool borders and the ball
	 * and correct the position and trajectory of the ball
	 * @param {Canvas} canvas 
	 */
	wall_collide(canvas) {
		if (this.pos.x - this.radius < 0) {
			this.pos.x = this.radius
			this.velocity.x = -this.velocity.x
		}

		else if (this.pos.x > canvas.width - this.radius) {
			this.pos.x = canvas.width - this.radius
			this.velocity.x = -this.velocity.x
		}

		if (this.pos.y > canvas.height - this.radius) {
			this.pos.y = canvas.height - this.radius
			this.velocity.y = -this.velocity.y
		}

		else if (this.pos.y - this.radius < 0) {
			this.pos.y = this.radius
			this.velocity.y = -this.velocity.y
		}
	}

	/**
	 * Draw the ball
	 * @param {Context} context 
	 */
	draw(context) {
		context.beginPath()
		context.arc(this.pos.x, this.pos.y, this.radius, 0, 2 * Math.PI, true)
		context.fillStyle = this.color
		context.fill()
		context.stroke()
	}
}
