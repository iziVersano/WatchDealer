import { storage } from "../server/storage";
import { hash } from "bcrypt";

async function createAdminUser() {
  try {
    // Check if admin user already exists
    const existingAdmin = await storage.getUserByEmail("admin@watchdealer.com");
    
    if (existingAdmin) {
      console.log("Admin user already exists!");
      return;
    }
    
    // Create admin user
    const hashedPassword = await hash("password", 10);
    
    const adminUser = await storage.createUser({
      username: "admin",
      email: "admin@watchdealer.com",
      password: hashedPassword,
      role: "admin",
      googleId: null
    });
    
    console.log("Admin user created successfully:", adminUser);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

createAdminUser()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });