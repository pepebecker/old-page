window.game = {
	FPS: 120,
	running: true,
	rockets: []
}

function setupCanvas(width, height) {

	window.canvas = document.getElementById('canvas')
	window.canvas.width = width
	window.canvas.height = height

	if (document.body.clientWidth < width) {
		var ratio = width / height
		width = document.body.clientWidth
		height = width / ratio
	}

	if (document.body.clientHeight < height) {
		var ratio = height / width
		height = document.body.clientHeight
		width = height / ratio
	}

	window.canvas.style.width = `${width}px`
	window.canvas.style.height = `${height}px`
	window.canvas.style.position = 'fixed'
	window.canvas.style.left = '50%'
	window.canvas.style.top = '50%'
	window.canvas.style.marginLeft = `${-(width / 2)}px`
	window.canvas.style.marginTop = `${-(height / 2)}px`
	window.canvas.style.border = '1px solid black'
	window.canvas.style.background = 'black'

	window.context = window.canvas.getContext('2d')
}

function Rocket(x, y, target = undefined) {
	this.x = x
	this.y = y
	this.w = 10
	this.h = 100
	this.maxSpeed = 5
	this.color = 'red'
	this.aiTarget = target
	this.offset = 0
	this.getCenter = function() {
		return this.y + (this.h / 2)
	}
	this.setCenter = function(y) {
		this.y = y - (this.h / 2)
	}
	this.update = function() {
		this.y = clamp(this.y, 0, window.canvas.height - this.h)
	}
	this.draw = function(ctx) {
		var backupStyle = ctx.fillStyle
		ctx.fillStyle = this.color
		ctx.fillRect(this.x, this.y, this.w, this.h)
		ctx.fillStyle = backupStyle
	}
}

function Ball(x, y, r) {
	this.x = x
	this.y = y
	this.r = r
	this.dx = 0
	this.dy = 0
	this.color = 'white'
	this.maxSpeed = 6
	this.update = function() {
		this.dx = clamp(this.dx, -this.maxSpeed, this.maxSpeed)
		this.dy = clamp(this.dy, -this.maxSpeed, this.maxSpeed)

		this.x += this.dx
		this.y += this.dy

		if (this.y < this.r) {
			this.dy = Math.abs(this.dy)
		}

		if (this.y > window.canvas.height - this.r) {
			this.dy = -Math.abs(this.dy)
		}

		for (var i = 0; i < window.game.rockets.length; i++) {
			var rocket = window.game.rockets[i]
			if (ball.x < rocket.x + rocket.w && ball.x > rocket.x) {
				if (ball.y + ball.r > rocket.y && ball.y - ball.r < rocket.y + rocket.h) {
					var vecY = (ball.y - (rocket.y + rocket.h / 2)) / 40
					ball.dy += vecY
					ball.dx = -ball.dx
					rocket.offset = 0
				} else {
					rocket.offset = 0
					main()
				}
			}
		}
	}
	this.draw = function(ctx) {
		var backupStyle = ctx.fillStyle
		ctx.fillStyle = this.color
		ctx.beginPath()
		ctx.arc(this.x ,this.y ,this.r , 0, 2 * Math.PI)
		ctx.fill()
		ctx.fillStyle = backupStyle

		// if (!window.game.running) {
		// 	var backupStyle = ctx.strokeStyle
		// 	ctx.strokeStyle = 'red'
		// 	ctx.beginPath()
		// 	ctx.moveTo(this.x, this.y)

		// 	var magnitude = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2))
		// 	var diffY = ball.dy>0?window.canvas.height-ball.y:ball.y
		// 	var endX = this.x + this.dx / magnitude * 100
		// 	// var endY = this.y + this.dy / magnitude * diffY
		// 	var endY = ball.dy>0?window.canvas.height:0
		// 	ctx.lineTo(endX, endY)


		// 	if (endY <= 0) {
		// 		// endY = -endY
		// 		ctx.moveTo(endX, endY)
		// 		ctx.lineTo(ball.dx>0?width:0, ball.y)
		// 	}

		// 	if (endY >= window.canvas.height) {
		// 		// endY = -endY
		// 		ctx.moveTo(endX, endY)
		// 		ctx.lineTo(ball.dx>0?width:0, ball.y)
		// 	}


		// 	ctx.stroke()
		// 	ctx.strokeStyle = backupStyle
		// }
	}
}

setupCanvas(800, 600)

var ball = new Ball(30, window.canvas.height / 2, 6)
window.game.rockets.push(new Rocket(20, window.canvas.height / 2 - 50))
window.game.rockets.push(new Rocket(window.canvas.width - 30, window.canvas.height / 2 - 50, ball))

function logic() {
	for (var i = 0; i < window.game.rockets.length; i++) {
		window.game.rockets[i].update()
	}

	if (!window.game.running)
		return

	ball.update()
}

function render() {
	window.context.clearRect(0, 0, window.canvas.width, window.canvas.height)

	window.context.strokeStyle = 'white'
	window.context.beginPath()
	window.context.moveTo(window.canvas.width / 2, 0)
	window.context.lineTo(window.canvas.width / 2, window.canvas.height)
	window.context.stroke()

	for (var i = 0; i < window.game.rockets.length; i++) {
		window.game.rockets[i].draw(window.context)
	}

	ball.draw(window.context)
}

function update() {
	logic()
	render()
}

function main() {
	ball.x = 30
	ball.y = window.canvas.height / 2
	ball.dx = 2
	ball.dy = 0
	window.game.rockets[0].y = window.canvas.height / 2 - window.game.rockets[0].h / 2
	if (window.gameInterval !== undefined) {
		clearInterval(window.gameInterval)
	}
	window.gameInterval = setInterval(update, 1000 / window.game.FPS)
}
