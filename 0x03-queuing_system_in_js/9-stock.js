// Express server that maintains stock of products using redis
import express from "express";
import redis from "redis";
import { promisify } from "util";

const PORT = 1245;
const listProducts = [
  { Id: 1, name: "Suitcase 250", price: 50, stock: 4 },
  { Id: 2, name: "Suitcase 450", price: 100, stock: 10 },
  { Id: 3, name: "Suitcase 650", price: 350, stock: 2 },
  { Id: 4, name: "Suitcase 1050", price: 550, stock: 5 },
];

// Start express server
const app = express();

// Create redis client
const redisClient = redis.createClient();
// Add event listeners to monitor status
redisClient
  .on("error", (error) => {
    console.log("Redis client not connected to the server: ", error.message);
  })
  .on("connect", () => {
    console.log("Redis client connected to the server");
  });

function getItemById(id) {
  const products = listProducts.filter((product) => product.Id === id);
  if (products?.length === 1) {
    return products[0];
  } else {
    return {};
  }
}

function reserveStockById(itemId, stock) {
  if (!itemId) return;
  redisClient.set(`item.${itemId}`, stock, redis.print);
}

async function getCurrentReservedStockById(itemId) {
  try {
    const getStockCount = promisify(redisClient.get).bind(redisClient);
    const reservedStockCount = await getStockCount(`item.${itemId}`);
    return reservedStockCount;
  } catch (error) {
    throw error;
  }
}

// API routes
app.get("/list_products", (req, res) => {
  const products = listProducts.map((product) => {
    return {
      itemId: product.Id,
      itemName: product.name,
      price: product.price,
      initialAvailableQuantity: product.stock,
    };
  });
  res.status(200).json(products);
});

app.get("/list_products/:itemId", async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const items = getItemById(itemId);
    if (Object.is(items, {})) {
      res.status(404).json({
        status: "Product not found",
      });
    } else {
      const product = items[0];
      const currentProductStockCount = await getCurrentReservedStockById(
        product.Id
      );
      const currentProduct = {
        itemId: product.Id,
        itemName: product.name,
        price: product.price,
        initialAvailableQuantity: product.stock,
        currentQuantity: currentProductStockCount,
      };
      res.status(200).json(currentProduct);
    }
  } catch (_) {
    res.status(404).json({
      status: "Product not found",
    });
  }
});

app.get("/reserve_product/:itemId", async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const product = getItemById(itemId);
    if (Object.is(product, {})) {
      return res.status(404).json({ status: "Product not found" });
    }
    const availableStock = await getCurrentReservedStockById(itemId);
    if (availableStock && availableStock < 1) {
      return res
        .status(404)
        .json({ status: "Not enough stock available", itemId: itemId });
    } else {
      reserveStockById(product.Id);
      return res
        .status(200)
        .json({ status: "Reservation confirmed", itemId: itemId });
    }
  } catch (error) {
    return res.status(404).json({ status: "Product not found" });
  }
});

// Start server and listen on a specified port
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

export { app };
