class Game {
	/**
	 * Game constructor, main game class
	 * @constructor
	 * @param {DeltaTime : time difference (in milliseconds) 
		* between the previous frame and the current frame} deltaTime 
	 */
	constructor(deltaTime) {
		// Setup environment
		this.fps_counter = document.querySelector("#fps_counter")
		this.canvas = document.querySelector("#canvas")
		this.context = canvas.getContext('2d')
		this.mouse = new Vector(0, 0)

		this.deltaTime = deltaTime

		this.balls = this.create_balls(20, 10, 100)

		// Positions of the grabbed ball and its id (index in the ball list)
		this.grabbed_pos = new Vector(0, 0)
		this.grabbed_ball_id = false

		// Events that handler the grab / mouve / drop balls
		this.canvas.addEventListener('mousemove', this.save_mouse_pos.bind(this), false)
		this.canvas.addEventListener('mousedown', this.grab_ball.bind(this), false)
		this.canvas.addEventListener('mouseup', this.release_ball.bind(this), false)

		setInterval(function() {
			game.update(deltaTime)
			game.draw()
		}, deltaTime)
	}

	/**
	 * Ball factory
	 * @param {Number of desired balls to be created} nb_balls 
	 * @param {Minimum possible size of a ball} min_size 
	 * @param {Maximum possible size of a ball} max_size 
	 */
	create_balls(nb_balls=20, min_size=15, max_size=100) {
		let balls = []

		for(let i=0; i < nb_balls; i++) {
			let x = Math.random() * this.canvas.width
			let y = Math.random() * this.canvas.height
			let r = Math.random() * max_size + min_size
			let c = this.get_random_color()
			let m = this.calculate_mass(c, r)
			c = "rgb(" + c.r + ", " + c.g + ", " + c.b + ")"

			balls.push(new Ball(i, x, y, r, m, c))
		}

		return balls
	}

	/**
	 * Calculate mass
	 * @param {Color (0-255, 0-255, 0-255)} c 
	 * @param {Radius} r 
	 */
	calculate_mass(c, r) {
		let half_radius = 127 / 255 * r
		let half_color = 128 / 255 * (c.r / 255 + c.g / 255 + c.b / 255)

		return half_radius + half_color
	}

	/**
	 * Random color generator
	 */
	get_random_color() {
		let r = Math.random() * 255
		let g = Math.random() * 255
		let b = Math.random() * 255

		return {r: r, g: g, b: b}
	}

	/**
	 * Save mouse position
	 * @param {Event} evt 
	 */
	save_mouse_pos(evt) {
		var rect = canvas.getBoundingClientRect(),
		scaleX = canvas.width / rect.width,
		scaleY = canvas.height / rect.height
		this.mouse = new Vector((evt.clientX - rect.left) * scaleX, (evt.clientY - rect.top) * scaleY)
	}

	/**
	 * Save mouse position and ball index position in list
	 * @param {Event} evt 
	 */
	grab_ball(evt) {
		for(var i=0; i < this.balls.length; i++) {
			if (this.balls[i].do_point_circle_collide(this.mouse)) {
				this.grabbed_pos = this.mouse
				this.grabbed_ball_id = i
				break
			}
		}
	}

	/**
	 * Free the grabbed_id and grabbed_pos variables and speedup the released ball
	 * @param {Event} evt 
	 */
	release_ball(evt) {
		if (this.grabbed_ball_id !== false) {
			this.balls[this.grabbed_ball_id].velocity.x = 5 * (this.grabbed_pos.x - this.mouse.x)
			this.balls[this.grabbed_ball_id].velocity.y = 5 * (this.grabbed_pos.y - this.mouse.y)
			this.grabbed_pos = new Vector(0, 0)
			this.grabbed_ball_id = false
		}
	}

	/**
	 * Update the balls
	 * @param {DeltaTime : time difference (in milliseconds) 
	 * between the previous frame and the current frame} deltaTime 
	 */
	update(deltaTime) {
		var t0 = performance.now();
		this.save_mouse_pos.bind(this)
		this.balls.forEach(ball => ball.update(deltaTime, this.canvas, this.mouse, this.balls))
		var t1 = performance.now();
		this.fps_counter.innerHTML = this.deltaTime / (t1 - t0) + " FPS"
	}

	/**
	 * Draw the stage
	 */
	draw() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
		this.balls.forEach(ball => ball.draw(this.context))
		this.context.restore()

		if (this.grabbed_ball_id) {
			let diff = new Vector(this.grabbed_pos.y - this.mouse.y, this.grabbed_pos.x - this.mouse.x)
			let module = Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2))
			let angle = Math.atan2(diff.x, diff.y)

			this.context.beginPath();
			this.context.moveTo(this.balls[this.grabbed_ball_id].pos.x, this.balls[this.grabbed_ball_id].pos.y);
			this.context.lineTo(this.balls[this.grabbed_ball_id].pos.x + Math.cos(angle) * module, this.balls[this.grabbed_ball_id].pos.y + Math.sin(angle) * module);
		}
		this.context.stroke()
	}
}