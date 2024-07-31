import { createClient, print } from "redis";
import { promisify } from 'util';

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

async function displaySchoolValue(schoolName) {
  // Read value from store
  try{
    const getValue = promisify(client.get).bind(client);
    const value = await getValue(schoolName);
    console.log(value);
  } catch (error) {
    print(error);
  }
}

displaySchoolValue("Holberton").then(() => {
    setNewSchool("HolbertonSanFrancisco", "100");
    displaySchoolValue("HolbertonSanFrancisco");
});
