import { initChat } from "./chat.js";

const THEME_KEY = "nazmul-theme";

initThemeToggle();
initNav();

const status = document.querySelector("[data-status]");

loadProfile()
  .then((profile) => {
    renderProfile(profile);
    initChat(profile);
    if (status) status.hidden = true;
  })
  .catch(() => {
    if (status) {
      status.hidden = false;
      status.textContent = "This page could not load data/profile.json. From the site folder, run a local server such as: python3 -m http.server";
    }
  });

async function loadProfile() {
  const response = await fetch("data/profile.json", { cache: "no-cache" });
  if (!response.ok) throw new Error("profile");
  return response.json();
}

function renderProfile(profile) {
  const person = profile.person;
  document.title = `${person.name} · Portfolio`;

  setText("[data-name]", person.name);
  setText("[data-given]", person.givenName);
  setText("[data-title]", person.title);
  setText("[data-field]", person.field);
  setText("[data-affiliation]", person.affiliation);
  setText("[data-location]", person.location);
  setText("[data-bio]", person.bio);
  setText("[data-value]", person.valueStatement || "");
  setText("[data-year]", String(new Date().getFullYear()));
  renderKeywords(person.keywords || []);
  renderPrevious(profile.experience || []);

  const emailLink = document.querySelector("[data-email-link]");
  if (emailLink && !isPlaceholder(profile.contact.email)) emailLink.href = `mailto:${profile.contact.email}`;
  const githubLink = document.querySelector("[data-github-link]");
  if (githubLink && !isPlaceholder(profile.contact.github)) githubLink.href = profile.contact.github;
  const linkedinLink = document.querySelector("[data-linkedin-link]");
  if (linkedinLink && !isPlaceholder(profile.contact.linkedin)) linkedinLink.href = profile.contact.linkedin;
  const scholarLink = document.querySelector("[data-scholar-link]");
  if (scholarLink) {
    if (isPlaceholder(profile.contact.scholar)) scholarLink.hidden = true;
    else scholarLink.href = profile.contact.scholar;
  }
  wireCvLink(profile.contact.cv);

  const portrait = document.querySelector("[data-portrait]");
  if (portrait) {
    portrait.src = person.portrait;
    portrait.alt = person.portraitAlt || person.name;
  }
  const about = document.querySelector("[data-about]");
  if (about) {
    about.replaceChildren();
    for (const paragraph of profile.about.paragraphs) {
      const p = document.createElement("p");
      p.textContent = paragraph;
      about.append(p);
    }
  }

  renderSkills(profile.skills);
  renderResearch(profile.research);
  renderPublications(profile);
  renderExperience(profile.experience);
  renderProjects(profile.projects);
  renderBeyond(profile.beyond);
  renderContact(profile);
  renderStructuredData(profile);
  initReveal();
}

function renderSkills(groups) {
  const root = document.querySelector("[data-skills]");
  if (!root) return;
  root.replaceChildren();
  for (const group of groups) {
    const item = document.createElement("li");
    const name = document.createElement("span");
    name.className = "skill-label";
    name.textContent = group.group;
    const values = document.createElement("span");
    values.textContent = group.items.join(" · ");
    item.append(name, values);
    root.append(item);
  }
}

function renderResearch(items) {
  const root = document.querySelector("[data-research]");
  if (!root) return;
  root.replaceChildren();
  items.forEach((item, index) => {
    const card = document.createElement("article");
    card.className = "info-card";
    const kicker = document.createElement("p");
    kicker.className = "kicker";
    kicker.textContent = String(index + 1).padStart(2, "0");
    const title = document.createElement("h3");
    title.textContent = item.title;
    const summary = document.createElement("p");
    summary.textContent = item.summary;
    card.append(kicker, title, summary);
    root.append(card);
  });
}

function renderKeywords(keywords) {
  const root = document.querySelector("[data-keywords]");
  if (!root) return;
  root.replaceChildren();
  for (const word of keywords.filter((item) => !isPlaceholder(item))) {
    const li = document.createElement("li");
    li.textContent = word;
    root.append(li);
  }
  root.hidden = root.childElementCount === 0;
}

