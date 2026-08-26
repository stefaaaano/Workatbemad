# The Post Office Workspace — brief de développement

> Fichier de travail destiné à Claude Code.
> Ouvrir un terminal dans ce dossier, lancer `claude`, puis : « Lis `INSTRUCTIONS.md` et exécute-le, étape par étape, en me montrant le résultat après chaque section. »

---

## 1. Contexte

The Post Office est un ensemble de bureaux privatifs meublés situé aux Papeteries de Genval (14 rue de Rixensart, 1332 Genval), exploité par BE MAD SRL. Quatre bureaux sont proposés à la location, en formule **Full Time** (à l'année) ou **Flexi Time** (2 ou 3 jours par semaine).

Le dossier contient une page web dérivée de la brochure tarifaire. **Elle s'affiche correctement sur ordinateur et très mal sur téléphone.** C'est le problème principal : la quasi-totalité des prospects reçoivent le lien par SMS, WhatsApp ou depuis une annonce, et l'ouvrent sur mobile.

**Objectif du chantier : faire de cette page une vitrine impeccable sur téléphone, sans rien perdre de l'élégance de la version bureau, et amener le visiteur au téléphone ou à l'e-mail.**

Le site n'a pas vocation à vendre en ligne. Il a une seule mission : donner envie de venir visiter, et rendre le contact évident.

---

## 2. État des lieux

```
index.html      markup complet, une seule page qui défile
style.css       tous les styles
images/         9 fichiers JPEG/PNG (~740 Ko au total)
README.md       ancienne note de travail — OBSOLÈTE, ce fichier-ci la remplace
```

`index.html` est actuellement découpé en trois blocs `.page` :

1. `.page.cover` — la mosaïque de tuiles (logo terracotta, façade, grande table, tuile de texte, 6 photos) + l'adresse du site
2. `.page.spread` — les deux grilles tarifaires, Full Time et Flexi Time
3. `.page` — « Tout est compris », les conditions, la frise de toits, le bloc de contact, les mentions légales

Ce découpage en `.page` n'existait que pour l'impression PDF. **Ce n'est plus une contrainte** (voir §4).

### Identité graphique — à respecter scrupuleusement

| Rôle | Valeur |
|---|---|
| Terracotta | `#AB3722` (variable `--brick`) |
| Fond du logo | `#A24026` — **ne pas modifier**, c'est la couleur du fichier logo |
| Fond terracotta clair | `#FBF1EE` (`--brick-bg`) |
| Encre | `#241C19` (`--ink`), secondaire `#5C4B44` (`--ink-2`), atténué `#8E7C74` (`--muted`) |
| Filet | `#E4C8C1` (`--rule`) |
| Typographie | Montserrat (Google Fonts), graisses 300 / 400 / 600 / 700 |

L'esprit est celui d'un imprimé : filets fins, capitales espacées, beaucoup de blanc, aucune ombre portée, aucun coin arrondi, aucun dégradé. **Ne pas « moderniser » le style.** Toute modification visuelle doit rester invisible pour quelqu'un qui compare la page à la brochure papier.

### Contraintes techniques

- **Aucun framework, aucune étape de build, aucune bibliothèque externe.** HTML + CSS + un fichier JavaScript minimal, c'est tout.
- Le site doit fonctionner en ouvrant `index.html` directement dans un navigateur (chemins relatifs uniquement).
- Un seul fichier CSS (`style.css`), un seul fichier JS (`script.js`, à créer, chargé en `defer`).
- Le thème sombre déjà présent dans les variables CSS (`prefers-color-scheme` + `[data-theme]`) **est conservé** : un visiteur dont le téléphone est en mode sombre voit la version sombre.

---

## 3. Ce qui est verrouillé

Ces éléments ont été arrêtés avec les propriétaires. **Ne jamais les modifier, les reformuler ni les recalculer sans validation explicite :**

- Tous les montants des deux grilles tarifaires
- Toutes les surfaces (7,5 / 10 / 11 / 11,5 m²)
- Les conditions : contrat 12 mois, préavis 3 mois, garantie 1 mois
- La règle Flexi Time : 2 ou 3 jours par semaine, du lundi au vendredi
- La liste « Tout est compris », dans son contenu et son ordre
- Les coordonnées (noms, numéros de téléphone, adresse e-mail, adresse postale)
- Les mentions légales : « hors TVA », « à partir du 1er septembre 2026 », BE MAD SRL, BE 1023.301.696
- Le logo et sa couleur de fond

En cas de doute sur un contenu, **demander plutôt que décider**.

---

## 4. Étape 1 — Sortir la logique brochure

La feuille d'impression n'est plus nécessaire : le PDF de la brochure existe par ailleurs.

- Supprimer entièrement le bloc `@media print` de `style.css`.
- Remplacer les `<div class="page">` par une structure sémantique :

```html
<main>
  <section id="accueil"> … la mosaïque … </section>
  <section id="tarifs">  … les deux grilles … </section>
  <section id="services"> … Tout est compris … </section>
  <section id="conditions"> … les conditions … </section>
  <footer id="contact"> … frise de toits, coordonnées, mentions … </footer>
</main>
```

- Conserver `.sheet` comme conteneur centré (`max-width: 840px`).
- Les identifiants `#accueil`, `#tarifs`, `#services`, `#conditions`, `#contact` servent d'ancres — ils sont utilisés par la barre de contact mobile (§6).
- Ajouter `scroll-margin-top` sur les sections pour que les ancres ne collent pas au bord haut de l'écran.
- Adapter les espacements verticaux : la règle actuelle `.page + .page { margin-top: 64px }` doit devenir un rythme de section cohérent, plus généreux sur grand écran (~72 px) et plus resserré sur mobile (~48 px), en `clamp()`.

**Ne pas repartir de zéro.** Il s'agit de faire évoluer les fichiers existants, en conservant les classes, les variables et la structure de contenu.

---

## 5. Étape 2 — Responsive (priorité absolue)

Cibles de test : **390 px** (iPhone), **430 px** (grand iPhone), **768 px** (iPad portrait), **1024 px**, **1440 px**.

Approche : partir des largeurs de rupture suivantes — `1000px`, `760px`, `640px`, `430px` — et n'en ajouter d'autres que si un élément casse réellement.

### 5.1 La mosaïque — le point le plus critique

Aujourd'hui `.mosaic` est une grille figée de 4 colonnes × 6 rangées avec `aspect-ratio: 182 / 253`, et des placements explicites (`.t-logo`, `.t-facade`, `.t-table`, `.t-text`, `.t-1` … `.t-6`). Sur téléphone, les tuiles deviennent des timbres-poste illisibles.

**Sous 760 px, tout reconstruire :**

- Supprimer l'`aspect-ratio` du conteneur et passer en rangées automatiques.
- Deux colonnes.
- `.t-logo` : pleine largeur, avec un `aspect-ratio` propre autour de `16 / 9`, fond `#A24026` conservé, logo en `object-fit: contain` avec un peu de respiration autour.
- `.t-text` : pleine largeur, **hauteur libre** — retirer `overflow: hidden` et toute contrainte de hauteur, la phrase doit s'afficher en entier. C'est un bug visible aujourd'hui : le texte est coupé.
- `.t-facade` : pleine largeur, `aspect-ratio: 3 / 2`.
- `.t-table` : pleine largeur, `aspect-ratio: 3 / 2`.
- `.t-1` à `.t-6` : par paires sur deux colonnes, `aspect-ratio: 1 / 1`.
- Réinitialiser explicitement `grid-column` et `grid-row` sur chaque classe dans la media query, sinon les placements du desktop persistent.
- Ordre visuel souhaité sur mobile : logo, tuile de texte, façade, grande table, puis les six photos.
- Réduire le `gap` à 6 px sous 430 px.

Au-dessus de 760 px, la mosaïque actuelle est conservée telle quelle.

### 5.2 Les grilles tarifaires

Les tableaux ont `min-width: 560px` et débordent latéralement sur mobile. Le défilement horizontal dans un tableau de prix est un tueur de conversion : le visiteur ne voit pas qu'il y a des colonnes à droite.

**Sous 640 px, transformer chaque tableau en fiches empilées, une par bureau :**

- Masquer le `<thead>` (`position: absolute; clip-path: inset(50%)` — pas `display: none`, pour rester accessible aux lecteurs d'écran).
- Chaque `<tr>` devient une carte : bordure `1px solid var(--brick)`, marge basse, `display: block`.
- Chaque `<td>` devient une ligne libellé/valeur : `display: flex; justify-content: space-between`, libellé à gauche en petites capitales terracotta, valeur à droite.
- Le libellé provient d'un attribut `data-label` à ajouter sur chaque `<td>` dans `index.html`, affiché via `td::before { content: attr(data-label) }`.

Valeurs exactes des `data-label` :

| Tableau | Colonne | `data-label` |
|---|---|---|
| Full Time | Surface | `Surface` |
| Full Time | 1 personne | `1 personne` |
| Full Time | 2 personnes | `2 personnes` |
| Full Time | 3 personnes | `3 personnes` |
| Flexi Time | Surface | `Surface` |
| Flexi Time | 2 jours | `2 jours / semaine` |
| Flexi Time | 3 jours | `3 jours / semaine` |

- La cellule « Bureau X » (`.bureau`) fait office de titre de carte : pleine largeur, fond `var(--brick-bg)`, texte terracotta, pas de libellé `data-label`.
- Les cellules `.none` (le tiret « — » pour 3 personnes) restent affichées avec leur libellé : lire « 3 personnes — » est une information utile, pas un vide.
- `.tablewrap` : supprimer la bordure et l'`overflow-x` dans ce mode, la bordure est portée par chaque carte.
- Retirer `min-width: 560px` du tableau sous ce seuil.

Au-dessus de 640 px, les tableaux restent exactement tels qu'aujourd'hui.

### 5.3 Le reste

- `body` : passer le `padding` latéral de 24 px à 18 px sous 430 px.
- Typographie : rendre fluides les tailles principales avec `clamp()`, sans jamais descendre sous 15 px pour le texte courant ni sous 12,5 px pour les mentions.
- Le bloc `.contact` et le bloc `.conds` ont déjà des media queries qui les passent en colonne — les vérifier et les harmoniser avec les nouvelles ruptures.
- `.included` passe déjà en une colonne sous 620 px — conserver.
- La frise de toits `.roofline` : vérifier qu'elle ne devient pas ridicule sur écran étroit ; réduire sa hauteur à ~18 px sous 640 px.
- Tous les liens tactiles (téléphone, e-mail) : zone cliquable d'au moins 44 × 44 px.
- **Aucun débordement horizontal nulle part.** Vérifier avec `document.documentElement.scrollWidth === document.documentElement.clientWidth` à chaque largeur de test.

---

## 6. Étape 3 — Barre de contact mobile

C'est le point où les prospects se perdent aujourd'hui : les coordonnées ne sont qu'en bas de page.

**Comportement souhaité :** une barre fixe en bas de l'écran, sur mobile uniquement, avec un bouton unique qui **fait défiler la page jusqu'au bloc de contact** — où les numéros et l'adresse e-mail sont écrits en clair et cliquables. Pas d'appel direct depuis la barre : le visiteur doit voir à qui il s'adresse (Manuella ou Matthieu) avant de composer.

Spécifications :

```html
<a class="cta-bar" href="#contact">Réserver une visite</a>
```

- Visible uniquement sous 760 px.
- `position: fixed; bottom: 0; left: 0; right: 0`, fond terracotta `var(--brick)`, texte blanc, capitales espacées, hauteur ~56 px.
- `padding-bottom: env(safe-area-inset-bottom)` pour les iPhone à encoche.
- Ajouter au `body` un `padding-bottom` équivalent sous 760 px, pour que les mentions légales ne soient jamais masquées.
- Défilement doux : `scroll-behavior: smooth` sur `html`, neutralisé sous `prefers-reduced-motion`.
- À l'arrivée sur `#contact`, déplacer le focus clavier sur le bloc de contact (`tabindex="-1"` + `.focus()`), pour l'accessibilité.
- **La barre disparaît quand le bloc de contact est visible à l'écran** (IntersectionObserver sur `#contact`) : à ce moment-là elle ne sert plus à rien et masque du contenu. Transition d'opacité et de translation, ~200 ms.
- Sans JavaScript, la barre reste simplement visible en permanence — c'est un comportement acceptable, ne jamais la rendre dépendante de JS pour apparaître.

---

## 7. Étape 4 — Les deux animations

### À l'ouverture — la mosaïque en cascade

Les tuiles apparaissent l'une après l'autre : chacune monte de quelques pixels (8 à 12 px) en se révélant. Durée totale d'environ **1 seconde**, jamais plus.

Ordre : le bloc terracotta du logo d'abord, puis la façade, puis les autres en diagonale (tuile de texte, grande table, puis `.t-1` → `.t-6`).

- **CSS pur**, via `animation-delay` par classe, sans JavaScript.
- Courbe douce, type `cubic-bezier(.2,.7,.3,1)`.
- Pas d'effet de rebond, pas de rotation, pas de zoom : c'est un imprimé qui se pose, pas une interface d'application.

### Au défilement — révélation des sections

Chaque section se révèle en douceur à son entrée dans la fenêtre, **une seule fois** (déconnecter l'observateur après déclenchement).

- `IntersectionObserver`, seuil ~0,15, aucune bibliothèque externe.
- Translation verticale de 12 px maximum + fondu, ~450 ms.

### Règle absolue sur les deux

Le contenu doit **rester visible si le JavaScript ne s'exécute pas**. Ne jamais partir d'un `opacity: 0` que seul JS pourrait lever. Méthode imposée :

```html
<script>document.documentElement.classList.add('js')</script>
```

placé en ligne tout en haut du `<head>`, et en CSS :

```css
.js .reveal { opacity: 0; transform: translateY(12px); }
.js .reveal.is-visible { opacity: 1; transform: none; transition: … }
```

Et pour finir :

```css
@media (prefers-reduced-motion: reduce) {
  /* toutes les animations et transitions neutralisées,
     tous les éléments en opacity: 1 et transform: none */
}
```

---

## 8. Étape 5 — Images en WebP

Les images pèsent aujourd'hui environ 740 Ko, dont 222 Ko pour la seule façade.

**Convertir tout le dossier `images/` en WebP et supprimer les fichiers JPEG/PNG d'origine** (une seule exception, l'image de partage — voir §9). Le WebP est supporté par tous les navigateurs depuis 2020 ; pas de balise `<picture>`, pas de repli, on garde le code simple.

Méthode : `cwebp` (Homebrew : `brew install webp`) ou `sharp` via Node. Tu choisis, l'important est le résultat.

Redimensionnement avant conversion — les tuiles sont affichées petites, inutile de servir du 3000 px :

| Fichier | Largeur max | Qualité | Cible |
|---|---|---|---|
| `facade` | 1400 px | ~78 | < 110 Ko |
| `grande-table` | 1200 px | ~78 | < 80 Ko |
| `salle-reunion`, `couloir-entree`, `couloir-bureaux`, `cuisine`, `postes-de-travail`, `cactus` | 900 px | ~78 | < 45 Ko chacun |
| `logo.png` | 900 px | qualité 90, **transparence préservée** | < 40 Ko |

**Objectif global : moins de 350 Ko pour l'ensemble du dossier `images/`.** Si une image dépasse sa cible, baisser la qualité par pas de 4 jusqu'à 70, pas en dessous. Vérifier visuellement chaque image après conversion — en particulier la façade (aplats de ciel, susceptibles de se dégrader) et le logo (bords du lettrage).

Puis :

- Mettre à jour tous les `src` dans `index.html`.
- Ajouter `width` et `height` sur **chaque** `<img>`, aux dimensions réelles du fichier converti, pour supprimer les sauts de mise en page au chargement.
- Conserver `loading="lazy"` et `decoding="async"` partout **sauf** sur le logo et la façade, qui sont visibles d'emblée.
- Ajouter `fetchpriority="high"` sur le logo et la façade.
- Conserver tous les textes alternatifs existants à l'identique.

---

## 9. Étape 6 — Métadonnées et partage

Ce qui s'affiche quand le lien est envoyé par WhatsApp, LinkedIn ou iMessage — c'est-à-dire, en pratique, le premier contact du prospect avec le lieu.

À ajouter dans le `<head>` :

- `og:title` — `The Post Office Workspace — Bureaux privatifs aux Papeteries de Genval`
- `og:description` — reprendre la `meta description` existante
- `og:image` — **`images/og.jpg`**, à générer depuis la façade : 1200 × 630 px, recadrée proprement, en JPEG qualité 82, moins de 200 Ko. C'est la seule exception à la règle « tout en WebP » : certaines messageries ne prévisualisent toujours pas le WebP.
- `og:image:width`, `og:image:height`, `og:image:alt`
- `og:url` — `https://www.the-post-office.be/`
- `og:type` = `website`, `og:locale` = `fr_BE`, `og:site_name` = `The Post Office`
- `twitter:card` = `summary_large_image`, plus `twitter:title`, `twitter:description`, `twitter:image`
- `<link rel="canonical" href="https://www.the-post-office.be/">`
- `<meta name="theme-color">` : `#AB3722` en clair, `#17110F` en sombre (deux balises avec `media`)

Favicon, généré depuis le logo :

- `favicon.ico` (32 × 32) à la racine
- `icon.png` 192 × 192 et 512 × 512
- `apple-touch-icon.png` 180 × 180, **sur fond terracotta plein `#A24026`** — iOS n'aime pas la transparence
- déclarations correspondantes dans le `<head>`

Ajouter aussi un `robots.txt` autorisant tout, et un `sitemap.xml` d'une seule URL.

---

## 10. Étape 7 — Accessibilité et qualité

- Contrastes : vérifier les deux thèmes. Le thème sombre (`#E2775C` sur `#17110F`, `#C9B6AE` sur `#17110F`) doit atteindre AA (4,5:1 pour le texte courant, 3:1 pour le grand texte). Ajuster les variables du thème sombre si nécessaire — **mais jamais celles du thème clair**, qui sont celles de la brochure.
- Hiérarchie de titres : la page n'a aujourd'hui aucun `<h1>`. Ajouter un `<h1>` visuellement masqué mais lisible par les lecteurs d'écran (`The Post Office Workspace — bureaux privatifs à Genval`), et passer les `.label` de section en `<h2>` en conservant leur style actuel.
- Les tableaux : ajouter un `<caption>` masqué visuellement à chacun, et `scope="col"` sur les `<th>`.
- Les numéros de téléphone restent en liens `tel:` avec le format international (`+32473740573`), affichés au format belge (`0473 74 05 73`).
- `:focus-visible` existe déjà — le vérifier sur tous les éléments interactifs, y compris la nouvelle barre de contact.
- Aucun texte en dessous de 12,5 px.

---

## 11. Étape 8 — Vérification

À faire avant de considérer le travail terminé.

1. **Rendu réel à chaque largeur de test** — 390, 430, 768, 1024, 1440 px. Prendre une capture d'écran de la page entière à chaque largeur, les regarder, et les joindre au récapitulatif final.
2. **Pas de débordement horizontal** à aucune de ces largeurs.
3. **Thème sombre** : refaire la série 390 px et 1440 px avec `prefers-color-scheme: dark`.
4. **Sans JavaScript** : désactiver JS, recharger — toute la page doit être lisible, la barre de contact visible, aucun bloc invisible.
5. **`prefers-reduced-motion: reduce`** : plus aucun mouvement.
6. **Lighthouse mobile** : viser 95+ en Performance, 100 en Accessibilité, 100 en Bonnes pratiques, 100 en SEO. Reporter les scores obtenus.
7. **Aperçu de partage** : vérifier le rendu des balises Open Graph (par exemple avec l'inspecteur de post LinkedIn ou opengraph.xyz une fois le site en ligne).
8. **Contenus verrouillés** : relire la liste du §3 et confirmer, ligne par ligne, que rien n'a bougé. Un `git diff` sur les montants et les coordonnées suffit.

---

## 12. Étape 9 — Mise en ligne (GitHub + Netlify)

### Dépôt Git

- `git init` dans ce dossier.
- `.gitignore` contenant au minimum `.DS_Store`, `node_modules/`, `*.log`.
- Commits **granulaires**, un par étape de ce brief (« responsive : mosaïque mobile », « images : conversion WebP », etc.), messages en français.
- Créer le dépôt GitHub — **privé** — et pousser sur `main`. Si `gh` est disponible : `gh repo create the-post-office --private --source=. --push`. Sinon, m'indiquer la commande à lancer après avoir créé le dépôt à la main.

### Netlify

Ajouter à la racine un `netlify.toml` :

```toml
[build]
  publish = "."
  command = ""

[[headers]]
  for = "/images/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/*.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

Puis rédiger, **en français et pas à pas**, dans un fichier `DEPLOIEMENT.md` à la racine :

1. Connexion à Netlify avec le compte GitHub, « Add new site » → « Import an existing project » → choisir le dépôt.
2. Réglages de build : aucune commande, répertoire de publication `.`, branche `main`.
3. Branchement du domaine `www.the-post-office.be` : quel enregistrement DNS créer chez le registrar (CNAME `www` → `<nom-du-site>.netlify.app`), et la redirection du domaine nu vers `www`.
4. Le certificat HTTPS : automatique, délai d'activation habituel.
5. Comment mettre le site à jour ensuite : un `git push` sur `main` suffit, Netlify redéploie seul.

Ce fichier doit pouvoir être suivi par quelqu'un qui n'a jamais utilisé Netlify.

---

## 13. Méthode de travail attendue

- Traiter les étapes **dans l'ordre** : §4, puis §5, §6, §7, §8, §9, §10, §11, §12.
- **Faire évoluer les fichiers existants**, ne pas les réécrire depuis zéro. Le HTML et le CSS actuels sont propres et portent l'identité de la brochure ; ils sont un point de départ, pas un brouillon.
- S'arrêter et montrer le résultat après §5 (responsive) et après §8 (images) — ce sont les deux moments où une erreur de goût coûte cher.
- Signaler toute ambiguïté plutôt que de trancher seul, en particulier sur les contenus du §3.
- Aucune dépendance ajoutée au projet livré. Les outils de conversion d'images sont des outils locaux, pas des dépendances du site.
- Récapitulatif final attendu : ce qui a été fait, les captures d'écran, les scores Lighthouse, le poids total du site, et ce qui reste éventuellement à décider.

---

## 14. Pour plus tard (hors périmètre)

À ne pas faire maintenant, mentionné pour que l'architecture ne s'y oppose pas :

- Un bouton « Réserver une visite » relié à un agenda en ligne (Calendly ou équivalent), qui remplacerait le lien d'ancrage de la barre mobile.
- Un formulaire de contact (Netlify Forms fonctionne sans backend).
- Un bloc « Accès & situation » avec une carte.
- Un indicateur de disponibilité des bureaux, mis à jour à la main.
- Une galerie photos avec lightbox.
- Une version néerlandaise et anglaise.
