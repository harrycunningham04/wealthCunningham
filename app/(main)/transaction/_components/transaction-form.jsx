"use client";

import { createTransaction } from "@/actions/transaction";
import { transactionSchema } from "@/app/lib/schema";
import useFetch from "@/hooks/use-fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AddTransactionForm = ({ accounts, categories }) => {
  useForm({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "EXPENSE",
      amount: "",
      description: "",
      accountId: accounts.find((ac) => ac.isDefault)?.id,
      date: new Date(),
      isRecurring: false,
    },
  });

  const {
    loading: transactionLoading,
    fn: transactionFn,
    data: transactionResult,
  } = useFetch(createTransaction);

  return (
    <form>
      {/*AI Recipt Scanner*/}

      <div>
        <label>Type:</label>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </form>
  );
};

export default AddTransactionForm;
