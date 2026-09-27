# IELTS Quest — промпты для генерации артов персонажей

Готовые промпты для генерации картинок во внешнем сервисе (Midjourney v6+, DALL·E 3,
Stable Diffusion / Flux, Leonardo и т.п.). Скопировал → сгенерировал → положил файл в
`src/assets/creatures/<id>.png` → подключим в код.

Я **не** могу генерировать растровые изображения прямо здесь, поэтому это твой шаг.
Когда картинки будут готовы, скажи — и я подключу их в `Card`, `CreaturePortrait`
и игровые экраны (сейчас существа рисуются процедурно на canvas из `bestiary.js`).

---

## 0. Как это использовать

1. Возьми **общий стиль** (раздел 1) — он гарантирует, что весь набор из 32 существ
   выглядит как одна цельная коллекция, а не 32 разных картинки.
2. Добавь к нему **строку конкретного персонажа** (разделы 3–7).
3. Добавь **технический хвост** (раздел 2) — формат, фон, качество.

Шаблон: `[ОБЩИЙ СТИЛЬ] + [ПЕРСОНАЖ] + [ТЕХ. ХВОСТ]`

---

## 1. Общая арт-дирекция (вставлять в каждый промпт)

```
dark fantasy collectible-creature character design, single original creature,
painterly semi-realistic game art with clean cel-shaded edges, dramatic rim light,
volumetric glow, rich saturated accent over a desaturated base, centered 3/4 hero pose,
full body, expressive silhouette, high detail on face and hands, cohesive trading-card
art set, concept-art quality, no text, no logo, no watermark
```

**Negative prompt** (для SD/Flux; для MJ добавь через `--no`):

```
emoji, sticker, cartoon clipart, flat icon, low-poly, blurry, extra limbs, deformed,
duplicate, text, caption, signature, watermark, frame, border, ui, photo of a person
```

---

## 2. Технический хвост (формат вывода)

- **Карточки коллекции / портреты:** вертикаль, прозрачный фон.
  - MJ: `--ar 3:4 --style raw --v 6.1`  (фон убрать в редакторе или `--no background`)
  - DALL·E / Flux: добавь `transparent background, isolated subject, PNG`
- **Игровой спрайт (top-down арена):** квадрат, читаемый силуэт на тёмном фоне.
  - `--ar 1:1`, добавь `clear readable silhouette, slight top-down 3/4 view`
- Имя файла: `src/assets/creatures/<id>.png` (id — из таблиц ниже, в `code`).

---

## 3. Палитра по редкости (свечение рамки/ауры — уже есть в игре)

| Редкость   | Свечение (hex) | Настроение промпта |
|------------|----------------|--------------------|
| common     | `#C7CEDE` серебристо-серый | скромное, приглушённое, маленькое существо |
| uncommon   | `#16C79A` изумруд          | уверенное, чуть магии |
| rare       | `#3B82F6` синий            | героическое, энергия, аура |
| epic       | `#9A5CF6` фиолетовый       | внушительное, потустороннее сияние |
| legendary  | `#FFB02E` золото           | эпичное, божественное, максимум деталей |

В промпте можно прямо указывать: `rarity aura: emerald glow` и т.д.
`base color` ниже — родной тон существа (`artColor` из кода), бери его как доминанту.

---

## 4. Герои-ниндзя (приоритет — это «герой», которым ходишь)

### Kage, the Severed Shadow  ·  `kage_severed`  ·  legendary
```
[ОБЩИЙ СТИЛЬ] a rogue shinobi in a torn black hood and crimson-edged scarf,
fracturing into faint shadow-clones mid-dash, twin kunai trailing violet smoke,
glowing pale eyes under the hood, base color near-black #0F0F1A with crimson and
violet accents, rarity aura: gold glow [ТЕХ. ХВОСТ]
```

### Raiden the Storm Ronin  ·  `raiden_ronin`  ·  legendary
```
[ОБЩИЙ СТИЛЬ] a masked lightning swordsman, indigo armor #1E1B4B, blinking across
the field in a crackle of thunder with electric afterimages, katana humming with raw
voltage, sparks and arcs around the blade, rarity aura: gold glow [ТЕХ. ХВОСТ]
```

---

## 5. Common (8) — маленькие, приглушённые

