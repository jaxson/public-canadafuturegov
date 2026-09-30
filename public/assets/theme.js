// Runs before first paint so a saved dark preference does not flash light.
// Light is the default; dark applies only when the visitor chose it.
(function () {
  var theme = "light";
  try { if (window.localStorage.getItem("cfg-theme") === "dark") theme = "dark"; } catch (e) { /* storage unavailable */ }
  document.documentElement.setAttribute("data-theme", theme);
})();
