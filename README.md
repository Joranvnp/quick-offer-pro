# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## D) Schéma DB + Sécurité

### Tables

```sql
-- Table: packs
CREATE TABLE packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,           -- "Starter", "Pro", "Pro+"
  base_price INTEGER NOT NULL,  -- en centimes
  features JSONB NOT NULL,      -- ["One-page", "Formulaire contact", ...]
  default_timeline_days INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: options
CREATE TABLE options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price INTEGER NOT NULL,       -- en centimes
  compatible_packs TEXT[],      -- ["Starter", "Pro", "Pro+"]
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table: proposals
CREATE TABLE proposals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,   -- court, ex: "abc123"

  -- Prospect
  prospect_name TEXT NOT NULL,
  prospect_company TEXT,
  prospect_sector TEXT,
  prospect_city TEXT,
  prospect_problem TEXT,        -- enum
  prospect_goal TEXT,           -- enum

  -- Offre
  pack_id UUID REFERENCES packs(id),
  selected_options UUID[],      -- références aux options

  -- Pricing
  total_price INTEGER NOT NULL,
  deposit_percent INTEGER DEFAULT 30,

  -- Livraison
  delivery_estimate DATE,

  -- Freelance
  owner_name TEXT NOT NULL,
  owner_phone TEXT,
  owner_email TEXT NOT NULL,
  owner_website TEXT,
  owner_siret TEXT,

  -- Meta
  tone TEXT DEFAULT 'neutral',  -- "neutral", "confident", "simple"
  status TEXT DEFAULT 'draft',  -- "draft", "sent", "viewed", "accepted"
  pdf_url TEXT,

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  owner_id UUID REFERENCES auth.users(id)
);
```

### RLS Policies

```sql
-- Lecture publique via token (pour les prospects)
CREATE POLICY "Public read via token"
ON proposals FOR SELECT
USING (true);  -- Le token dans l'URL suffit

-- CRUD pour owner
CREATE POLICY "Owner full access"
ON proposals FOR ALL
USING (auth.uid() = owner_id);
```
