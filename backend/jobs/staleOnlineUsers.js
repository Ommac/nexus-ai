const User = require("../Models/User.js");

const INTERVAL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Finds users whose isOnline flag is still true but haven't had any activity
 * for more than 1 hour (based on updatedAt). This handles the edge case where
 * a socket disconnect event failed to fire (e.g. server crash, network drop,
 * ungraceful client close), leaving the user permanently marked as online.
 */
const cleanupStaleOnlineUsers = async () => {
  try {
    const oneHourAgo = new Date(Date.now() - INTERVAL_MS);

    const result = await User.updateMany(
      {
        isOnline: true,
        // If updatedAt is older than 1 hour, the disconnect handler never ran
        updatedAt: { $lt: oneHourAgo },
      },
      // Array (pipeline) form is required to reference another field's value
      // inside $set. Without it, "$updatedAt" would be treated as a literal string.
      [
        {
          $set: {
            isOnline: false,
            // Preserve the real last-seen time instead of overwriting with now
            lastSeen: "$updatedAt",
          },
        },
      ]
    );

    if (result.modifiedCount > 0) {
      console.log(
        `[staleOnlineUsers] Marked ${result.modifiedCount} stale user(s) as offline.`
      );
    }
  } catch (error) {
    console.error("[staleOnlineUsers] Job failed:", error.message);
  }
};

/**
 * Starts the recurring job. Runs once immediately on startup (so stale users
 * from a previous server crash are cleaned up right away), then repeats every
 * hour.
 */
const startStaleOnlineUsersJob = () => {
  console.log("[staleOnlineUsers] Job started — runs every 1 hour.");

  // Run once immediately on server start to clean up any leftovers from a
  // previous crash or ungraceful shutdown
  cleanupStaleOnlineUsers();

  // Then repeat on a fixed interval
  setInterval(cleanupStaleOnlineUsers, INTERVAL_MS);
};

module.exports = { startStaleOnlineUsersJob };
