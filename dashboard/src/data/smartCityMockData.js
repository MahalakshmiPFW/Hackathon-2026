// Mock data for the dashboard demo.
// Kept in a dedicated file so UI components remain focused/presentational.
export const DATA = {
  Morning: {
    traffic: 24,
    pollution: "Medium",
    energy: "Low",
    trend: "+12%",
    chart: [
      { t: "6am", v: 45 },
      { t: "7am", v: 30 },
      { t: "8am", v: 15 },
      { t: "9am", v: 22 },
      { t: "10am", v: 38 },
    ],
    insights: ["School zone congestion high", "Morning smog alert: Zone 4", "Energy surplus: 12%"],
  },
  Afternoon: {
    traffic: 42,
    pollution: "Low",
    energy: "High",
    trend: "-5%",
    chart: [
      { t: "12pm", v: 40 },
      { t: "1pm", v: 45 },
      { t: "2pm", v: 38 },
      { t: "3pm", v: 35 },
      { t: "4pm", v: 30 },
    ],
    insights: ["Solar grid at peak output", "Delivery drone traffic +20%", "Optimal air quality"],
  },
  Evening: {
    traffic: 18,
    pollution: "High",
    energy: "Medium",
    trend: "+18%",
    chart: [
      { t: "6pm", v: 12 },
      { t: "7pm", v: 25 },
      { t: "8pm", v: 45 },
      { t: "9pm", v: 55 },
      { t: "10pm", v: 60 },
    ],
    insights: ["Commuter surge: Downtown", "Street lighting active", "Heavy air particulate detected"],
  },
};

