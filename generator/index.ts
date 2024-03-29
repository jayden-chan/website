#!/usr/bin/env -S bun run
import { readFile } from "fs/promises";
import { join } from "path";
import { parse as yamlParse } from "yaml";
import { DEPLOYMENT_URL } from "./constants";
import { e, templateReplace } from "./util";

type Resume = {
  skills: {
    lang: string[];
    tech: string[];
    tools: string[];
  };
  experience: {
    company: string;
    location: string;
    print: boolean;
    roles: string[];
    time: string;
    title: string;
    website: string;
  }[];
  projects: {
    github: string;
    print: boolean;
    stack: string;
    time: string;
    title: string;
    roles: string[];
  }[];
  awards: {
    desc: string;
    print: boolean;
    result: string;
    time: string;
  }[];
  interests: string[];
};

const DEFAULT_CSS = `<link rel="stylesheet" href="/styles/font.css" />
    <link rel="stylesheet" href="/styles/index.css" />
    <link rel="stylesheet" href="/styles/print.css" media="print" />
    <link rel="stylesheet" href="/styles/lg.css" media="only screen and (max-width: 1500px)" />
    <link rel="stylesheet" href="/styles/md.css" media="only screen and (max-width: 1200px)" />
    <link rel="stylesheet" href="/styles/sm.css" media="only screen and (max-width: 800px)" />`;

const FA_CSS = `<link rel="stylesheet" href="/fontawesome/css/fontawesome.min.css" />
    <link rel="stylesheet" href="/fontawesome/css/brands.min.css" />
    <link rel="stylesheet" href="/fontawesome/css/solid.min.css" />`;

const BLOG_CSS = `<link rel="stylesheet" href="/styles/blog.css" />`;

const renderExp = (exp: Resume["experience"][0]) => {
  if (exp.roles === undefined) {
    console.error(exp);
    throw new Error("undef");
  }

  const companyName =
    exp.website !== undefined
      ? `<a href="${e(exp.website)}">${e(exp.company)}</a>`
      : e(exp.company);

  return `
<div class="exp${exp.print ? "" : " donotprint"}">
  <div class="exprow">
    <h2>${companyName}</h2>
    <h3 class="nomobile">
      <i class="fa-solid fa-location-dot"></i>${e(exp.location)}
    </h3>
  </div>
  <div class="exprow">
    <h4>${e(exp.title)}</h4>
    <h4>${e(exp.time)}</h4>
  </div>
  <div class="expdesc">
    <ul>
      ${exp.roles.map((r) => `<li>${e(r)}</li>`).join("\n")}
    </ul>
  </div>
</div>`;
};

const renderProject = (proj: Resume["projects"][0]) => {
  return `
<div class="exp project${proj.print ? "" : " donotprint"}">
  <div class="projrow">
    <h2>
      <a href="https://github.com/jayden-chan/${e(proj.github)}"
        >${e(proj.title)} <i class="fa-brands fa-github"></i
      ></a>
    </h2>
    <h3>${e(proj.time)}</h3>
  </div>
  <h4>${e(proj.stack)}</h4>
  <ul>
    ${proj.roles.map((r) => `<li>${e(r)}</li>`).join("\n")}
  </ul>
</div>`;
};

const renderAward = (award: Resume["awards"][0]) => {
  return `
<div class="exp award">
  <div class="projrow">
    <h2>${e(award.result)}</h2>
    <h3>${e(award.time)}</h3>
  </div>
  <h4>${e(award.desc)}</h4>
</div>`;
};

export const GLOBAL_REPLACEMENTS = {
  "{{ css }}": DEFAULT_CSS,
  "{{ fa_css }}": FA_CSS,
  "{{ blog_css }}": BLOG_CSS,
  "{{ deployment_url }}": DEPLOYMENT_URL,
};

async function main() {
  const resume = yamlParse(
    await readFile("./content/resume.yaml", { encoding: "utf8" })
  ) as Resume;

  const args = process.argv.slice(2);
  const dist = args[0] ?? "dist";

  templateReplace(join(dist, "pgp", "index.html"), GLOBAL_REPLACEMENTS);
  templateReplace(join(dist, "ssh", "index.html"), GLOBAL_REPLACEMENTS);
  templateReplace(join(dist, "index.html"), GLOBAL_REPLACEMENTS);
  templateReplace(join(dist, "resume", "index.html"), {
    ...GLOBAL_REPLACEMENTS,
    "{{ exp }}": resume.experience.map(renderExp).join("\n"),
    "{{ proj }}": resume.projects.map(renderProject).join("\n"),
    "{{ awards }}": resume.awards.map(renderAward).join("\n"),
    "{{ langs }}": resume.skills.lang.map((l) => `  <p>${e(l)}</p>`).join("\n"),
    "{{ tech }}": resume.skills.tech.map((t) => `<p>${e(t)}</p>`).join("\n"),
    "{{ tools }}": resume.skills.tools.map((t) => `<p>${e(t)}</p>`).join("\n"),
    "{{ interests }}": resume.interests.map((i) => `<p>${e(i)}</p>`).join("\n"),
  });
}

main();
