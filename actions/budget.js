"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/prisma";

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

    const currentDate = new Date();
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const expenses = await db.transaction.aggregate({
      where: {
        userId: user.id,
        type: "EXPENSE",
        date: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
        accountId,
      },
      _sum: {
        amount: true,
      },
    });

    return {
      budget: budget ? { ...budget, amount: budget.amount.toNumber() } : null,
      currentExpenses: expenses._sum.amount?.toNumber() || 0,
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateBudget(amount) {
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

    const existingBudget = await db.budget.findFirst({
      where: {
        userId: user.id,
      },
    });

    const budget = await db.budget.upsert({
      where: {
        id: existingBudget ? existingBudget.id : "", // Use the existing budget ID if found
      },
      update: {
        amount,
      },
      create: {
        userId: user.id,
        amount,
      },
    });

    revalidatePath("/dashboard");
    return {
      success: true,
      data: { ...budget, amount: budget.amount.toNumber() },
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: error.message,
    };
  }
}
