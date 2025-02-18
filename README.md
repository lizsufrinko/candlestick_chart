# 🕯️ Power BI Custom Candlestick Chart

This is my own **candlestick chart** built for **Power BI**. It displays **candlesticks with wicks** along with **volume bars** to visualize price movements effectively.

## 📌 About

This visual is built using **Power BI’s pbiviz framework** and **D3.js**, allowing seamless integration with Power BI reports. The `pbiviz` framework is essential for developing and testing Power BI visuals, while **D3.js** is used to render the candlestick chart.

## 🚀 Development

To work with this visual, you need to have `pbiviz` installed. Clone the repository and run:

```sh
pbiviz start
```

⚠️ Note: `pbiviz start` only works if developer mode is enabled in Power BI Service. If running locally, you need to package the visual first:

```sh
pbiviz package
```

Then, import the `.pbiviz` file into Power BI manually.

## 🛠️ Built With
- **D3.js** - For rendering the SVG as candlestick chart.
- **TypeScript** - For Power BI visual framework.
- **pbiviz** - For building and packaging the visual. (https://github.com/microsoft/powerbi-visuals-tools)
- **Node.js** - For managing dependencies and build processes.

## 🚨 Common Issues and Fixes
### 🔹 `pbiviz start` Not Working?
Make sure you enabled Developer Mode in Power BI Service:

1. Open Power BI Service in your browser.
2. Enable **Developer Mode**.
3. Restart Power BI and try again.

Follow the official guide from Microsoft https://learn.microsoft.com/en-us/power-bi/developer/visuals/environment-setup?tabs=desktop.

### 🔹 Visual Not Loading?
- Check if **D3.js** is properly imported.
- Ensure the dataset contains **Open, High, Low, Close, and Volume**.
- Inspect errors using **Power BI Developer Tools**.

## 📜 License

This project is licensed under the **MIT License**.
