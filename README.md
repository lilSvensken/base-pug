# Базовый проект PUG (my)

## Парадигма

- **Именование классов по БЭМ**, разметка в pug**
- **Каждый БЭМ-блок в своей папке** внутри `src/blocks/`. Имена файлов в такой папке должны совпадать с именем блока. См. ниже про Блоки.
- **Есть файл конфигурации**, определяющий попадание в сборку дополнительных файлов и неиспользованных в разметке блоков. Смотри `config.js`.
- **Список pug-примесей `src/pug/mixins.pug` генерируется автоматически** и содержит `include` существующих pug-файлов всех блоков.
- **Диспетчер подключения стилей `src/scss/style.scss` генерируется автоматически** и содержит импорты стилевых файлов использованных в разметке блоков и импорты доп. файлов, указанных в `config.js`.
- **Входная точка обработки js (`src/js/entry.js`) генерируется автоматически** и содержит `require` js-файлов использованных в разметке блоков и доп. файлов, указанных в `config.js`.
- **Используется кодгайд** (относительно жёсткий), его проверка делается перед коммитом или вручную (`npm run test`), ошибки выводятся в терминал.
- **Есть механизм быстрого создания нового блока**: `node createBlock.js new-block` (создаёт папки и scss-файл). После имени нового блока можно дописать нужные расширения.

## Команды

```bash
npm start          # запуск сервера разработки (сборка БЕЗ библиотеки блоков)
npm start deploy   # отправка содержимого папки сборки на gh-pages (нужен репозиторий на github.com)
npm run build      # сборка БЕЗ библиотеки блоков и без запуска сервера разработки
npm run wlib       # запуск сервера разработки (сборка проекта с библиотекой блоков)
npm run test       # проверка всех pug-, scss- и js-файлов на соответствие правилам (см. .pug-lintrc, .stylelintrc и eslintrc соответственно)
npm run test:pug   # проверить только pug-файлы
npm run test:style # проверить только scss-файлы
npm run test:js    # проверить только js-файлы
```


## Структура

```bash
build/       # Папка сборки (результат работы над проектом)
src/         # Исходники
  blocks/    # Блоки (подпапки с блоками)
  favicon/   # Фавиконки (копирование прописать в config.js)
  fonts/     # Шрифты (копирование прописать в config.js, подключение в src/blocks/page/page.scss)
  img/       # Общие для всех блоков изображения (копирование прописать в config.js)
  js/        # Общие js-файлы, в т.ч. точка сборки для webpack и общие модули
  pages/     # Страницы проекта (при компиляции: src/pages/index.pug → build/index.html)
  pug/       # Служебные pug-файлы (шаблоны страниц, примеси)
  scss/      # Служебные стилевые файлы (диспетчер подключений, переменные, примеси)
```


## Как это работает

При `npm start` запускается дефолтная задача gulp:

1. Очищается папка сборки (`build/`).
5. Записывается файл `src/pug/mixins.pug` с includ-ами pug-файлов всех блоков.
5. Компилируются файлы страниц (из `src/pages/**/*.pug` в `build/*.html`).
5. Из скомпилированных html-файлов извлекаются все классы уровня БЭМ-блока. На основании этого списка будут построены диспетчер подключения стилей и список всех js-файлов проекта.
5. Генерируются спрайты (если блоки спрайтов используются), в папку сборки копируются картинки блоков и доп. файлы из секции `addAssets` файла `config.js`.
5. Записывается диспетчер подключения стилей `src/scss/style.scss`, в котором:
    - Импорты файлов из секции `addStyleBefore` файла `config.js`. По умолчанию — SCSS-переменные и примеси.
    - Импорты файлов БЭМ-блоков, упомянутых в секции `alwaysAddBlocks` файла `config.js`. Таким образом, можно взять в сборку любой блок, даже если его css-класс не упоминается в разметке страниц.
    - Импорты файлов БЭМ-блоков, использующихся в разметке.
    - Импорты файлов из секции `addStyleAfter` файла `config.js`.
5. Записывается входная точка обработки скриптов `src/js/entry.js`, в которой:
    - `require` файлов из секции `addJsBefore` файла `config.js`.
    - `require` файлов БЭМ-блоков, использующихся в разметке.
    - `require` файлов БЭМ-блоков, упомянутых в секции `alwaysAddBlocks` файла `config.js`.
    - `require` файлов из секции `addJsAfter` файла `config.js`.
5. Компилируется диспетчер подключения стилей (`src/scss/style.scss`). Результат обрабатываются плагинами PostCSS.
6. Обрабатывается входная точка Javascript (`src/js/entry.js`). Используется Webpack.
5. Запускается локальный сервер и слежение за файлами для пересборки.


## Блоки

Каждый блок лежит в `src/blocks/` в своей папке.

Возможное содержимое блока:

