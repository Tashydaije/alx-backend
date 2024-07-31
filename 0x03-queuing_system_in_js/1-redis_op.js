import { createClient, print } from "redis";

const client = createClient()
  .on("error", (error) => {
    console.log("Redis client not connected to the server: ", error.message);
  })
  .on("connect", () => {
    console.log("Redis client connected to the server");
  });

function setNewSchool(schoolName, value) {
  // Set value in redis
  client.set(schoolName, value, print);
}

function displaySchoolValue(schoolName) {
  // Read value from store
  client.get(schoolName, (error, reply) => {
    if (error) {
      print(error);
    } else {
      console.log(reply);
    }
  });
}

displaySchoolValue("Holberton");
setNewSchool("HolbertonSanFrancisco", "100");
displaySchoolValue("HolbertonSanFrancisco");
