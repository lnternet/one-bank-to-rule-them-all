const points = "0,92 42,72 84,80 126,44 168,56 210,24 252,36 294,18";

export default function InvestmentGraph() {
  return (
    <section
      className="widget investment-widget"
      id="investments"
      aria-labelledby="investments-title"
    >
      <div className="widget-header">
        <div>
          <p className="section-label">Investments</p>
          <h2 id="investments-title">Growth trend</h2>
        </div>
        <div className="summary-pill light">
          <span>YTD</span>
          <strong>+8.4%</strong>
        </div>
      </div>

      <div className="chart-frame" aria-label="Investment value trend">
        <svg viewBox="0 0 294 112" role="img" aria-labelledby="chart-title">
          <title id="chart-title">Investment growth trend</title>
          <defs>
            <linearGradient id="investment-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#0b3d91" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#0b3d91" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polyline className="chart-grid" points="0,92 294,92" />
          <polyline className="chart-grid" points="0,56 294,56" />
          <polygon className="chart-area" points={`0,112 ${points} 294,112`} />
          <polyline className="chart-line" points={points} />
        </svg>
      </div>

      <div className="investment-summary">
        <span>Total value</span>
        <strong>$42,910.25</strong>
      </div>
    </section>
  );
}