function renderPrevious(jobs) {
  const node = document.querySelector("[data-previous]");
  if (!node) return;
  const names = jobs.filter((job) => !job.current && !isPlaceholder(job.org)).map((job) => job.org);
  node.textContent = names.length ? `Previously ${joinNames(names)}` : "";
  node.hidden = !node.textContent;
}

function joinNames(names) {
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

function renderPublications(profile) {
  const section = document.querySelector("[data-publications-section]");
  const papers = (profile.publications || []).filter((item) => !isPlaceholder(item.title));
  const talks = (profile.talks || []).filter((item) => !isPlaceholder(item.title));
  const paperList = document.querySelector("[data-publications]");
  const talkList = document.querySelector("[data-talks]");
  const talkBlock = document.querySelector("[data-talks-block]");
  const paperBlock = document.querySelector("[data-papers-block]");
  const nav = document.querySelector("[data-nav-publications]");
  if (paperList) {
    paperList.replaceChildren();
    const groups = [
      ["Journal", papers.filter((paper) => paper.type === "journal")],
      ["Conference", papers.filter((paper) => paper.type === "conference")],
      ["Other", papers.filter((paper) => paper.type !== "journal" && paper.type !== "conference")]
    ].filter(([, items]) => items.length);
    const named = profile.person && profile.person.name;
    for (const [label, items] of groups) {
      const block = document.createElement("div");
      block.className = "paper-group";
      if (groups.length > 1) {
        const heading = document.createElement("h3");
        heading.className = "subhead";
        heading.textContent = label;
        block.append(heading);
      }
      const list = document.createElement("ol");
      list.className = "papers";
      for (const paper of items) list.append(entryItem(paper, named));
      block.append(list);
      paperList.append(block);
    }
  }
  if (talkList) {
    talkList.replaceChildren();
    for (const talk of talks) talkList.append(entryItem(talk, profile.person && profile.person.name));
  }
  if (paperBlock) paperBlock.hidden = papers.length === 0;
  if (talkBlock) talkBlock.hidden = talks.length === 0;
  const title = document.querySelector("[data-publications-title]");
  const kicker = document.querySelector("[data-publications-kicker]");
  if (papers.length && talks.length) {
    if (kicker) kicker.textContent = "Publications and talks";
    if (title) title.textContent = "Papers and talks from his public profile.";
  } else if (talks.length) {
    if (kicker) kicker.textContent = "Talks";
    if (title) title.textContent = "Talks from his public profile.";
  }
  const visible = papers.length + talks.length > 0;
  if (section) section.hidden = !visible;
  if (nav) nav.hidden = !visible;
}

function entryItem(entry, selfName) {
  const item = document.createElement("li");
  const label = entry.title;
  if (!isPlaceholder(entry.url)) {
    const title = document.createElement("a");
    title.href = entry.url;
    title.target = "_blank";
    title.rel = "noopener noreferrer";
    title.textContent = label;
    item.append(title);
  } else {
    const title = document.createElement("span");
    title.textContent = label;
    item.append(title);
  }
  const authors = (entry.authors || []).filter((name) => !isPlaceholder(name));
  if (authors.length) item.append(authorLine(authors, selfName));
  const meta = [entry.venue, entry.event, entry.date || entry.year].filter((part) => !isPlaceholder(part)).join(" · ");
  if (meta) {
    const venue = document.createElement("span");
    venue.className = "venue";
    venue.textContent = meta;
    item.append(venue);
  }
  return item;
}

function authorLine(authors, selfName) {
  const line = document.createElement("p");
  line.className = "authors";
  authors.forEach((name, index) => {
    if (index) line.append(document.createTextNode(", "));
    if (selfName && name.trim() === selfName.trim()) {
      const mark = document.createElement("strong");
      mark.className = "self";
      mark.textContent = name;
      line.append(mark);
    } else {
      line.append(document.createTextNode(name));
    }
  });
  return line;
}

function renderExperience(jobs) {
  const root = document.querySelector("[data-experience]");
  if (!root) return;
  root.replaceChildren();
  for (const job of jobs) {
    const item = document.createElement("article");
    item.className = "job";
    const mark = document.createElement("div");
    mark.className = "job-mark";
    mark.textContent = job.mark || initials(job.org);
    mark.setAttribute("aria-hidden", "true");
    const body = document.createElement("div");
    const head = document.createElement("div");
    head.className = "job-head";
    const org = document.createElement("h3");
    org.textContent = job.org;
    head.append(org);
    if (!isPlaceholder(job.dates)) {
      const dates = document.createElement("p");
      dates.className = "dates";
      dates.textContent = job.dates;
      head.append(dates);
    }
    const role = document.createElement("p");
    role.className = "job-role";
    role.textContent = job.role;
    const focus = document.createElement("p");
    focus.className = "job-focus";
    focus.textContent = [job.focus, job.location].filter((part) => !isPlaceholder(part)).join(" · ");
    const line = document.createElement("p");
    line.textContent = !isPlaceholder(job.achievement) ? job.achievement : job.summary;
    body.append(head, role);
    if (focus.textContent) body.append(focus);
    body.append(line);
    item.append(mark, body);
    root.append(item);
  }
}

function renderProjects(projects) {
  const grid = document.querySelector("[data-projects]");
  if (!grid) return;
  grid.replaceChildren();
  for (const project of projects.filter((item) => item.available && !isPlaceholder(item.summary))) {
    grid.append(projectCard(project));
  }
}

function projectCard(project) {
  const card = document.createElement("article");
  card.className = "project-card";
  if (!isPlaceholder(project.image)) {
    const media = document.createElement("div");
    media.className = "project-media";
    const img = document.createElement("img");
    img.src = project.image;
    img.alt = project.imageAlt || project.name;
    img.width = 1200;
    img.height = 750;
    img.loading = "lazy";
    img.decoding = "async";
    media.append(img);
    card.append(media);
  }
  const body = document.createElement("div");
  body.className = "project-body";
  const top = document.createElement("div");
  top.className = "project-top";
  if (!isPlaceholder(project.language)) {
    const lang = document.createElement("span");
    lang.className = "pill";
    lang.textContent = project.language;
    top.append(lang);
  }
  const title = document.createElement("h3");
  title.textContent = project.name;
  const summary = document.createElement("p");
  summary.textContent = project.summary;
  const links = document.createElement("div");
  links.className = "project-links";
  if (!isPlaceholder(project.demo)) links.append(textLink(project.demo, "Live demo", "button button-primary"));
  if (!isPlaceholder(project.url)) links.append(textLink(project.url, "Code", "button button-ghost"));
  body.append(top, title, summary, links);
  card.append(body);
  return card;
}

function renderBeyond(beyond) {
  const section = document.querySelector("[data-beyond-section]");
  const nav = document.querySelector("[data-nav-beyond]");
  const data = beyond || {};
  const intro = String(data.intro || "").trim();
  const hometown = String(data.hometown || "").trim();
  const hobbies = (data.hobbies || []).filter((item) => !isPlaceholder(item));
  const gallery = (data.gallery || []).filter((item) => item && !isPlaceholder(item.src));
  const visible = Boolean(intro || hometown || hobbies.length || gallery.length);
  if (section) section.hidden = !visible;
  if (nav) nav.hidden = !visible;
  if (!visible) return;
  const copy = document.querySelector("[data-beyond-copy]");
  if (copy) {
    copy.replaceChildren();
    if (intro) {
      const p = document.createElement("p");
      p.textContent = intro;
      copy.append(p);
    }
    if (hometown) {
      const p = document.createElement("p");
      p.textContent = hometown;
      copy.append(p);
    }
  }
  const hobbyList = document.querySelector("[data-hobbies]");
  if (hobbyList) {
    hobbyList.replaceChildren();
    for (const hobby of hobbies) {
      const li = document.createElement("li");
      li.textContent = hobby;
      hobbyList.append(li);
    }
    hobbyList.hidden = hobbies.length === 0;
  }
  const grid = document.querySelector("[data-gallery]");
  if (grid) {
    grid.replaceChildren();
    for (const photo of gallery) {
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = photo.alt || "";
      img.loading = "lazy";
      img.decoding = "async";
      figure.append(img);
      grid.append(figure);
    }
  }
}

function renderContact(profile) {
  const root = document.querySelector("[data-contact]");
  if (!root) return;
  const c = profile.contact;
  root.replaceChildren();

  if (!isPlaceholder(c.email)) root.append(contactCard("Email", c.email, `mailto:${c.email}`));
  if (!isPlaceholder(c.github)) root.append(contactCard("GitHub", c.githubLabel || c.github, c.github));
  if (!isPlaceholder(c.linkedin)) root.append(contactCard("LinkedIn", c.linkedinLabel || c.linkedin, c.linkedin));
  if (!isPlaceholder(c.scholar)) root.append(contactCard("Google Scholar", c.scholarLabel || "Google Scholar profile", c.scholar));

  const note = document.querySelector("[data-collaboration]");
  if (note) note.textContent = c.collaboration;

  const cv = document.querySelector("[data-cv]");
  if (cv) {
    cv.replaceChildren();
    if (!isPlaceholder(c.cv)) {
      cv.hidden = false;
      cv.append(textLink(c.cv, "Download CV", "button button-primary"));
    } else {
      cv.hidden = true;
    }
  }
}

function wireCvLink(path) {
  const link = document.querySelector("[data-cv-link]");
  if (!link) return;
  if (isPlaceholder(path)) {
    link.hidden = true;
    return;
  }
  link.hidden = false;
  link.href = path;
  if (!/^https?:/i.test(path)) link.setAttribute("download", "");
}

function renderStructuredData(profile) {
  const node = document.querySelector("#person-ld");
  if (!node) return;
  const person = profile.person;
  const sameAs = [profile.contact.github, profile.contact.linkedin, profile.contact.scholar].filter((url) => !isPlaceholder(url));
  node.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Person",
    name: person.name,
    jobTitle: person.title,
    affiliation: person.affiliation,
    address: person.location,
    email: profile.contact.email,
    url: "https://nazmulislam-lab.github.io/",
    image: person.portrait ? `https://nazmulislam-lab.github.io/${person.portrait}` : undefined,
    sameAs
  });
}

