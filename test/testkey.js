'use strict';

const ioHook = require('iohook');
let i = 0;
let pressure = 0
let isPressing = false;
let pressTimeout = null;
let previousSpeed = 0;
let speed = 0;

ioHook.on('keydown', (event) => {
  if (event.keycode == 17) {
    isPressing = true;
  }
});

ioHook.on('keyup', (event) => {
  if (event.keycode == 17) {
    isPressing = false;
  }
});

setInterval(() => {
  if (previousSpeed != speed) {
    previousSpeed = speed;
    console.log("speed", speed)
  }
}, 60)

setInterval(() => {
  if (!isPressing && pressure >= 2) {
    pressure -= 2;
    speed = Math.round(pressure / 20)
  }

  if (isPressing && pressure < 140) {
    pressure += 2;
    speed = Math.round(pressure / 20)
  }
}, 60)

// Register and start hook
ioHook.start();