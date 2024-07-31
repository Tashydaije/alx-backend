import express from "express";
import { createClient } from "redis";
import { createQueue } from "kue";
import { promisify } from "util";

const NUM_AVAILABLE_SEATS = 50;
let reservationEnabled = true;

// Start redis client
const redisClient = createClient()
  .on("error", (error) => {
    console.log("Redis client not connected to the server: ", error.message);
  })
  .on("connect", () => {
    console.log("Redis client connected to the server");
    redisClient.set("available_seats", NUM_AVAILABLE_SEATS);
  });

/**
 * Reserves a seat for a user
 * @param {number} number Number of seats to reserve
 */
function reserveSeat(number) {
  redisClient.set("available_seats", number);
}

/**
 * Gets the available number of reservable seats
 * @returns {number} Number of available seats
 */
async function getCurrentAvailableSeats() {
  const getSeatCount = promisify(redisClient.get).bind(redisClient);
  const numOfSeats = await getSeatCount("available_seats");
  return numOfSeats;
}

// Create a job queue
const reservationQueue = createQueue();

const app = express();

// Routes
app.get("/available_seats", (req, res) => {
  const availableSeats = getCurrentAvailableSeats();
  res.status(200).json({ numberOfAvailableSeats: availableSeats });
});

app.get("/reserve_seat", (req, res) => {
  if (reservationEnabled) {
    return res.status(400).json({ status: "Reservation are blocked" });
  }
  const job = reservationQueue.create("reserve_seat").save((error) => {
    if (error) {
      res.status(500).json({ status: "Reservation failed" });
    }
  });
  job
    .on("complete", () => {
      console.log(`Seat reservation job ${job.id}`);
    })
    .on("failed", (error) => {
      console.error(`Seat reservation job ${job.id} failed: ${error}`);
    });
  return res.status(200).json({ status: "Reservation in process" });
});

app.get("/process", async (req, res) => {
  res.status(200).json({ status: "Queue processing" });
  reservationQueue.process("reserve_seat", (job, done) => {
    reserveSeat(getCurrentAvailableSeats() - 1);
    const newAvailableSeats = getCurrentAvailableSeats();
    if (newAvailableSeats === 0) {
      reservationEnabled = false;
    }
    if (newAvailableSeats >= 0) {
      done();
    } else {
      done(new Error("Not enough seats available"));
    }
  });
});

export { app };
