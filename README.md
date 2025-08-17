# RTPA - Ready Tailwind CSS Project Assistant Creation Tool

RTPA (Rapid Tailwind Project Assistant) is a command-line tool designed to simplify the creation of new web projects with **Tailwind CSS**. It supports setting up both simple HTML/CSS projects and modern **Vite.js** based projects, with automatic Tailwind CSS integration.

## Features

* **Fast Project Creation:** Launch a new static HTML/CSS project or a Vite.js project in seconds.

* **Tailwind CSS Integration:** Automatically configures Tailwind CSS for your project.

* **Vite.js Option:** Sets up Vite.js with the Tailwind CSS plugin for a modern development experience.

* **Command Line Arguments:** Specify project type and name directly from the command line.

* **Git Initialization:** Automatically initializes a local Git repository.

* **GitHub Integration (Optional):** Initializes a GitHub repository and pushes your code (requires a GitHub PAT).

## Installation

To use RTPA, you need Node.js and npm (or Yarn/pnpm) installed on your machine.

### Global Installation (Recommended)

Using npm : you can install it globally:

```bash
npm install -g rtpa
```
```bash
yarn global add rtpa
```
```bash
pnpm install -g rtpa
```
## Connexion à GitHub

L'outil vous propose de vous connecter à votre compte GitHub pour créer un dépôt et y pousser le projet automatiquement. Vous pouvez choisir de vous connecter ou de continuer sans créer de repo.

Si vous choisissez de vous connecter à GitHub, l'outil vous demandera votre token d'accès personnel (PAT). Ce token est nécessaire pour que le script puisse créer et pousser le dépôt en votre nom.

### Comment obtenir votre token d'accès personnel (PAT) :

- Rendez-vous sur les [Paramètres des jetons d'accès personnels de GitHub](https://github.com/settings/tokens).

- Cliquez sur "Generate new token" (Générer un nouveau jeton).

- Choisissez le token classic

- Donnez un nom explicite à votre token (`ex: cli-tailwind-tool`).

- Cochez la case pour la permission `repo` (pour créer un dépôt).

- Cliquez sur "Generate token" et copiez le token affiché. Gardez-le en lieu sûr, il ne sera plus affiché après !

## Note : 

Votre token n'est stocké nulle part. Il est utilisé une seule fois lors de l'exécution du script pour authentifier votre requête à l'API de GitHub. ceci garanti la sécurité de votre compte github.



coded with love by @likeur