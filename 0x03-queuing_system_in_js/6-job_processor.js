import kue from "kue";

function sendNotification(phoneNumber, message) {
  console.log(
    `Sending notification to ${phoneNumber}, with message: ${message}`
  );
}

const queue = kue.createQueue();
queue.process("push_notification_code", function (job, done) {
  if (job) {
    sendNotification(job.data.phoneNumber, job.data.message);
    done();
  }
});
