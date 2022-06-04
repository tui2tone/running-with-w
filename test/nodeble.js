const {createBluetooth} = require('node-ble')
const {bluetooth, destroy} = createBluetooth()

const start = async () => {
  const adapter = await bluetooth.defaultAdapter()
  if (! await adapter.isDiscovering())
  await adapter.startDiscovery()

  // const device = await adapter.waitDevice('00:1a:7d:da:71:15')
  // await device.connect()
  // const gattServer = await device.gatt()
}

start()