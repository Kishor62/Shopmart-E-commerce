import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./config/db.js";
import { cancelStaleUnpaidOrders } from "./services/orderService.js";

await connectDB();

const server = app.listen(env.PORT, () => {
  console.log(`🚀 Shopmart API running on http://localhost:${env.PORT} (${env.NODE_ENV})`);
});

// Every 10 min: cancel unpaid online orders older than 30 min and release their stock
const job = setInterval(async () => {
  try {
    const n = await cancelStaleUnpaidOrders(30);
    if (n) console.log(`🧹 Cancelled ${n} stale unpaid order(s)`);
  } catch (e) {
    console.error("Cleanup job failed:", e.message);
  }
}, 10 * 60 * 1000);
job.unref();

// Graceful shutdown
async function shutdown(signal) {
  console.log(`\n${signal} received, shutting down...`);
  clearInterval(job);
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection:", err);
});
