/**
 * Inline brand glyphs (Simple Icons paths, viewBox 0 0 24 24) and small
 * utility icons. Filled with currentColor so they follow light and dark theme.
 */

const PATHS = {
  github:
    "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  linkedin:
    "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  x: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  whatsapp:
    "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z",
  scholar:
    "M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z",
  rss: "M19.199 24C19.199 13.467 10.533 4.8 0 4.8V0c13.165 0 24 10.835 24 24h-4.801zM3.291 17.415c1.814 0 3.293 1.479 3.293 3.295 0 1.813-1.485 3.29-3.301 3.29C1.47 24 0 22.526 0 20.71s1.475-3.294 3.291-3.295zM15.909 24h-4.665c0-6.169-5.075-11.245-11.244-11.245V8.09c8.727 0 15.909 7.184 15.909 15.91z",
  email:
    "M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z",
  cv: "M6 1h8l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2zm8 1.2V7h4.2L14 2.2zM8.2 10.2h7.6v8.2H8.2V10.2z"
};

const EMAIL_FLAP =
  "M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z";

const CV_ARROW = "M11.15 11.3h1.7v2.9h2.45L12 17.7 8.7 14.2h2.45V11.3z";

export function iconSvg(name) {
  const d = PATHS[name];
  if (!d) return null;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 24 24");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.classList.add("icon");
  appendPath(svg, d, name === "cv" ? "evenodd" : "");
  if (name === "email") appendPath(svg, EMAIL_FLAP);
  if (name === "cv") appendPath(svg, CV_ARROW);
  return svg;
}

function appendPath(svg, d, fillRule) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "currentColor");
  path.setAttribute("d", d);
  if (fillRule) path.setAttribute("fill-rule", fillRule);
  svg.append(path);
}

export function paintIcons(root = document) {
  const scope = root && root.querySelectorAll ? root : document;
  for (const el of scope.querySelectorAll("[data-icon]")) {
    if (el.querySelector(".icon")) continue;
    const svg = iconSvg(el.getAttribute("data-icon"));
    if (!svg) continue;
    const label = el.textContent.replace(/\s+/g, " ").trim();
    el.replaceChildren(svg);
    if (label) {
      const span = document.createElement("span");
      span.textContent = label;
      el.append(span);
    }
  }
}

export function renderFooterSocial(container, profile, options = {}) {
  if (!container || !profile) return;
  const rssHref = options.rssHref || "feed.xml";
  const assetPrefix = options.assetPrefix || "";
  const c = profile.contact || {};
  const handle = visitorLabel(c.xLabel) || "@nzml087";
  const items = [
    { href: c.github, icon: "github", label: "GitHub" },
    { href: c.linkedin, icon: "linkedin", label: "LinkedIn" },
    { href: c.x, icon: "x", label: `X (${handle})` },
    { href: c.whatsapp, icon: "whatsapp", label: "WhatsApp" },
    { href: c.scholar, icon: "scholar", label: "Google Scholar" },
    { href: c.email ? `mailto:${c.email}` : "", icon: "email", label: "Email" },
    { href: c.cv, icon: "cv", label: "Download CV", download: true, asset: true },
    { href: rssHref, icon: "rss", label: "RSS feed" }
  ];
  container.replaceChildren();
  container.classList.add("footer-social");
  if (!container.getAttribute("aria-label")) container.setAttribute("aria-label", "Social profiles");
  for (const item of items) {
    if (isBlank(item.href)) continue;
    let href = String(item.href);
    if (item.asset && assetPrefix && !/^https?:/i.test(href)) {
      href = assetPrefix + href.replace(/^\//, "");
    }
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("aria-label", item.label);
    link.title = item.label;
    if (/^https?:/i.test(href)) {
      link.target = "_blank";
      link.rel = "noopener noreferrer";
    }
    if (item.download && !/^https?:/i.test(href)) link.setAttribute("download", "");
    const svg = iconSvg(item.icon);
    if (svg) link.append(svg);
    container.append(link);
  }
}

function visitorLabel(value) {
  const text = String(value || "").trim();
  if (!text || /\bTODO\b/i.test(text)) return "";
  return text;
}

function isBlank(value) {
  const text = String(value || "").trim();
  return !text || /\bTODO\b/i.test(text);
}
