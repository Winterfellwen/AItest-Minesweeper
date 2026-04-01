export const DIFFICULTY_PRESETS = {
  easy: { rows: 9, cols: 9, mines: 10, label: "初级 9×9" },
  medium: { rows: 16, cols: 16, mines: 40, label: "中级 16×16" },
  hard: { rows: 16, cols: 30, mines: 99, label: "高级 16×30" },
};

export const NUMBER_COLORS = [
  "",
  "#1976D2",
  "#388E3C",
  "#D32F2F",
  "#7B1FA2",
  "#FF8F00",
  "#00ACC1",
  "#212121",
  "#9E9E9E",
];

export const COLORS = {
  covered: "#B0BEC5",
  coveredHover: "#90A4AE",
  revealed: "#ECEFF1",
  flag: "#FF9800",
  mine: "#F44336",
  gridLine: "#CFD8DC",
  background: "#F5F5F5",
  primary: "#1976D2",
  primaryText: "#FFFFFF",
  text: "#37474F",
  textLight: "#78909C",
  white: "#FFFFFF",
  red: "#F44336",
  orange: "#FF9800",
};

export const API_BASE = "https://your-cloud-hosting-url";