```
Page Goblin       · page_goblin  · reading    · base #4B5563 · a tiny hunched goblin clutching ancient scrolls, ink-stained fingers, curious eyes
Echo Sprite       · echo_sprite  · listening  · base #374151 · a translucent sound-wisp made of rippling sound waves, faint mouth echoing
Ink Worm          · ink_worm     · vocabulary · base #4B5563 · a fat segmented worm dripping black ink, made of stacked dictionary pages
Rule Rat          · rule_rat     · grammar    · base #374151 · a stern armored rat with iron paws, holding a tiny correction quill
Scroll Bat        · scroll_bat   · reading    · base #1F2937 · a bat with parchment-scroll wings covered in faded academic text, night hunter
Murmur Moth       · murmur_moth  · listening  · base #374151 · a large moth whose wings shimmer with whispered glowing words
Glyph Gecko       · glyph_gecko  · vocabulary · base #4B5563 · a gecko camouflaged with shifting written glyphs across its skin
Comma Crab        · comma_crab   · grammar    · base #374151 · a small crab with claws shaped like punctuation marks, snapping at errors
```
Шаблон строки: `[ОБЩИЙ СТИЛЬ] <описание после ·>, base color <hex>, rarity aura: silver glow [ТЕХ. ХВОСТ]`

---

## 6. Uncommon (7) и Rare (7)

**Uncommon — изумрудная аура:**
```
Stone Sentinel    · stone_sentinel  · reading    · #6B7280 · an ancient mossy stone golem guardian of a great library, glowing rune eyes
Wind Whisperer    · wind_whisperer  · listening  · #4B5563 · a sleek air elemental riding acoustic waves, swirling translucent ribbons
Lexicon Fox       · lexicon_fox     · vocabulary · #78350F · a cunning amber fox with a scroll-tail, rare glowing words floating around it
Syntax Serpent    · syntax_serpent  · grammar    · #064E3B · an emerald serpent coiling sentences into glowing grammatical knots
Rune Owl          · rune_owl        · universal  · #1E3A5F · an owl with feathers inscribed with four glowing elemental runes
Cipher Cat        · cipher_cat      · universal  · #312E81 · a mysterious indigo feline with shifting code-glyphs in its eyes
Prism Parrot      · prism_parrot    · universal  · #7C2D12 · a rainbow-feathered parrot radiating prismatic language sigils
```

**Rare — синяя аура, героичнее:**
```
Tome Dragon       · tome_dragon     · reading    · #1E3A8A · a majestic dragon with scales of compressed book pages, glowing text seams
Storm Listener    · storm_listener  · listening  · #1E3A5F · a storm elemental with antennae perceiving conversations across dimensions
Word Witch        · word_witch      · vocabulary · #4C1D95 · a violet sorceress casting spells woven from glowing academic words
Grammar Knight    · grammar_knight  · grammar    · #1F2937 · an armored knight wielding a sacred sword of grammatical correction
Crystal Phoenix   · crystal_phoenix · universal  · #0C4A6E · a phoenix of crystal feathers holding the wisdom of every exam, radiant
Mnemonic Monk     · mnemonic_monk   · universal  · #292524 · a serene ancient monk with floating memory-script halos
Cipher Sphinx     · cipher_sphinx   · universal  · #78350F · a riddle-weaving sphinx guarding secrets, golden glyphs in the sand
```

---

## 7. Epic (4) и Legendary (4) — крупные, максимум деталей

**Epic — фиолетовое потустороннее сияние:**
```
Ancient Librarian · ancient_librarian · reading    · #1E3A5F · an immortal robed scholar surrounded by floating endless tomes, glowing glasses
Echo Titan        · echo_titan        · listening  · #1E3A8A · a colossal giant formed from crystallized sound energy and music notation
Lexicon Phoenix   · lexicon_phoenix   · vocabulary · #7C2D12 · a phoenix reborn from burning dictionaries, embers shaped like letters
Syntax Overlord   · syntax_overlord   · grammar    · #1F2937 · a dark towering ruler of language law, cloak of living sentences
The Polyglot      · the_polyglot      · universal  · #312E81 · a wandering hooded figure speaking every tongue, multilingual sigils orbiting
```

**Legendary — золотое божественное сияние, эпичная композиция:**
```
IELTS Sovereign   · ielts_sovereign  · universal · #78350F · an immortal golden master of English, crown of glowing Band-9 sigils, regal
The Examiner      · the_examiner     · universal · #1F2937 · an ancient god-like judge of all examinations, scales of light and a verdict seal
Eternal Scholar   · eternal_scholar  · universal · #1E3A5F · a timeless being radiating ten-thousand-year wisdom, constellations of knowledge
```
(Kage и Raiden — тоже legendary, см. раздел 4.)

---

## 8. Советы для цельного набора (из taste-skill)

- Генерируй **в одной сессии / одним seed-семейством** и фиксируй стиль-референс
  (MJ: `--sref <id>`), чтобы 32 существа были как один сет, а не разнобой.
- Один источник света, один уровень детализации, одна толщина «обводки».
- Редкость = насыщенность ауры, **не** смена стиля. Common приглушённые, legendary яркие.
- Без текста и подписей на самой картинке — рамку/имя/редкость рисует уже UI.
- Держи читаемый силуэт: для игрового спрайта это важнее мелких деталей.
```
```