```bash
demo-block/        # Папка блока.
  img/             # Изображения, используемые этим блоком (копируются в папку сборки).
  demo-block.pug   # Разметка (pug-примесь, отдающая разметку этого блока, описание API примеси).
  demo-block.scss  # Стилевой файл этого блока (без стилей других блоков).
  demo-block.js    # js-файл блока (без скриптов других блоков).
  readme.md        # Описание для документации, подсказки.
```


### Особенный блок `page`

На теге `<html>` по умолчанию прописан класс `page`, что делает одноимённый блок «глобальным». В стилях этого блока прописываются:

- подключение сторонних шрифтов,
- смена боксовой модели,
- cтили шаблона (см. `src/pug/layout.pug`),
- стилизация тегов по умолчанию (аналог Normalize.CSS).


### Удобное создание нового блока

```bash
# формат: node createBlock.js ИМЯБЛОКА [доп. расширения через пробел]
node createBlock.js demo-block        # создаст папку блока, demo-block.scss, подпапку img/ для этого блока
node createBlock.js demo-block pug js # создаст папку блока, demo-block.scss, demo-block.pug, demo-block.js, подпапку img/ для этого блока
```

Если блок уже существует, файлы не будут затёрты, но создадутся те файлы, которые ещё не существуют.


## Сторонние npm-модули

Если нужно взять в сборку сторонний модуль, то после его установки (к примеру — `npm i package-name`) нужно:

1. Прописать `require` в js-файле проектного блока (там же писать всё, что касается работы с этим модулем). Если сторонний модуль нужен без привязки к какому-либо проектому блоку, прописать `require` в `src/js/script.js` (см. пример в файле).
2. Если нужно брать в сборку стилевые файлы модуля, прописать их в секции `addStyleBefore` файла `config.js` (пример в файле).
3. Если нужно брать в сборку дополнительные файлы модуля, прописать их в `addAssets` файла `config.js` с указанием в какую папку их копировать (пример в файле).


## Разметка

Используется [pug](https://pugjs.org/api/getting-started.html).

Все страницы (см. `src/pages/index.pug`) являются расширениями шаблонов из `src/pug` (см. [наследование шаблонов](https://pugjs.org/language/inheritance.html)), в страницах описывается только содержимое «шапки», «подвала» и контентной области (см. [блоки](https://pugjs.org/language/inheritance.html#block-append-prepend)).

Каждый блок (в `src/blocks/`) может (не обязан) содержать одноимённый pug-файл с одноименной примесью, который при старте сервера разработки будет взят includ-ом в файл `src/pug/mixins.pug`.


## Стили

Диспетчер подключений (`src/scss/style.scss`) формируется автоматически при старте сервера разработки.

Каждый блок (в `src/blocks/`) может содержать одноимённый scss-файл со стилями этого блока. Если блок используется в разметке (или упомянут в `config.js#alwaysAddBlocks`), его scss-файл будет взят в сборку стилей.

Используемый постпроцессинг:

1. [autoprefixer](https://github.com/postcss/autoprefixer)
2. [css-mqpacker](https://github.com/hail2u/node-css-mqpacker)
3. [postcss-import](https://github.com/postcss/postcss-import)
4. [postcss-inline-svg](https://github.com/TrySound/postcss-inline-svg)

### Стилевой код-гайд

Автопроверка с [stylelint](https://stylelint.io/) и плагинами. См. `.stylelintrc`.

1. БЭМ-именование: `__` — разделитель элемента, `--` — разделитель модификатора.
2. Один Блок = один стилевой файл.
3. Очередность селекторов:
    - Инклуды примесей
    - Стилевые правила сущности
    - Медиаусловия
    - Псевдоселекторы и псевдоэлементы
    - Сторонние вложенные селекторы
    - Элементы блока
    - Модификаторы блока


## Скрипты

Точка входа (`src/js/entry.js`) формируется автоматически при старте сервера разработки. Точка входа обрабатывается webpack-ом (с babel-loader).

Для глобальных действий предусмотрен `src/js/script.js` (см. `config.js#addJsAfter` и `config.js#addJsBefore`).

Каждый блок (в `src/blocks/`) может (не обязан) содержать одноимённый js-файл. Если блок используется в разметке (или упомянут в `config.js#alwaysAddBlocks`), его js-файл будет взят в сборку стилей.

### Инлайн-скрипт

По умолчанию в шаблоне (`src/pug/layout.pug`) прописана вставка в `<head>` скрипта `src/js/head-script.js`, в котором для узла `<html>` указано:

- Убрать класс `no-js` и добавить класс `js`.
- Добавить класс с указанием названия браузера и ОС.
- Добавить класс `touch` или `no-touch`, в зависимости от типа интерфейса.
- Добавить кастомное свойство `--vh` со значением в 1% высоты вьюпорта (значение пересчитывается при изменении размеров).
