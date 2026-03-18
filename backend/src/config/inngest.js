import {Inngest} from "inngest"
import {connectDB} from "./db.js"
import {User} from "../models/user.model.js"

export const inngest = new Inngest({id:"hire-me"})

const syncUser = inngest.createFunction(
  {id:"hireme_sync-user"},
  {event:"clerk/user.created"},
  async({event})=>{
    try{
      await connectDB()
      const {id,email_addresses, first_name, last_name, image_url} = event.data
      if (!id) throw new Error("Clerk user ID missing");
      //Clerk Sends these fields via webhooks
      const newUser = {
        clerkId:id,
        email: email_addresses?.[0]?.email_address || "",
        name:`${first_name || ""} ${last_name||""}` ||"User",
        imageUrl: image_url || "",
        addresses: [],
        wishlist: []
      }
      await User.create(newUser)
    } catch(error){
      console.log("Error syncing user to the database.")
      throw error
    }
  }
)

const deleteUserFromDB = inngest.createFunction(
  {id:"hireme_delete-user-from-db"},
  {event:"clerk/user.deleted"},
  //Delete user using webhooks
  async({event})=>{
  try {
    await connectDB()
    
    const {id} = event.data
    await User.deleteOne({clerkId: id})
  }catch (error) {
     console.log("Error deleting user from the database.")
     throw error
  }
}
)

export const functions = [syncUser, deleteUserFromDB]