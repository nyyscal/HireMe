import { Inngest } from "inngest";
import { connectDB } from "./db.js";
import { User } from "../models/user.model.js";

// Create Inngest client (unique ID per project)
export const inngest = new Inngest({ id: "hire-app" });

// Sync new Clerk user to DB
const syncUserHire = inngest.createFunction(
  { id: "hire-me_sync-user" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    console.log("🔥 syncUserHire triggered!", event.id);
    try {
      await connectDB();
      const { id, email_addresses, first_name, last_name, image_url } = event.data;
      if (!id) throw new Error("Clerk user ID missing");

      const newUser = {
        clerkId: id,
        email: email_addresses?.[0]?.email_address || "",
        name: `${first_name || ""} ${last_name || ""}`.trim() || "User",
        imageUrl: image_url || "",
        addresses: [],
        wishlist: [],
      };

      await User.create(newUser);
      console.log("✅ User created in DB:", newUser.email);
    } catch (error) {
      console.error("❌ Error syncing user:", error);
      throw error;
    }
  }
);

// Delete Clerk user from DB
const deleteUserFromDBHire = inngest.createFunction(
  { id: "hire-me_delete-user-from-db" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    console.log("🔥 deleteUserFromDBHire triggered!", event.id);
    try {
      await connectDB();
      const { id } = event.data;
      await User.deleteOne({ clerkId: id });
      console.log("✅ User deleted from DB:", id);
    } catch (error) {
      console.error("❌ Error deleting user:", error);
      throw error;
    }
  }
);

// // Test Function
// const testFunctionHire = inngest.createFunction(
//   { id: "hire-me_testFunction" },
//   { event: "test/function" },  
//   async ({  }) => {
//     console.log("Just a test function. ");
//     try {
//       console.log("✅ Test function:", id);
//     } catch (error) {
//       console.error("❌ Error running test function:", error);
//       throw error;
//     }
//   }
// );

// Export functions array for registration
export const functions = [syncUserHire, deleteUserFromDBHire];