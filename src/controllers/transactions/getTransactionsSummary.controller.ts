import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetTransactionsSummaryQuery } from "../../schemas/transaction.schema";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import prisma from "../../config/prisma";
import { CategorySummary } from "../../types/category.types";
import { TransactionType } from "../../generated/prisma/enums";
import { TransactionSummary } from "../../types/transaction.types";

dayjs.extend(utc);

export const getTransactionsSummary = async (
  request: FastifyRequest<{ Querystring: GetTransactionsSummaryQuery }>,
  reply: FastifyReply,
): Promise<void> => {
  const userId = request.userId; 

  if (!userId) {
    reply.status(401).send({ message: "Unauthorized" });
    return;
  }

  const { month, year } = request.query;

  if (!month || !year) {
    reply.status(400).send({ message: "Month and year are required" });
    return;
  }

  const startDate = dayjs
    .utc(`${year}-${month}-01`)
    .startOf("month")
    .toDate();
  const endDate = dayjs.utc(startDate).endOf("month").toDate();

  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      include: {
        category: true,
      },
    });

    const previousTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          lt: startDate,
        },
      },
    });

    let totalExpenses = 0;
    let totalIncomes = 0;
    const groupedExpenses = new Map<string, CategorySummary>();

    for (const transaction of transactions) {
      if (transaction.type === TransactionType.expense) {
        const existing =
          groupedExpenses.get(transaction.categoryId) ?? {
            categoryId: transaction.categoryId,
            categoryName: transaction.category.name,
            categoryColor: transaction.category.color,
            amount: 0,
            percentage: 0,
          };

        existing.amount += transaction.amount;
        groupedExpenses.set(transaction.categoryId, existing);

        totalExpenses += transaction.amount;
      } else {
        totalIncomes += transaction.amount;
      }
    }

    let previousBalance = 0;
    for (const transaction of previousTransactions) {
      if (transaction.type === TransactionType.expense) {
        previousBalance -= transaction.amount;
      } else {
        previousBalance += transaction.amount;
      }
    }

    
    const monthResult = Number((totalIncomes - totalExpenses).toFixed(2));
    const balance = Number((previousBalance + monthResult).toFixed(2));

    const expensesByCategory = Array.from(groupedExpenses.values())
      .map((entry) => ({
        ...entry,
        percentage: totalExpenses
          ? Number(((entry.amount / totalExpenses) * 100).toFixed(2))
          : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const summary: TransactionSummary = {
      totalExpenses,
      totalIncomes,
      balance,          
      previousBalance,  
      monthResult,     
      expensesByCategory,
    };

    reply.send(summary);
  } catch (err) {
  request.log.error({ err }, "Error fetching transactions summary");
  reply.status(500).send({ error: "Internal Server Error" });
}
};