function initials(org) {
  return String(org || "")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function initReveal() {
  const nodes = [...document.querySelectorAll(".reveal")].filter((node) => !node.hidden);
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) {
    nodes.forEach((node) => node.classList.add("is-in"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.12 });
  nodes.forEach((node) => observer.observe(node));
}

function isPlaceholder(value) {
  const text = String(value || "").trim();
  return !text || /\bTODO\b/i.test(text);
}

function contactCard(label, value, href) {
  const link = document.createElement("a");
  link.className = "contact-card";
  link.href = href;
  if (!href.startsWith("mailto:")) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  const kicker = document.createElement("span");
  kicker.textContent = label;
  const text = document.createElement("strong");
  text.textContent = value;
  link.append(kicker, text);
  return link;
}

function textLink(href, label, className) {
  const link = document.createElement("a");
  link.href = href;
  if (className) link.className = className;
  if (!href.startsWith("mailto:") && !href.startsWith("#") && !href.startsWith("assets/")) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }
  if (className && className.includes("button") && href.startsWith("assets/")) link.setAttribute("download", "");
  link.textContent = label;
  return link;
}

function setText(selector, value) {
  const node = document.querySelector(selector);
  if (node && value != null) node.textContent = value;
}

function initNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function initThemeToggle() {
  const button = document.querySelector("[data-theme-toggle]");
  if (!button) return;
  const sync = () => {
    const theme = document.documentElement.dataset.theme || "light";
    button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    button.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#101114" : "#f6f3ec");
  };
  sync();
  button.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* private mode */
    }
    sync();
  });
}
