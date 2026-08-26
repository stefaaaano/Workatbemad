# The Post Office Workspace — site web

Point de départ : la brochure tarifaire, découpée en `index.html` + `style.css` + `images/`.
La page s'affiche déjà correctement sur ordinateur. Le travail restant est décrit plus bas.

## Structure

```
index.html      markup complet, une seule page qui défile
style.css       tous les styles, y compris la feuille d'impression
images/         9 fichiers déjà optimisés (~740 Ko au total)
```

Le HTML est organisé en trois blocs `.page` :

1. `.page.cover` — la mosaïque de tuiles (logo terracotta, façade, grande table, tuile de texte, 6 photos) + l'adresse du site
2. `.page.spread` — les deux grilles tarifaires, Full Time et Flexi Time
3. `.page` — « Tout est compris », les conditions, la frise de toits, le bloc de contact, les mentions

Les classes `.page` ne servent qu'à l'impression (`break-after: page`). À l'écran, tout défile d'un seul tenant. Ne pas les supprimer : la brochure PDF doit continuer à sortir correctement depuis ce même fichier.

## Identité graphique

| Rôle | Valeur |
|---|---|
| Terracotta | `#AB3722` (variable `--brick`) — le logo de la tuile est en `#A24026`, ne pas y toucher |
| Fond terracotta clair | `#FBF1EE` (`--brick-bg`) |
| Encre | `#241C19` (`--ink`), secondaire `#5C4B44` (`--ink-2`), atténué `#8E7C74` (`--muted`) |
| Filet | `#E4C8C1` (`--rule`) |
| Typographie | Montserrat (Google Fonts), graisses 300 / 400 / 600 / 700 |

Un thème sombre est déjà défini dans les variables CSS (`prefers-color-scheme` + `[data-theme]`). Le conserver.

## Ce qu'il reste à faire

### 1. Adaptation mobile — priorité absolue

Trois problèmes visibles dès 390 px de large :

- **La mosaïque reste à 4 colonnes** quelle que soit la largeur : les tuiles deviennent des timbres-poste. Il faut la réorganiser sous ~700 px — par exemple 2 colonnes, avec le logo et les deux grandes photos en pleine largeur, et les 6 petites par paires. Les placements explicites (`.t-logo`, `.t-facade`, `.t-table`, `.t-1` … `.t-6`, `.t-text`) sont à redéfinir dans la media query.
- **La tuile de texte `.t-text` tronque son contenu** : elle est contrainte par la hauteur d'une rangée de grille et `overflow: hidden` coupe la phrase. Sur petit écran, elle doit pouvoir grandir librement.
- **Les tableaux ont `min-width: 560px`** et débordent latéralement. Sous ~640 px, les transformer en fiches empilées : un bloc par bureau, avec les libellés de colonnes repris en étiquettes.

### 2. Les deux animations demandées

- **À l'ouverture** : les tuiles de la mosaïque apparaissent en cascade — chacune monte de quelques pixels en se révélant, avec un décalage progressif. Ordre souhaité : le bloc terracotta d'abord, puis la façade, puis les autres en diagonale. Durée totale ≈ 1 s. Pur CSS.
- **Au défilement** : chaque section se révèle en douceur quand elle entre dans la fenêtre, une seule fois. `IntersectionObserver`, pas de bibliothèque externe.

Dans les deux cas, tout doit être neutralisé sous `@media (prefers-reduced-motion: reduce)`, et le contenu doit rester visible si JavaScript ne s'exécute pas (ne jamais partir d'un `opacity: 0` qui ne serait levé que par JS).

### 3. Métadonnées

`<title>` et `<meta name="description">` sont déjà en place. Il manque : favicon, `og:title`, `og:description`, `og:image` (prendre `images/facade.jpg`), `twitter:card`. C'est ce qui s'affiche quand le lien est partagé sur WhatsApp ou LinkedIn.

### 4. Performance

Les images sont déjà dimensionnées et compressées, et portent `loading="lazy"` sauf les deux premières. Si besoin d'aller plus loin : versions WebP avec repli JPEG, et attributs `width`/`height` pour éviter les sauts de mise en page au chargement.

### 5. À ajouter si le périmètre s'élargit

Un bouton « Réserver une visite » relié à un agenda en ligne. Le site actuel n'a qu'un formulaire de contact, et c'est le point où les prospects se perdent.

## À ne pas modifier sans validation

Les montants, les surfaces, les conditions (12 mois, préavis 3 mois, garantie 1 mois), la règle Flexi Time (2 ou 3 jours par semaine, du lundi au vendredi) et les coordonnées. Tout cela a été arrêté avec les propriétaires.
