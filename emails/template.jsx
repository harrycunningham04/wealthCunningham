import React from "react";
import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Section,
} from "@react-email/components";

export default function EmailTemplate({
  userName = "",
  type = "monthly-report",
  data = {},
}) {
  if (type === "monthly-report") {
    return (
      <Html>
        <Head />
        <Preview>Your Monthly Financial Report</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Monthly Financial Report</Heading>

            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              Here&rsquo;s your financial summary for {data?.month}:
            </Text>

            {/* Main Stats */}
            <Section style={styles.statsContainer}>
              <div style={styles.statRow}>
                <div style={styles.statBox}>
                  <Text style={styles.statLabel}>Total Income</Text>
                  <Text style={styles.statValue}>
                    ${data?.stats.totalIncome}
                  </Text>
                </div>
                <div style={styles.statBox}>
                  <Text style={styles.statLabel}>Total Expenses</Text>
                  <Text style={styles.statValue}>
                    ${data?.stats.totalExpenses}
                  </Text>
                </div>
                <div style={styles.statBox}>
                  <Text style={styles.statLabel}>Net</Text>
                  <Text style={styles.statValue}>
                    ${data?.stats.totalIncome - data?.stats.totalExpenses}
                  </Text>
                </div>
              </div>
            </Section>

            {/* Category Breakdown */}
            {data?.stats?.byCategory && (
              <Section style={styles.section}>
                <Heading style={styles.subheading}>
                  Expenses by Category
                </Heading>
                {Object.entries(data?.stats.byCategory).map(
                  ([category, amount]) => (
                    <div key={category} style={styles.row}>
                      <Text style={styles.text}>{category}</Text>
                      <Text style={styles.text}>${amount}</Text>
                    </div>
                  )
                )}
              </Section>
            )}

            {/* AI Insights */}
            {data?.insights && (
              <Section style={styles.section}>
                <Heading style={styles.subheading}>Welth Insights</Heading>
                {data.insights.map((insight, index) => (
                  <Text key={index} style={styles.text}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            )}

            <Text style={styles.footer}>
              Thank you for using WelthCunningham. Keep tracking your finances for better
              financial information!
            </Text>
          </Container>
        </Body>
      </Html>
    );
  }

  if (type === "budget-alert") {
    return (
      <Html>
        <Head />
        <Preview>Budget Alert</Preview>
        <Body style={styles.body}>
          <Container style={styles.container}>
            <Heading style={styles.title}>Budget Alert</Heading>
            <Text style={styles.text}>Hello {userName},</Text>
            <Text style={styles.text}>
              You have used {data?.percentageUsed.toFixed(1)}% of your monthly
              budget.
            </Text>
            <Section style={styles.statsContainer}>
              <div style={styles.statRow}>
                <div style={styles.statBox}>
                  <Text style={styles.statLabel}>Budget Amount</Text>
                  <Text style={styles.statValue}>£{data?.budgetAmount}</Text>
                </div>
                <div style={styles.statBox}>
                  <Text style={styles.statLabel}>Spent so far</Text>
                  <Text style={styles.statValue}>£{data?.totalExpenses}</Text>
                </div>
                <div style={styles.statBox}>
                  <Text style={styles.statLabel}>Remaining</Text>
                  <Text style={styles.statValue}>
                    £{data?.budgetAmount - data?.totalExpenses}
                  </Text>
                </div>
              </div>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }
}

const styles = {
  body: {
    backgroundColor: "#f6f9fc",
    fontFamily: "-apple-system, sans-serif",
    padding: "20px",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "500px",
    textAlign: "center",
  },
  title: {
    color: "#1f2937",
    fontSize: "28px",
    fontWeight: "bold",
    marginBottom: "16px",
  },
  subheading: {
    color: "#1f2937",
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "12px",
  },
  text: {
    color: "#4b5563",
    fontSize: "16px",
    marginBottom: "12px",
  },
  statsContainer: {
    margin: "24px 0",
    padding: "20px",
    backgroundColor: "#f9fafb",
    borderRadius: "6px",
  },
  statRow: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  statBox: {
    backgroundColor: "#fff",
    padding: "14px",
    borderRadius: "6px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
    width: "80%",
  },
  statLabel: {
    color: "#6b7280",
    fontSize: "14px",
  },
  statValue: {
    color: "#1f2937",
    fontSize: "18px",
    fontWeight: "600",
  },
  footer: {
    color: "#6b7280",
    fontSize: "14px",
    marginTop: "20px",
  },
};
