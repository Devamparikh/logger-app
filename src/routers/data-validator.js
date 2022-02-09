const amqp = require('amqplib');

require('amqplib/callback_api')
.connect('amqp://localhost', function(err, connection) {
  if (err != null) bail(err);
  consumer(connection);
});



var queue = 'dataValidator';


function consumer(connection) {
    var ok = connection.createChannel(on_open);
    function on_open(err, channel) {
      if (err != null) bail(err);
      channel.assertQueue(queue);
      channel.consume(queue, function(msg) {
        if (msg !== null) {
          console.log(msg.content.toString());
           input = JSON.parse(message.content.toString())
        //   ch.ack(msg);
            



        }
      });
    }
  }
  

// await console.log(please);

// var input = '';
// (async () => {
// 	const connection = await amqp.connect('amqp://localhost:5672')
//     const channel = await connection.createChannel()
//     QUEUE = 'dataValidator'

//     const result = await channel.assertQueue(QUEUE)
//     const unknown = await channel.consume(QUEUE, message => {
//         // console.log(message);
//     input = JSON.parse(message.content.toString())
//     // if((input.randomNumber % 10) == 0)
//     // console.log(input)
// })
// // console.log(input)

// // console.log(unknown);
// })();
// console.log(input);