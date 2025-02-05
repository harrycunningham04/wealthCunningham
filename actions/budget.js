import { auth } from "@clerk/nextjs/server";

export async function getCurrentBudget(accountId) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Not Authenticated");
    }

    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const budget = await db.budget.findFirst({
      where: {
        userId: user.id,
      },
    });

    


  } catch (error) {}
}
