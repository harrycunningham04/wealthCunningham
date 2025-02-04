"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/dist/types/server";
import { revalidatePath } from "next/cache";

const serialiseTransaction = (object) => {
  const serialised = { ...object };

  if (object.balance) {
    serialised.balance = object.balance.toNumber();
  }
};

export async function createAccount(data) {
  try {
    const userId = await auth();

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

    //convert balance to float
    const balanceFloat = parseFloat(data.balance);
    if (isNaN(balanceFloat)) {
      throw new Error("Invalid balance");
    }

    //check if users first account
    const existingAccounts = await db.account.findMany({
      where: {
        userId: user.id,
      },
    });

    const shouldBeDefault =
      existingAccounts.length === 0 ? true : data.isDefault;

    //if account should be default, update all other accounts to not be default
    if (shouldBeDefault) {
      await db.account.updateMany({
        where: {
          userId: user.id,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });
    }

    const account = await db.account.create({
      data: {
        ...data,
        balance: balanceFloat,
        userId: user.id,
        isDefault: shouldBeDefault,
      },
    });

    const serialisedAccount = serialiseTransaction(account);

    revalidatePath("/dashboard");
    return {success: true, account: serialisedAccount};

  } catch (error) {}
}
