import kue from "kue";

const jobQueue = kue.createQueue({ name: "push_notification_code" });
const jobData = {
  phoneNumber: "+254123456789",
  message: "Job queues with kue, redis and nodejs",
};
const job = jobQueue.create("push_notification_code", jobData).save((error) => {
  if (!error) console.log("Notification job created:", job.id);
});
job
  .on("complete", () => console.log("Notification job completed"))
  .on("failed", () => console.log("Notification job failed"));
