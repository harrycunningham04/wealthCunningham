"use server";

import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/prisma";
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

export async function getAccountWithTransactions(accountId) {
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

  const account = await db.account.findUnique({
    where: {
      id: accountId,
      userId: user.id,
    },
    include: {
      transactions: {
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          transactions: true,
        },
      },
    },
  });

  if (!account) {
    return null;
  }

  return {
    ...serialiseTransaction(account),
    transactions: account.transactions.map(serialiseTransaction),
  };
}

export async function bulkDeleteTransactions(transactionIds) {
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

    const transactions = await db.transaction.findMany({
      where: {
        id: { in: transactionIds },
        userId: userId,
      },
    });

    // Calculate balance changes for affected accounts
    const accountBalanceChanges = transactions.reduce((acc, transaction) => {
      if (!transaction.accountId) return acc;

      const change =
        transaction.type === "EXPENSE"
          ? -transaction.amount // Increase balance when an expense is removed
          : transaction.amount; // Decrease balance when an income is removed

      acc[transaction.accountId] = (acc[transaction.accountId] || 0) + change;
      return acc;
    }, {});

    await db.$transaction(async (tx) => {
      // Delete transactions
      await tx.transaction.deleteMany({
        where: { id: { in: transactionIds }, userId: user.id },
      });

      // Update affected account balances in parallel
      await Promise.all(
        Object.entries(accountBalanceChanges).map(
          ([accountId, balanceChange]) =>
            tx.account.update({
              where: { id: accountId },
              data: { balance: { increment: balanceChange } },
            })
        )
      );
    });

    revalidatePath("/account/[id]");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error deleting transactions:", error);
    return { success: false, error: error.message };
  }
}
