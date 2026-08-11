const appVersion = typeof __APP_VERSION__ === "string" ? __APP_VERSION__ : "";
const buildTag = typeof __BUILD_TAG__ === "string" ? __BUILD_TAG__ : "";

export default function Footer() {
  return (
    <footer className="site-footer">
      <span>One Bank to Rule Them All</span>
      <span>Secure account insight for everyday decisions.</span>
      <span className="build-meta">
        v{appVersion}
        {buildTag ? ` · ${buildTag}` : ""}
      </span>
    </footer>
  );
}
