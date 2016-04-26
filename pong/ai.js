function handleAI() {
	for (var i = 0; i < window.game.rockets.length; i++) {
		var rocket = window.game.rockets[i]
		if (rocket.aiTarget !== undefined) {
			var target = rocket.aiTarget
			var normalX = rocket.x - (window.canvas.width / 2)

			var targetMovingTowardsMe = ((normalX < 0 && target.dx < 0) || (normalX > 0 && target.dx > 0))
			var targetMovedHalfway = Math.abs(target.x - rocket.x) < (window.canvas.width / 2)

			if (targetMovingTowardsMe && targetMovedHalfway) {
				var targetY = target.y

				if (rocket.offset === 0) {
					if (dist(rocket.x, target.x) < 100) {
						if (Math.abs(target.dy) < 1) {
							rocket.offset = 80 * (Math.random() - 0.5)
						} else {
							rocket.offset = ((rocket.h / 2) * absMin(ball.dy, 1))
						}
					}
				}

				targetY += rocket.offset

				var center = smoothValueChange(rocket.getCenter(), targetY, 3)
				rocket.setCenter(center)
			} else {
				var center = smoothValueChange(rocket.getCenter(), window.canvas.height / 2, 1)
				rocket.setCenter(center)
			}
		}
	}
}

setInterval(handleAI, 1000 / window.game.FPS)