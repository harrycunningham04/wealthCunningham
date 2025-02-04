"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";

const serialiseTransaction = (object) => {
  const serialised = { ...object };

  if (object.balance) {
    serialised.balance = object.balance.toNumber();
  }

  if (object.amount) {
    serialised.amount = object.amount.toNumber();
  }

  return serialised;
};

export async function updateDefaultAccount(accountId) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Not Authenticated");
    }

    const user = await db.user.findUnique({
      where: {
        clerkUserId: userId,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await db.account.updateMany({
      where: {
        userId: user.id,
        isDefault: true,
      },
      data: {
        isDefault: false,
      },
    });

    const account = await db.account.update({
      where: {
        id: accountId,
        userId: user.id,
      },
      data: {
        isDefault: true,
      },
    });

    revalidatePath("/dashboard");
    return { success: true, account: serialiseTransaction(account) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
