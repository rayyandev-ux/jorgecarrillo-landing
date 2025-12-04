import type { Step } from '../types';

export const SCRIPT: Step[] = [
  {
    id: 'intro',
    messages: [
      "Hola. Soy Jorge Carrillo. 👋",
      "Misión Cuerpos Increíbles (MCI) es una asesoría exclusiva conmigo donde tendrás:",
      "✅ Dieta realista y práctica.\n✅ Entrenamiento que se adapta a tu rutina.\n✅ Protocolos ajustados.\n✅ Análisis de exámenes médicos.\n✅ Contacto directo con mi cerebro.\n✅ Soporte de preparador físico, nutricionista y médico asociado.\n✅ Acompañamiento completo.",
      "En solo 3 pasos rápidos entenderé tu objetivo. Responde estas breves preguntas y veré si tiene sentido que comencemos."
    ],
    type: 'options',
    options: [
      { label: "Comenzar mi transformación hoy 🚀", value: "start" }
    ],
    field: 'start'
  },
  {
    id: 'goal',
    messages: [
      "¡Genial! Vamos con la Fase 1: El Diagnóstico.",
      "1. ¿Cuál es tu objetivo principal HOY?"
    ],
    type: 'options',
    options: [
      { label: "Adelgazar y alcanzar un peso saludable (Ligereza y confianza)", value: "adelgazar" },
      { label: "Definir el cuerpo y ganar masa muscular (Apariencia y fuerza)", value: "definir" },
      { label: "Iniciarme en el físico culturismo (Físico competitivo)", value: "culturismo" },
      { label: "Ya soy atleta, quiero el siguiente nivel (Alto rendimiento)", value: "atleta" }
    ],
    field: 'objetivo'
  },
  {
    id: 'obstacle',
    messages: [
      "Entendido. 🤔",
      "2. ¿Qué es lo que más te ha impedido lograr ese físico hasta ahora?"
    ],
    type: 'options',
    options: [
      { label: "Falta de tiempo / Trabajo mucho", value: "tiempo" },
      { label: "La alimentación / Ansiedad por comer", value: "alimentacion" },
      { label: "Falta de constancia / Empiezo y lo dejo", value: "constancia" },
      { label: "No sé cómo entrenar correctamente", value: "conocimiento" }
    ],
    field: 'obstaculo'
  },
  {
    id: 'availability',
    messages: [
      "3. Para lograr este cambio, ¿cuánto tiempo puedes dedicar a entrenar por semana?"
    ],
    type: 'options',
    options: [
      { label: "3 a 4 veces por semana", value: "3-4" },
      { label: "4 a 6 veces por semana", value: "4-6" },
      { label: "Muy poco tiempo, necesito algo express", value: "poco" }
    ],
    field: 'disponibilidad'
  },
  {
    id: 'budget',
    messages: [
      "4. ¿Cuál es tu presupuesto mensual aproximado para invertir en ti y en un profesional?"
    ],
    type: 'options',
    options: [
      { label: "Entre $50 y $100 USD", value: "low" },
      { label: "Entre $100 y $200 USD", value: "medium" },
      { label: "Más de $200 USD", value: "high" }
    ],
    field: 'presupuesto'
  },
  {
    id: 'name',
    messages: [
      "Perfecto. Ya casi terminamos.",
      "¿Cuál es tu nombre completo?"
    ],
    type: 'text',
    inputPlaceholder: "Escribe tu nombre aquí...",
    field: 'nombre'
  },
  {
    id: 'phone',
    messages: [
      "Un gusto.",
      "¿Cuál es tu número de teléfono (WhatsApp) para contactarte?"
    ],
    type: 'tel',
    inputPlaceholder: "+51 999 999 999",
    field: 'telefono'
  },
  {
    id: 'instagram',
    messages: [
      "Por último, ¿cuál es tu usuario de Instagram?"
    ],
    type: 'text',
    inputPlaceholder: "@tu_usuario",
    field: 'instagram'
  },
  {
    id: 'final',
    messages: [
      "¡Gracias! Hemos recibido tu información.",
      "Nos pondremos en contacto contigo pronto. Estate atento(a). 💪"
    ],
    type: 'end'
  }
];
