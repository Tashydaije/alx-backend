import { createClient } from "redis";

const CHANNEL = "holberton school channel";

const redisClient = createClient()
  .on("connect", () => {
    console.log("Redis client connected to the server");
  })
  .on("error", (error) => {
    console.log("Redis client not connected to the server:", error.message);
  });

redisClient.subscribe(CHANNEL);
redisClient.on("message", (channel, message) => {
  console.log(message);
  if (message === "KILL_SERVER") {
    redisClient.unsubscribe(channel);
    redisClient.quit();
  }
});
