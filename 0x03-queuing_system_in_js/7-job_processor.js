import kue, { Job } from "kue";

const TOTAL_JOB_PROGRESS = 100;
const QUEUE_NAME = "push_notification_code_2";
const MAX_ACTIVE_JOBS = 2;
const blacklistedPhoneNumbers = ["4153518780", "4153518781"];

/**
 * Sends a notification to a phone number
 * @param {string} phoneNumber - A user's phone number
 * @param {string} message - Message sent to user
 * @param {Job} job - Job process
 * @param {Function} done - Job `done` callback if successful or on error
 * @description - We send the email and emit the progress as well.
 * @returns {void} Nothing
 */
function sendNotification(phoneNumber, message, job, done) {
  job.progress(0, TOTAL_JOB_PROGRESS);
  if (blacklistedPhoneNumbers.includes(phoneNumber)) {
    done(new Error(`Phone number ${phoneNumber} is blacklisted`));
    return;
  }
  // Update progress halfway
  job.progress(50, TOTAL_JOB_PROGRESS);
  // Send notication
  console.log(
    `Sending notification to ${phoneNumber}, with message: ${message}`
  );
  done();
}

// Create job queue for emails
const jobQueue = kue.createQueue();

// Send a notification for each job
jobQueue.process(QUEUE_NAME, MAX_ACTIVE_JOBS, (job, done) => {
  const phoneNumber = job.data.phoneNumber;
  const message = job.data.message;
  sendNotification(phoneNumber, message, job, done);
});
