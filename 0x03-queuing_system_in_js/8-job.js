import { Job, Queue } from "kue";

const JOB_QUEUE_NAME = "push_notification_code_3";

/**
 * Job creator for sending push notifications to users
 * @param {Array<Job>} jobs Job
 * @param {Queue} queue Job queue
 */
export default function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) throw new Error("Jobs is not an array");
  for (const job of jobs) {
    const a_job = queue.create(JOB_QUEUE_NAME, job).save((error) => {
      if (!error) console.log(`Notification job created: ${a_job.id}`);
    });

    /* Add event listeners when job is complete
    *   fails or emits some progress
    */
    a_job
      .on("complete", () => {
        console.log(`Notification job ${a_job.id} completed`);
      })
      .on("progress", (progress) => {
        console.log(`Notification job #${a_job.id} ${progress}% complete`);
      })
      .on("failed", (error) => {
        console.log(`Notification job #${a_job.id} failed: ${error}`);
      });
  }
}
