import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null; // Return null if no user is found
  }

  try {
    // Check if the user already exists in the database
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
    });

    if (loggedInUser) {
      return loggedInUser; // Return the existing user
    }

    // Create a new user if not found
    const name = `${user.firstName} ${user.lastName}`;
    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0]?.emailAddress, // Use optional chaining to avoid errors
      },
    });

    return newUser; // Return the newly created user
  } catch (error) {
    console.error("Error checking or creating user:", error); // Improved error logging
    return null; // Return null in case of an error
  }
};
