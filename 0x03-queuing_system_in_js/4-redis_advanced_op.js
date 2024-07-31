import { createClient, print } from "redis";

const KEY = "HolbertonSchools";
const redisClient = createClient()
  .on("error", (error) => {
    console.log("Redis client not connected to the server: ", error.message);
  })
  .on("connect", () => {
    console.log("Redis client connected to the server");
  });

redisClient.hset(
  KEY,
  [
    'Portland', '50',
    'Seattle', '80',
    'New York', 20,
    'Bogota', 20,
    'Cali', 40,
    'Paris', 2,
  ],
  print
);

redisClient.hgetall(KEY, (error, reply) => {
  if (error) {
    print(error);
  } else {
    console.log(reply);
  }
});
