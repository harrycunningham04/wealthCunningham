import {
  Html,
  Preview,
  Head,
  Body,
  Container,
  Heading,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

export default function EmailTemplate({
  userName = "Harry",
  type = "budget-alert",
  data = {},
}) {
  if (type === "monthly-report") {
    // Future implementation
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
  text: {
    color: "#4b5563",
    fontSize: "16px",
    marginBottom: "16px",
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
};
