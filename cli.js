#!/usr/bin/env node

//v@1.3.0
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
console.log("✨ Welcome to the Ready Tailwindcss Project Assistant Tool!");

async function createAndPushToGitHub(
  projectName,
  projectPath,
  gitHubToken,
  isPrivate
) {
  try {
    console.log("\n⏳ Creating repository on GitHub...");

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
        `Failed to create GitHub repository: ${response.status} - ${errorText}`
      );
    }

    const repoData = await response.json();
    const repoUrl = repoData.clone_url;
    const userName = repoData.owner.login;

    console.log("✅ GitHub repository created successfully!");

    console.log("⏳ Preparing first commit...");
    execSync("git add .");
    execSync('git commit -m "feat: initial project setup"');

    console.log("⏳ Pushing project to GitHub...");
    execSync(`git remote add origin ${repoUrl}`);
    execSync("git branch -M main");
    execSync("git push -u origin main");

    console.log(`\n🎉 Project pushed to GitHub successfully!`);
    console.log(
      `🔗 Your repository is available at: ${repoUrl.replace(
        ".git",
        ""
      )}`
    );
  } catch (error) {
    console.error(
      "❌ An error occurred while connecting to GitHub:",
      error.message
    );
    console.log(
      "\n❗ The project was created locally. You can push it manually later."
    );
  }
}

async function main() {
  try {
    const projectType = await select({
      message: "which type of project do you want to create ?",
      choices: [
        {
          name: "simple HTML/CSS project",
          value: "simple",
          description: "a static website with html/css",
        },
      ],
    });

    const projectName = await input({
      message: "What is the name of your project?",
      default: "my-tailwind-project",
      validate: (value) => {
        if (/^([A-Za-z\-\_\d])+$/.test(value)) {
          return true;
        }
        return "Project name must contain only letters, numbers, hyphens, and underscores.";
      },
    });

    console.log(`\n Creating '${projectName}' project...`);

    // create project folder
    const projectPath = path.join(process.cwd(), projectName);
    if (fs.existsSync(projectPath)) {
      console.error(`❌ Erreur : The folder '${projectName}' already exists. Please choose another name or delete the existing folder.`);
      process.exit(1);
    }
    fs.mkdirSync(projectPath);
    process.chdir(projectPath);

    // npm init 
    console.log("📦 Initializing npm...");
    execSync("npm init -y");

    // dependancy installation
    let dependencies = ["tailwindcss @tailwindcss/cli"];
    console.log("🔧 dependency installation ...");
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
        `\n✅ The script "${scriptName}" has successfully been added to package.json.`
      );
    } catch (error) {
      console.error(
        "❌ Error when updating package.json :",
        error
      );
    }

    // index.html file
    fs.writeFileSync(
      path.join(projectPath, "index.html"),
      `<!doctype html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${projectName}</title>
            <link rel="stylesheet" href="css/output.css">
        </head>
        <body class="p-4 h-screen flex items-center justify-center">
    <main class="container mx-auto px-4 flex flex-col items-center gap-4">
      <p class="text-center bg-blue-600/10 text-sm p-1 px-3 rounded-full text-blue-600">Template Rtpa simple html for ${projectName}</p>
      <h1 class="text-center text-3xl lg:text-5xl font-bold lg:w-[60%]">
         Focus on shipping what matter the most. Happy coding to you mate.
      </h1>
      <p class="text-zinc-500">
        coded with love by
        <a href="https://github.com/Likeur" class="underline text-blue-500"
          >Likeur</a
        >
      </p>
    </main>
        </body>
        </html>`
    );

    // initializing an empty git local repo and creation of gitignore file
    console.log("🌱 Initializing Git repository...");
    execSync("git init");

    const gitignoreContent = `/node_modules\n`;
    fs.writeFileSync(path.join(projectPath, ".gitignore"), gitignoreContent);

    //connexion to git
    const connectToGitHub = await confirm({
      message:
        "Do you want to create a GitHub repository for this project and push the code?",
    });

    if (connectToGitHub) {
      const gitHubToken = await input({
        message:
          'Please enter your GitHub Personal Access Token (PAT). (Requires "repo" permission)',
      });

      const isPrivate = await confirm({
        message: "Do you want the repository to be private?",
        default: true,
      });

      await createAndPushToGitHub(
        projectName,
        projectPath,
        gitHubToken,
        isPrivate
      );
    } else {
      console.log("\n✅ Project created successfully!!");
      console.log("🚀 To get started, follow these steps:");
      console.log(`1. Navigate to the folder : \`cd ${projectName}\``);
      console.log("2. Start the development server : `npm run start`");
      console.log(
        "3. open your `index.html` in the browser !"
      );
    }
  } catch (error) {
    if (error.isTtyError) {
    } else {
      console.error("❌ error when creating the project :", error);
    }
  }
}

main();
