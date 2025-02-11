"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

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

export async function createAccount(data) {
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

    console.log("Creating account with data:", {
      ...data,
      balance: balanceFloat,
      userId: user.id,
      isDefault: shouldBeDefault,
    });

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
    return { success: true, account: serialisedAccount };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getUserAccounts() {
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

  const accounts = await db.account.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });

  const serialisedAccount = accounts.map(serialiseTransaction);

  return serialisedAccount;
}

export async function getDashboardData() {
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

  //get all transactions
  const transactions = await db.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  return transactions.map(serialiseTransaction);
}
