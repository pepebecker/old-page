var upKeyPressed = false
var downKeyPressed = false

window.inputInterval = setInterval(handleInput, 1000 / window.game.FPS)

document.addEventListener('keydown', function(event) {
	if(event.keyCode == 38) {
		upKeyPressed = true
	}
	if(event.keyCode == 40) {
		downKeyPressed = true
	}
	if(event.keyCode == 65) {
		if (window.game.rockets[0].aiTarget === undefined) {
			window.game.rockets[0].aiTarget = ball
		} else {
			window.game.rockets[0].aiTarget = undefined
		}
	}
})

document.addEventListener('keyup', function(event) {
	if(event.keyCode == 38) {
		upKeyPressed = false
	}
	if(event.keyCode == 40) {
		downKeyPressed = false
	}
	if(event.keyCode == 27) {
		window.game.running = !window.game.running
	}
})


function handleInput() {
	var speed = 0
	var rocket = window.game.rockets[0]
	if (upKeyPressed) {
		speed -= rocket.maxSpeed
	}
	if (downKeyPressed) {
		speed += rocket.maxSpeed
	}
	rocket.y += speed * 0.5
}
