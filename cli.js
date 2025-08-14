#!/usr/bin/env node

const { select, input } = require("@inquirer/prompts");
const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

console.log("✨ Bienvenue dans RTPA : ready tailwindcss project assistant, l'assistant de création de projet Tailwind CSS !");

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

    // 1. Création du dossier du projet
    const projectPath = path.join(process.cwd(), projectName);
    if (fs.existsSync(projectPath)) {
      console.error(`❌ Erreur : Le dossier '${projectName}' existe déjà.`);
      process.exit(1);
    }
    fs.mkdirSync(projectPath);
    process.chdir(projectPath);

    // 2. Initialisation de npm
    console.log("📦 Initialisation de npm...");
    execSync("npm init -y");

    // 3. Installation des dépendances
    let dependencies = ["tailwindcss @tailwindcss/cli"];
    console.log("🔧 Installation des dépendances de développement...");
    execSync(`npm install -D ${dependencies.join(" ")}`, { stdio: "inherit" });

    // 6. Création de la structure de fichiers de base
    fs.mkdirSync(path.join(projectPath, "css"));
    fs.mkdirSync(path.join(projectPath, "img"));

    // Création du fichier input.css
    fs.writeFileSync(
      path.join(projectPath, "css", "input.css"),
      `@import "tailwindcss"`
    );

    // Nom du script à ajouter
    const scriptName = "start";
    // Commande du script
    const scriptCommand =
      "npx @tailwindcss/cli -i ./css/input.css -o ./css/output.css --watch";

    // Chemin vers le fichier package.json
    const packageJsonPath = path.join(process.cwd(), "package.json");

    try {
      // Lire le contenu de package.json
      const packageJsonData = fs.readFileSync(packageJsonPath, "utf-8");
      const packageJson = JSON.parse(packageJsonData);

      // Vérifier si la section "scripts" existe, sinon la créer
      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }

      // Ajouter le nouveau script
      packageJson.scripts[scriptName] = scriptCommand;

      // Réécrire le fichier package.json avec les modifications
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

    // Création du fichier index.html
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

    // 7. Initialisation de Git et création du .gitignore
    console.log("🌱 Initialisation du dépôt Git...");
    execSync("git init");

    const gitignoreContent = `/node_modules\n`;
    fs.writeFileSync(path.join(projectPath, ".gitignore"), gitignoreContent);

    console.log("\n✅ Projet créé avec succès !");
    console.log("🚀 Pour commencer, suivez ces étapes :");
    console.log(`1. Accédez au dossier : \`cd ${projectName}\``);
    console.log("2. Lancez la compilation de Tailwind : `npm run start");
    console.log(
      "3. Ouvrez votre `index.html` dans le navigateur et commencez à coder !"
    );
  } catch (error) {
    if (error.isTtyError) {
      // Gérer les erreurs non interactives
    } else {
      console.error("❌ Une erreur est survenue :", error);
    }
  }
}

main();
