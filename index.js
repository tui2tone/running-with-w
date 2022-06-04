'use strict'

const noble = require('noble');
const ioHook = require('iohook');

let pressure = 0
let isPressing = false;
let pressTimeout = null;
let previousSpeed = 0;
let speed = 0;

const start = () => {

  noble.on('discover', peripheral => {
    const name = ((peripheral || {}).advertisement || {}).localName || ""

    if (name.indexOf("R1 Pro") > -1) {
      startRunner(peripheral);
    }
  });

  noble.startScanning();
}

const onConnect = async (peripheral) => {
  return new Promise((resolve, reject) => {
    peripheral.connect((err) => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

const getClient = async (peripheral) => {
  return new Promise((resolve, reject) => {
    peripheral.discoverAllServicesAndCharacteristics((err, services, characteristics) => {
      if (err) {
        return reject(err)
      }

      const client = characteristics.find(m => m.uuid == "fe02");
      resolve(client)
    })
  })
}

const startRunner = async (peripheral) => {
  try {
    await onConnect(peripheral)
    console.log("connected")

    const client = await getClient(peripheral)

    await sentCmd(client, startCmd())
    await delay(5)
    await sentCmd(client, changeSpeedCmd(0.5))

    subscribeKey(client)


  } catch (error) {
    console.error(error)
  }
}

const subscribeKey = async (client) => {
  
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

  setInterval(async () => {
    if (previousSpeed != speed) {
      previousSpeed = speed;
      console.log("speed", speed)

      if (speed == 0) {
        await sentCmd(client, changeSpeedCmd(0.5))
      } else {
        await sentCmd(client, changeSpeedCmd(speed))
      }
    }
  }, 100)

  setInterval(() => {
    if (!isPressing && pressure >= 2) {
      pressure -= 2;
      speed = Math.round(pressure / 20)
    }
  
    if (isPressing && pressure < 120) {
      pressure += 2;
      speed = Math.round(pressure / 20)
    }
  }, 60)

  ioHook.start();
}


const sentCmd = async (client, cmd) => {
  return new Promise((resolve, reject) => {
    client.write(cmd, true, (error) => {
      if (error) {
        console.error(error)
        return reject(error)
      }
      resolve()
    });
  });
}

const delay = async (sec) => {
  return await new Promise(resolve => setTimeout(resolve, sec * 1000));
}

const changeSpeedCmd = (speed) => {
  return addCheckSum(Buffer.from([247, 162, 1, speed * 10, 255, 253]))
}

const startCmd = () => {
  return addCheckSum(Buffer.from([247, 162, 4, 1, 255, 253]))
}

const addCheckSum = (data) => {
  const temp = [...data]
  temp.splice(-2)
  temp.shift();

  data[data.length - 2] = temp.reduce((sum, a) => sum + a, 0) % 256
  return data
}

start()