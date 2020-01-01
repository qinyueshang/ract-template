const fs = require("fs-extra");
const path = require("path");
const chalk = require("chalk");

const spawn = require("cross-spawn");

module.exports = function(
  appPath,
  appName,
  verbose,
  originalDirectory,
  templateName
) {
  // const appPackage = require(path.join(appPath, "package.json"));
  const ownPackageName = require(path.join(__dirname, "..", "package.json"))
    .name;
  const templatePath = path.join(appPath, "node_modules", ownPackageName);
  const templateDir = path.join(templatePath, "template");
  const templateJson = require(path.join(templatePath, "template.json"));

  templateJson.name = appName;

  fs.writeFileSync(
    path.join(appPath, "package.json"),
    JSON.stringify(templateJson, null, 2)
  );
  if (fs.existsSync(templateDir)) {
    fs.copySync(templateDir, appPath);
  }
};
