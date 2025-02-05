"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Pencil, X } from "lucide-react";
import useFetch from "@/hooks/use-fetch";
import { updateBudget } from "@/actions/budget";
import { toast } from "sonner";

const BudgetProgress = ({ intialBudget, currentExpenses }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newBudget, setNewBudget] = useState(
    intialBudget?.amount?.toString() || ""
  );

  const percentUsed = intialBudget ? (currentExpenses / intialBudget) * 100 : 0;

  const {
    loading: isLoading,
    fn: updateBudgetFn,
    data: updatedBudget,
    error,
  } = useFetch(updateBudget);

  const handleUpdateBudget = async () => {
    const amount = parseFloat(newBudget);

    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount.");
      return;
    }

    return await updateBudgetFn(amount);
  };

  useEffect(() => {
    if (updatedBudget?.success) {
      setIsEditing(false);
      toast.success("Budget updated successfully");
    }
  }, [updatedBudget]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update budget");
    }
  }, [error]);

  const handleCancel = () => {
    setNewBudget(intialBudget?.amount?.toString() || "");
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex-1">
          <CardTitle>Monthly Budget (Default Account)</CardTitle>
          <div className="flex items-center gap-2 mt-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-32"
                  placeholder="Enter amount"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleUpdateBudget}
                >
                  <Check className="size-4 text-green-500" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCancel}>
                  <X className="size-4 txt-red-500" />
                </Button>
              </div>
            ) : (
              <>
                <CardDescription>
                  {intialBudget
                    ? `£${currentExpenses.toFixed(
                        2
                      )} of £${intialBudget.amount.toFixed(2)} spant`
                    : "No Budget Set"}
                </CardDescription>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-6"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="size-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
    </Card>
  );
};

export default BudgetProgress;
