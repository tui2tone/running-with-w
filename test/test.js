
const start = () => {
  const message = new Buffer('hello, ble ' + 1, 'utf-8');
  console.log(message)
  let message2 = Buffer.from([247, 162, 4, 1, 255, 253])
  console.log(message2)
  message2 = addCheckSum(message2)
  console.log(message2)

  
  const message3 = new Buffer(6)
  message3.writeUInt16BE(1, -0)
  // console.log(message3)
}

const addCheckSum = (data) => {
  const temp = [...data]
  temp.splice(-2)
  temp.shift();

  console.log(temp)

  data[data.length - 2] = temp.reduce((sum, a) => sum + a,0) % 256
  return data
}



start()