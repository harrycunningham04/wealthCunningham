import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
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
              <div style={styles.stat}>
                <Text style={styles.text}>Total Income</Text>
                <Text style={styles.heading}>
                  £{data?.stats.totalIncome.toFixed(2)}
                </Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Total Expenses</Text>
                <Text style={styles.heading}>
                  £{data?.stats.totalExpenses.toFixed(2)}
                </Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Net</Text>
                <Text style={styles.heading}>
                  £
                  {data?.stats.totalIncome.toFixed(2) -
                    data?.stats.totalExpenses.toFixed(2)}
                </Text>
              </div>
            </Section>

            {/* Category Breakdown */}
            {data?.stats?.byCategory && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>Expenses by Category</Heading>
                {Object.entries(data?.stats.byCategory).map(
                  ([category, amount]) => (
                    <div key={category} style={styles.row}>
                      <Text style={styles.text}>{category} - </Text>
                      <Text style={styles.text}>£{amount.toFixed(2)}</Text>
                    </div>
                  )
                )}
              </Section>
            )}

            {/* AI Insights */}
            {data?.insights && (
              <Section style={styles.section}>
                <Heading style={styles.heading}>WealthCunningham Insights</Heading>
                {(() => {
                  try {
                    // Parse the insights if it's a string representation of a JSON array
                    const insightsArray =
                      typeof data.insights === "string"
                        ? JSON.parse(data.insights)
                        : data.insights;

                    // Ensure insightsArray is an array before mapping
                    if (Array.isArray(insightsArray)) {
                      return insightsArray.map((insight, index) => (
                        <Text key={index} style={styles.text}>
                          • {insight}
                        </Text>
                      ));
                    } else {
                      return (
                        <Text style={styles.text}>No insights available.</Text>
                      );
                    }
                  } catch (error) {
                    console.error("Error parsing insights:", error);
                    return (
                      <Text style={styles.text}>Error loading insights.</Text>
                    );
                  }
                })()}
              </Section>
            )}

            <Text style={styles.footer}>
              Thank you for using WelthCunningham. Keep tracking your finances
              for better financial stability!
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
              You&rsquo;ve used {data?.percentageUsed.toFixed(1)}% of your
              monthly budget.
            </Text>
            <Section style={styles.statsContainer}>
              <div style={styles.stat}>
                <Text style={styles.text}>Budget Amount</Text>
                <Text style={styles.heading}>£{data?.budgetAmount}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Spent So Far</Text>
                <Text style={styles.heading}>£{data?.totalExpenses}</Text>
              </div>
              <div style={styles.stat}>
                <Text style={styles.text}>Remaining</Text>
                <Text style={styles.heading}>
                  £{data?.budgetAmount - data?.totalExpenses}
                </Text>
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
    backgroundColor: "#f4f7fc",
    fontFamily: "Arial, sans-serif",
    color: "#333",
    padding: "20px",
  },
  container: {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "24px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    maxWidth: "600px",
  },
  title: {
    color: "#2c3e50",
    fontSize: "28px",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: "20px",
  },
  subheading: {
    color: "#34495e",
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "12px",
  },
  text: {
    color: "#4a4a4a",
    fontSize: "16px",
    lineHeight: "1.5",
    marginBottom: "12px",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    gap: "12px",
    padding: "20px",
    backgroundColor: "#ecf0f1",
    borderRadius: "8px",
    textAlign: "center",
  },
  statBlock: {
    padding: "12px",
    backgroundColor: "#ffffff",
    borderRadius: "6px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  statLabel: {
    fontSize: "14px",
    color: "#7f8c8d",
    marginBottom: "4px",
  },
  statValue: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  section: {
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    marginTop: "20px",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #ddd",
  },
  listItem: {
    fontSize: "16px",
    color: "#4a4a4a",
    marginBottom: "8px",
  },
  footer: {
    color: "#7f8c8d",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "1px solid #ddd",
  },
};
