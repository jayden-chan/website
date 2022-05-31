const { readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

function e(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const resume = JSON.parse(
  readFileSync("./content/resume.json", { encoding: "utf8" })
);

const cheats = JSON.parse(
  readFileSync("./content/cheat.json", { encoding: "utf8" })
);

const renderDir = process.argv[2] ?? "dist";

const templateReplace = (path, replacements) => {
  let file = readFileSync(path, {
    encoding: "utf8",
  });

  Object.entries(replacements).forEach(([key, val]) => {
    file = file.replace(key, val);
  });

  writeFileSync(path, file);
};

const renderCheat = (cheat) => {
  return `<div class="cheat">
      <h2>${e(cheat.title)}</h2>
      <p>${cheat.tags.map((t) => `#${e(t)}`).join(", ")}</p>
      <pre>${e(cheat.code)}</pre>
    </div>`;
};

const renderExp = (exp) => {
  if (exp.roles === undefined) {
    console.error(exp);
    throw new Error("undef");
  }
  return `<div class="exp${exp.print ? "" : " donotprint"}">
                <div class="exprow">
                  <h2><a href="${e(exp.website)}">${e(exp.company)}</a></h2>
                  <h3>
                    <i class="fa-solid fa-location-dot"></i>${e(exp.location)}
                  </h3>
                </div>
                <div class="exprow">
                  <h4>${e(exp.title)}</h4>
                  <h4>${e(exp.time)}</h4>
                </div>
                <div class="expdesc">
                  <ul>
${exp.roles.map((r) => `${" ".repeat(20)}<li>${e(r)}</li>`).join("\n")}
                  </ul>
                </div>
              </div>`;
};

const renderProject = (proj) => {
  return `<div class="exp project${proj.print ? "" : " donotprint"}">
                <div class="projrow">
                  <h2>
                    <a href="https://github.com/jayden-chan/${e(proj.github)}"
                      >${e(proj.title)} <i class="fa-brands fa-github"></i
                    ></a>
                  </h2>
                  <h4>${e(proj.time)}</h4>
                </div>
                <h4>${e(proj.stack)}</h4>
                <ul>
${proj.roles.map((r) => `${" ".repeat(18)}<li>${e(r)}</li>`).join("\n")}
                </ul>
              </div>`;
};

const renderAward = (award) => {
  return `<div class="exp award">
                <div class="projrow">
                  <h2>${e(award.result)}</h2>
                  <h4>${e(award.time)}</h4>
                </div>
                <h4>${e(award.desc)}</h4>
              </div>`;
};

templateReplace(join(renderDir, "resume", "index.html"), {
  "{{ exp }}": resume.experience
    .map((e) => renderExp(e))
    .join("\n              "),
  "{{ proj }}": resume.projects
    .map((p) => renderProject(p))
    .join("\n              "),
  "{{ awards }}": resume.awards
    .map((a) => renderAward(a))
    .join("\n              "),
  "{{ langs }}": resume.skills.lang
    .map((l) => `<p>${e(l)}</p>`)
    .join("\n" + " ".repeat(18)),
  "{{ tech }}": resume.skills.tech
    .map((t) => `<p>${e(t)}</p>`)
    .join("\n" + " ".repeat(18)),
  "{{ tools }}": resume.skills.tools
    .map((t) => `<p>${e(t)}</p>`)
    .join("\n" + " ".repeat(18)),
  "{{ interests }}": resume.interests
    .map((i) => `<p>${e(i)}</p>`)
    .join("\n" + " ".repeat(16)),
});

templateReplace(join(renderDir, "cheatsheets", "index.html"), {
  "{{ cheatsheets }}": cheats.cards
    .map((e) => renderCheat(e))
    .join("\n              "),
});
