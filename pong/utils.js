function clamp(value, min, max) {
	return Math.min(max, Math.max(min, value))
}

function absMax(value, max) {
	if (value < 0) {
		value = Math.max(-max, value)
	}
	if (value > 0) {
		value = Math.min(max, value)
	}
	return value
}

function absMin(value, min) {
	if (value < 0) {
		value = Math.min(-min, value)
	}
	if (value > 0) {
		value = Math.max(min, value)
	}
	return value
}

function dist(a, b) {
	return Math.abs(a - b)
}

function smoothValueChange(value, target, maxStep) {
	var step = (target - value) * 0.1
	value += absMax(step, maxStep)
	return value
}