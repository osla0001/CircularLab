# Teknisk dokumentation

## Ressourcer

**Astro:**
Astro er et framework som vi har benyttet os af for at lave genbrugelige komponenter (f.eks et card) samt at auto-generere undersider dynamisk.
**AOS (Animate on Scroll library):**
AOS, som står for animate on scroll, er et library (et slags “biblotek” af pre-lavet kode) som indeholoder mange animationer som aktiveres når brugeren scroller.
**Supabase:**
Supabase er en service som lader os hoste vores egen API som vi kan trække fra.

## Astro

### Astro - Installation

Før astro installeres skal [node.js](https://nodejs.org/en) være installeret på dit system. I VS Code, åben terminalen dit nye projekt og kør kommandoen `npm install`. Installer også [astro’s VS code extension](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode).

Åben derefter din terminal og tryk på Ctrl + C for at gå ind i dit projekts rod, hvis du ikke allerede er det. Det burde se således ud i din terminal:

`PS [Dit_drev]:\[Dine_undermapper]\[Dit_projekt]>`

Kør herefter de følgende kommandoer i den fremviste orden:

**1:** `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted`

**2:** `npm create astro@latest`

Installer dependencies, samt andre ting som kunne gavne dit projekt. Hvis du bruger Prettier, så installer Plugin’et som giver prettier support for .astro filer. [Følg instrukserne på Github her.](https://github.com/withastro/prettier-plugin-astro)

### Astro - Komponenter

En komponent er et stykke kode som kan genbruges som var det et HTML element på forskellige sider i stedet for at copy-paste koden hver gang. Her er et eksempel på et ´card´-komponent som kan bruges andre steder:

**MaterialCard.astro**: (Komponenter skal starte med stort bogstav!)

```javascript
---
//@ts-ignore
const { material, material_id } = Astro.props;

//JS-kode skrives imellem disse to
---
```

```HTML
<article>
  <a href={material_id}>
    <img class="hover" src={material.img} alt="Material Card" /></a
  >
</article>

<style>
  img {
    width: 250px;
    height: auto;
    transition: 0.3s;
  }

  .hover:hover {
    scale: 1.02;
    transition: 0.3s;
  }

  article {
    width: 240px;
    height: fit-content;
    padding: 5px;
    transition: 0.3s;
    display: flex;
    margin-bottom: 10px;
  }
</style>
```

Herunder vises snippets af filen hvor den førnævnte komponent bliver brugt. Dette er også en komponent, da komponenter kan sidde inden i hindanden:

**Materials.astro:**

```javascript
---
//@ts-nocheck
import Layout from "../layouts/Layout.astro";
import MaterialCard from "../components/MaterialCard.astro";
import "../styles/general.css";
...
```

```HTML
...
<div class="scroll-box">
    {data.map((material) => <MaterialCard {material} material_id=`/materials/${material.id}` />)}
  </div>
...
```

Endelig ses hvordan dette bliver brugt i index.astro. Index er en side og ikke en komponent, da den starter med et et småt bogstav. Det er her hvor alt HTML’en bliver bygget da astro køres.

**index.astro:**

```javascript

---
import Layout from "../layouts/Layout.astro";
import Header from "../components/Header.astro";
import Hero from "../components/Hero.astro";
import Intro from "../components/Intro.astro";
import Events from "../components/Events.astro";
import Offer from "../components/Offer.astro";
import Materials from "../components/Materials.astro";
import Labs from "../components/Labs.astro";
import Values from "../components/Values.astro";
import Practical from "../components/Practical.astro";
import Footer from "../components/Footer.astro";
import "../styles/general.css";
---
```

```HTML
<Layout layouttitle = "Circular Lab - Mit KEA">
  <Header />
  <Hero />
  <Intro />
  <Offer />
  <Events />
  <Labs />
  <Materials />
  <Values />
  <Practical />
  <Footer />
</Layout>

<style>
  .margin {
    height: 500px;
  }
</style>
```

### Astro - Layouts

Et layout er et slags komponent, som indeholder alle de ting som går igen på en side, som f.eks `<head>`, etc. Læg mærke til hvordan alt indholdet i index.astro er inden i vores Layout.astro komponent.

**Layout.astro:**

```javascript
---
import AOSInit from "../components/AOSInit.jsx";
const {layouttitle} = Astro.props ///Læg mærke hvordan layouttitle bliver brugt i index.astro, hvor dens værdi defineres!
---
```

```HTML

<!doctype html>
<html lang="da">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <!-- Favicon -->
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="favicon_io/apple-touch-icon.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="32x32"
      href="favicon_io/favicon-32x32.png"
    />
    <link
      rel="icon"
      type="image/png"
      sizes="16x16"
      href="favicon_io/favicon-16x16.png"
    />
    <link rel="manifest" href="favicon_io/site.webmanifest" />
    <!-- Meta -->
    <meta
      name="Circular Lab"
      content="Et projekt vedrørende information om Circular Lab på Københavns Erhvervsakademi 2025 gruppe 10"
    />
    <!-- Webfonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
      rel="stylesheet"
    />
    <title>{layouttitle}</title>
  </head>
  <body>
    <AOSInit client:load />
    <slot />
  </body>
</html>
```

### Astro - Dynamiske kort

Vi har også brugt Astro til at dynamisk generere indhold på vores sider baseret på data vi har indhentet fra vores API. Med den følgende teknik har vi både specificeret et dynamisk antal 'cards' på vores hovedside (index.astro) samt genereret et vist antal undersider (events/[id].astro, materials/[id].astro).

Vi har først begyndt med at hente dataen fra vores [Supabase](#) API. Det følgende eksempel er taget fra _Materials.astro_:

```javascript
---
//@ts-nocheck
import Layout from "../layouts/Layout.astro";
import MaterialCard from "../components/MaterialCard.astro";
import "../styles/general.css";
const url =
  "https://bhfvhffdxxdjkhhsibss.supabase.co/rest/v1/materials?select=*&order=num.asc";
const key =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZnZoZmZkeHhkamtoaHNpYnNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNjc3MTEsImV4cCI6MjA1OTg0MzcxMX0.jaV8y7mTFT_UEzDdVByZP-2KfDB_-S98GRYthD5OY-M";

const options = {
  headers: {
    apikey: key,
  },
};

const data = await fetch(url, options).then((res) => res.json());
console.log(data);
---
```

Herunder ses et andet snippet fra samme fil, som viser hvordan vi fremkalder et for hvert objekt i den fremkaldte API:

```HTML
...
<div class="scroll-box">
    {data.map((material) => <MaterialCard {material} material_id=`/materials/${material.id}` />)}
  </div>
...
```
For hvert et card genereres et link til en underside som defineres af kortets bestemte id, som er pullet fra API'en. I dette tilfælde ser linket således ud: `materials/[id].astro`

### Astro - Byg dynamiske undersider
Nu skal disse undersider defineres. Da vi har kaldt filen for vores underside [id].astro, gælder den følgende kode:

**materials/[id].astro:**
```javascript
---
//@ts-nocheck
import Layout from "../../layouts/Layout.astro";
import Header from "../../components/Header.astro";
import Footer from "../../components/Footer.astro";
import "../../styles/general.css";

export async function getStaticPaths() {
  const url =
    "https://bhfvhffdxxdjkhhsibss.supabase.co/rest/v1/materials?select=*";
  const key =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZnZoZmZkeHhkamtoaHNpYnNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyNjc3MTEsImV4cCI6MjA1OTg0MzcxMX0.jaV8y7mTFT_UEzDdVByZP-2KfDB_-S98GRYthD5OY-M";

  const options = {
    headers: {
      apikey: key,
    },
  };

  const data = await fetch(url, options).then((res) => res.json());
  console.log;
  data;

  return data.map((material) => {
    return {
      params: { id: material.id },
      props: { material },
    };
  });
}

const { material } = Astro.props;
---
...
```
Et eksempel på hvordan denne material konstant bruges i filens HTML:
```HTML
...

<Layout layouttitle=`Material #${material.num}`>
  <Header />
  <article class="materialsection">
    <img
      src={material.img}
      class="materialimg"
      data-aos="fade-top"
      data-aos-delay="100"
      data-aos-duration="1000"
    />
    ...
```
Dette har gjort at astro automatisk bygger en HTML side for hvert id speciferet fra vores API når det køres. (eksmpel: `materials/127.html`)

## AOS (Animate on Scroll library)
Vi har benyttet os af et biblotek der hedder [AOS](https://michalsnik.github.io/aos/), som er fyldt med færdiglavede animationer. Brugsanvisninger er allerede veldokumenteret på [deres github side](https://github.com/michalsnik/aos).

### AOS - Installation
AOS kan instilleres i dit VS code projekt via NPM:
`npm install aos --save`

## Supabase


