'use strict'

// https://www.w3.org/TR/screen-orientation/
// (3.2) #screenorientation-interface

function calcScreenAngle (deviceAngle) {
  // When device rotates 90deg clockwise, screen compensates by rotating 90deg
  // counterclockwise, then screen angle becomes 270deg.
  let angle = -deviceAngle % 360
  if (angle < 0) {
    angle = 360 + angle
  }
  angle = Math.floor((angle + 45) / 90) * 90
  angle %= 360
  return angle
}

module.exports = calcScreenAngle
