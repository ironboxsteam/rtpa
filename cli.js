#!/usr/bin/env node

const { select, input, confirm } = require("@inquirer/prompts");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");
const fetch = require("node-fetch");

console.log(
    `
        *******       ************   ********         **
        *********     ************   **********      *****
        ***    ***         ***       ***    ***     *** ***
        *********          ***       *********     ***   ***
        *******            ***       ******       ***********
        ***  ***           ***       ***          *********** 
        ***   ***          ***       ***          ***     ***
        ***    ***         ***       ***          ***     *** (@by likeur)
    `
);
console.log("✨ Bienvenue dans l'outil de création de projet Tailwind CSS !");

async function createAndPushToGitHub(
  projectName,
  projectPath,
  gitHubToken,
  isPrivate
) {
  try {
    console.log("\n⏳ Création du dépôt sur GitHub...");

    const response = await fetch("https://api.github.com/user/repos", {
      method: "POST",
      headers: {
        Authorization: `token ${gitHubToken}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        name: projectName,
        private: isPrivate,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Échec de la création du dépôt GitHub: ${response.status} - ${errorText}`
      );
    }

    const repoData = await response.json();
    const repoUrl = repoData.clone_url;
    const userName = repoData.owner.login;

    console.log("✅ Dépôt GitHub créé avec succès !");

    console.log("⏳ Préparation du premier commit...");
    execSync("git add .");
    execSync('git commit -m "feat: initial project setup"');

    console.log("⏳ Push du projet sur GitHub...");
    execSync(`git remote add origin ${repoUrl}`);
    execSync("git branch -M main");
    execSync("git push -u origin main");

    console.log(`\n🎉 Projet poussé sur GitHub avec succès !`);
    console.log(
      `🔗 Votre dépôt est disponible à l'adresse : ${repoUrl.replace(
        ".git",
        ""
      )}`
    );
  } catch (error) {
    console.error(
      "❌ Une erreur est survenue lors de la connexion à GitHub :",
      error.message
    );
    console.log(
      "\n❗ Le projet a été créé localement. Vous pouvez le pousser manuellement plus tard."
    );
  }
}

async function main() {
  try {
    const projectType = await select({
      message: "Quel type de projet souhaitez-vous créer ?",
      choices: [
        {
          name: "Projet HTML/CSS simple",
          value: "simple",
          description: "Crée un projet HTML/CSS statique avec Tailwind CSS.",
        },
      ],
    });

    const projectName = await input({
      message: "Quel est le nom de votre projet ?",
      default: "mon-projet-tailwind",
      validate: (value) => {
        if (/^([A-Za-z\-\_\d])+$/.test(value)) {
          return true;
        }
        return "Le nom du projet ne doit contenir que des lettres, chiffres, tirets et underscores.";
      },
    });

    console.log(`\nCréation du projet '${projectName}'...`);

    // create project folder
    const projectPath = path.join(process.cwd(), projectName);
    if (fs.existsSync(projectPath)) {
      console.error(`❌ Erreur : Le dossier '${projectName}' existe déjà.`);
      process.exit(1);
    }
    fs.mkdirSync(projectPath);
    process.chdir(projectPath);

    // npm init 
    console.log("📦 Initialisation de npm...");
    execSync("npm init -y");

    // dependancy installation
    let dependencies = ["tailwindcss @tailwindcss/cli"];
    console.log("🔧 Installation des dépendances de développement...");
    execSync(`npm install -D ${dependencies.join(" ")}`, { stdio: "inherit" });

    // Creation of base file structure
    fs.mkdirSync(path.join(projectPath, "css"));
    fs.mkdirSync(path.join(projectPath, "img"));

    // Creation of the input.css file
    fs.writeFileSync(
      path.join(projectPath, "css", "input.css"),
      `@import "tailwindcss"`
    );

    // Adding script
    const scriptName = "start";
    const scriptCommand =
      "npx @tailwindcss/cli -i ./css/input.css -o ./css/output.css --watch";

    // path to package.json
    const packageJsonPath = path.join(process.cwd(), "package.json");

    try {
      const packageJsonData = fs.readFileSync(packageJsonPath, "utf-8");
      const packageJson = JSON.parse(packageJsonData);

      // verify if scripts section exist, if not we create one
      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }

      // add new script for running tailwindcss server
      packageJson.scripts[scriptName] = scriptCommand;

      // rewrite package.json
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

      console.log(
        `\n✅ Le script "${scriptName}" a été ajouté à votre package.json.`
      );
    } catch (error) {
      console.error(
        "❌ Erreur lors de la modification de package.json :",
        error
      );
    }

    // index.html file
    fs.writeFileSync(
      path.join(projectPath, "index.html"),
      `<!doctype html>
    <html lang="fr">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="./dist/output.css" rel="stylesheet">
      <title>${projectName}</title>
      <link rel="stylesheet" href="css/output.css">
    </head>
    <body>
      <h1 class="text-center text-3xl font-bold underline">
        Hello world !
        Happy coding to you mate.
    
      </h1>
      <p>
        coded with love by <a href="https://github.com/Likeur" class="underline text-blue-500">likeur</a>
      </p>
    </body>
    </html>`
    );

    // initializing an empty git local repo and creation of gitignore file
    console.log("🌱 Initialisation du dépôt Git...");
    execSync("git init");

    const gitignoreContent = `/node_modules\n`;
    fs.writeFileSync(path.join(projectPath, ".gitignore"), gitignoreContent);

    //connexion to git
    const connectToGitHub = await confirm({
      message:
        "Souhaitez-vous créer un dépôt GitHub pour ce projet et y pousser le code ?",
    });

    if (connectToGitHub) {
      const gitHubToken = await input({
        message:
          'Veuillez entrer votre token d\'accès personnel (PAT) GitHub. (Nécessite la permission "repo")',
      });

      const isPrivate = await confirm({
        message: "Voulez-vous que le dépôt soit privé ?",
        default: true,
      });

      await createAndPushToGitHub(
        projectName,
        projectPath,
        gitHubToken,
        isPrivate
      );
    } else {
      console.log("\n✅ Projet créé avec succès !");
      console.log("🚀 Pour commencer, suivez ces étapes :");
      console.log(`1. Accédez au dossier : \`cd ${projectName}\``);
      console.log("2. Lancez le serveur de développement : `npm run start`");
      console.log(
        "3. Ouvrez votre `index.html` dans le navigateur et commencez à coder !"
      );
    }
  } catch (error) {
    if (error.isTtyError) {
    } else {
      console.error("❌ Une erreur est survenue :", error);
    }
  }
}

main();
