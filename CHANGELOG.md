# Changelog

Todos los cambios notables de este proyecto se documentan en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [Unreleased]
### Changed
- Home: agregar emoji de momento del día al saludo (☀️/🌤️/🌙), mismo tratamiento que ya tenía Enganchalo

## [2026-07-26]
### Added
- SEO: agregar robots.txt y sitemap.xml (faltaban)

## [2026-07-24]
### Added
- Home: normalizar spacing título/tagline, box cuadrado, botón, y agregar "tiempo sin jugar"
### Changed
- Datos: corregir Arana->Araña, Montana->Montaña e Iman->Imán en set-emoji-002/003
### Fixed
- Fix: mostrar la card de Bonus en todos los tamaños, no solo mobile
- Fix: la grilla Semanal desbordaba el contenedor en desktop
- Fix: columna central angosta en desktop (480px fijo en vez de 40vw)

## [2026-07-21]
### Changed
- Datos: corregir 5 definiciones de X pegadas en palabras equivocadas
- Datos: corregir set-011 (Crick→Chaplin, Basilisco, y definiciones de X pegadas)

## [2026-07-20]
### Added
- AdSense: agregar ads.txt faltante
### Changed
- Datos: corregir Pina -> Piña en set-emoji-011 (falta la Ñ)
- Datos: corregir 4 definiciones de "tubo" pegadas en palabras equivocadas

## [2026-07-14]
### Changed
- Datos: corregir definición de X en set-009 (era de Saxofón, tenía la de Boxeo)
- Datos: reemplazar Jugular por Jennifer en set-010 (mal escrita, es "yugular" con Y)

## [2026-07-12]
### Added
- Agregar favicon (mismo estilo que Sopalo)

## [2026-07-11]
### Removed
- Teclado: sacar fila de números, borrar rojo integrado, botón azul ahora es Pasapalabra

## [2026-07-09]
### Added
- Botón de jugar: agregar ícono de play y sombra para que resalte más

## [2026-07-08]
### Changed
- Datos: reemplazar Buque repetido en set-009 por Escudo (ya existe en set-007)
- Datos: corregir definición de Buque en set-009 (tenía la definición de Tubo)
- Datos PT: corregir etiqueta sobrenome→apelido/nome en Pelé, Tarsila y Marta

## [2026-07-07]
### Added
- SEO: agregar contenido noscript para crawlers de AdSense
### Changed
- Datos: corregir definiciones cruzadas en set-008 (Yorkshire) y set-009 (Fénix)

## [2026-07-06]
### Added
- Datos: agregar 11 sets emoji para FR y DE (bonus rosco)
- Bonus PT: agregar 11 sets de emoji en portugués y registrarlos
- Bonus EN: agregar 11 sets de emoji en inglés y selección por idioma
- Bonus: agregar rosco emoji con 11 sets y modo de juego completo

## [2026-07-03]
### Changed
- Datos: corregir Gandhi repetido en set-002, reemplazar por Gelatina

## [2026-07-02]
### Changed
- Datos: corregir palabra repetida Reflexion y definición errónea en set-013

## [2026-07-01]
### Changed
- Home: igualar altura de cards de días bloqueados

## [2026-06-30]
### Changed
- Datos EN: corregir Suárez, sigue jugando en Inter Miami
- Datos EN: actualizar jugadores que ya no están en sus clubes
- Datos: actualizar club de Grealish a Everton
### Fixed
- Datos: correcciones de definiciones en EN, FR, PT, DE

## [2026-06-29]
### Added
- Analytics: agregar Google Analytics G-XCT5K2KD5F
- AdSense: agregar script ca-pub-6825837607163963 para enroscado.com
- Roscos EN/PT/FR/DE: mejorar definiciones y agregar nombres a personalidades PT
- Rosco ES: mejorar definiciones cortas y agregar nombres a personalidades
### Changed
- Actualizar dominio a enroscado.com y mail de contacto
- Home: traducir secciones '¿Qué es?' y '¿Cómo jugar?' al idioma activo
- Roscos ES/DE/PT: diversificar palabras muy repetidas
- Roscos EN: diversificar palabras muy repetidas (575 reemplazos)
- Roscos FR: reemplazar Igloo, Iguane e Igname por 36 palabras distintas
- Roscos PT/DE: reemplazar Iglu por 15 palabras distintas
- Estadísticas: separar por idioma

## [2026-06-28]
### Changed
- Netlify: agrega _redirects para SPA routing
- SEO y privacidad: meta tags, política de privacidad y texto descriptivo
- Home: estadísticas acumulativas persistentes entre semanas
### Fixed
- Home: agrega perfil de conocimiento, mejor racha y corrige set-007

## [2026-06-25]
### Changed
- Home: agrega box de Estadísticas globales entre Semanal y Por categoría
- Title
- Game: rediseño de botones y resultados al completar rosco
- Teclado: fade out al ocultar y fade in al mostrar
- Personalidades: nombres propios y reemplazos por actores/directores

## [2026-06-23]
### Changed
- Enrich EN rosco definitions with player first names and teams

## [2026-06-21]
### Changed
- Register EN sets 007-018 in weeklyRoscos registry

## [2026-06-20]
### Added
- Nuevos sets en inglés (007-018) y reemplazos de palabras argentinas
### Changed
- Shuffle FR sets 001-006 to mix categories across roscos
- Mezcla sets PT 001-004 y traduce mensaje de error en juego
- Mezcla palabras entre roscos para evitar sets monotemáticos
- UX: hyphen on word wrap, shorten definitions, reload time button, 3-min timer
- Agrega estado 'Tiempo agotado' en la home para roscos sin tiempo
- Reemplaza referencias Argentina en sets ES, agrega sets DE/FR/PT
### Fixed
- fix: ajuste de posición en header del Layout
- fix: use hypher + hyphenation.es for proper Spanish syllabification
- fix: prefer vowel→consonant syllable breaks (Spanish V-CV rule)
- fix: balance word break point to split closer to the middle
### Removed
- Mezcla sets DE 001-004 para eliminar roscos monotemáticos

## [2026-06-19]
### Changed
- Ciclo de sets automático e infinito basado en fecha base
- Schedule anual completo con los 18 sets rotando
### Fixed
- Nuevos sets de idiomas y correcciones de contenido en sets 001-006
- Optimización de chunks y correcciones de contenido

## [2026-06-18]
### Added
- Nuevos sets PT y DE
### Changed
- Removiendo ayuda
- Sonidos
- Sets en frances

## [2026-06-17]
### Added
- Nuevos sets, logica para reescribir la letra default
### Changed
- Parando el reloj en el back del header
- Translations
- UX, stats por categoría y soporte de sets en inglés
- Rosquitos
- Funcionalidad de error

## [2026-06-16]
### Added
- Nuevos sets y renombrado
### Changed
- Home

## [2026-06-14]
### Changed
- Title
- Datos
- Zindex

## [2026-06-13]
### Changed
- Dinamica de juego
- Juego

## [2026-06-12]
### Changed
- Roscos
- Title
- First commit
- Initial commit
