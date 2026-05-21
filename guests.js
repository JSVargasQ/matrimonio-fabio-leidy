/*
 * guests.js — Lista oficial de invitados
 * Fabio & Leidy · 2 Noviembre 2026
 *
 * Instrucciones:
 *   1. Agrega cada grupo familiar con un código único (sin tildes, sin espacios)
 *   2. "family"  → nombre que aparece en el saludo  "¡Hola, Familia Pérez!"
 *   3. "guests"  → nombres completos de TODOS los invitados del grupo
 *   4. Envía a cada familia su URL con el código:
 *        https://tu-dominio.com/?code=FAM01
 *
 * El sitio mostrará automáticamente:
 *   "Invitación válida para: Juan Pérez, María Pérez…"
 * ─────────────────────────────────────────────────────
 */

const GUEST_LIST = {

  /* ══════════════════════════════════════════
     CÓDIGO DE PRUEBA  (eliminar antes de lanzar)
     ══════════════════════════════════════════ */
  'FAM01': {
    family: 'Familia García',
    guests: [
      'Carlos García',
      'María García',
      'Ana García',
      'Luis García',
    ],
  },


  /* ══════════════════════════════════════════
     FAMILIA
     ══════════════════════════════════════════ */

  'FAM02': {
    family: 'Familia Rodríguez',
    guests: [
      'Pedro Rodríguez',
      'Laura Rodríguez',
      'Sofía Rodríguez',
    ],
  },

  'FAM03': {
    family: 'Familia López',
    guests: [
      'Andrés López',
      'Claudia López',
      'Valentina López',
      'Mateo López',
      'Isabela López',
    ],
  },


  /* ══════════════════════════════════════════
     AMIGOS
     ══════════════════════════════════════════ */

  'AMG01': {
    family: 'Camila',
    guests: [
      'Camila Martínez',
      'Acompañante de Camila',
    ],
  },

  'AMG02': {
    family: 'Sebastián',
    guests: [
      'Sebastián Torres',
    ],
  },

  'AMG03': {
    family: 'Valentina',
    guests: [
      'Valentina Gómez',
      'Acompañante de Valentina',
    ],
  },

  'AMG04': {
    family: 'Carlos y Mónica',
    guests: [
      'Carlos Herrera',
      'Mónica Herrera',
    ],
  },

  'AMG05': {
    family: 'Laura',
    guests: [
      'Laura Sánchez',
    ],
  },

};
