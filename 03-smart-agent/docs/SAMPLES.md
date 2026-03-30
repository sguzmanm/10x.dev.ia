# Samples Preguardrails

## Colombia vs France

### Input

```
"1. Quién gana hoy? Colombia o Francia?\n2. Quién es el mayor goleador?"
```

### Output

```json
{
  "questions": [
    {
      "questionId": "q_001",
      "question": "Should we support Colombia to win today's match against France?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "This question helps gauge the team's sentiment and support for Colombia, which can influence morale and engagement during the match."
    },
    {
      "questionId": "q_002",
      "question": "Do you believe Colombia will win today's match against France?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "This question assesses the team's confidence in Colombia's chances, which can guide discussions on strategies or support."
    },
    {
      "questionId": "q_003",
      "question": "Should we celebrate if Colombia wins today?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "This question determines if the team is aligned on celebrating a potential victory, fostering a sense of unity and excitement."
    },
    {
      "questionId": "q_004",
      "question": "Should we recognize the top scorer of the match after it concludes?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "This question helps decide if the team values acknowledging individual achievements, which can enhance motivation."
    },
    {
      "questionId": "q_005",
      "question": "Is it important to track who the highest scorer is during the match?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "This question assesses the team's interest in individual performance metrics, which can inform future strategies."
    },
    {
      "questionId": "q_006",
      "question": "Should we discuss the implications of the highest scorer on the team's overall performance?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "This question encourages a discussion on how individual scoring impacts team dynamics and strategy."
    }
  ],
  "totalQuestions": 6,
  "generatedAt": "2026-03-29T19:20:10.887Z"
}
```

## Sprint Planning

### Input

```
echo "1. Crear un nuevo lambda para ejecutar videollamadas por telegram, no se tiene conocimiento del posible trigger de AWS que le llegue y que sea más adecuado\n2. Crear una infraestructura de TF para desplegar el nuevo lambda, el equipo se debate entre crear modelos custom o implementar cada archivo a mano\n3. Validar con clientes el front, diseño aun no tiene el front creado." | npm start
```

### Output

```json
{
  "questions": [
    {
      "questionId": "q_001",
      "question": "¿Deberíamos investigar los triggers de AWS disponibles para el nuevo lambda de videollamadas por Telegram antes de proceder?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "Investigar los triggers de AWS ayudará a determinar la mejor opción para la implementación del lambda, asegurando que se elija la solución más adecuada."
    },
    {
      "questionId": "q_002",
      "question": "¿Es necesario realizar una reunión adicional para discutir las opciones de triggers de AWS antes de crear el nuevo lambda?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "Una reunión adicional podría proporcionar claridad y asegurar que todos los miembros del equipo estén alineados en la elección del trigger."
    },
    {
      "questionId": "q_003",
      "question": "¿Deberíamos considerar la posibilidad de utilizar un trigger de AWS que ya esté en uso en otros proyectos similares?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "Utilizar un trigger ya probado en otros proyectos puede reducir riesgos y acelerar el proceso de implementación."
    },
    {
      "questionId": "q_004",
      "question": "¿Deberíamos optar por crear modelos custom para la infraestructura de TF en lugar de implementar cada archivo a mano?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "Crear modelos custom puede facilitar la gestión y escalabilidad de la infraestructura, lo que podría ser más eficiente a largo plazo."
    },
    {
      "questionId": "q_005",
      "question": "¿Es necesario realizar una evaluación de pros y contras entre modelos custom y la implementación manual antes de tomar una decisión?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "Evaluar las ventajas y desventajas de cada enfoque permitirá al equipo tomar una decisión informada y alineada con los objetivos del proyecto."
    },
    {
      "questionId": "q_006",
      "question": "¿Deberíamos establecer un plazo para decidir entre modelos custom y la implementación manual?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "Establecer un plazo puede ayudar a mantener el proyecto en marcha y evitar retrasos innecesarios en la implementación."
    },
    {
      "questionId": "q_007",
      "question": "¿Deberíamos validar el diseño del front con los clientes antes de proceder con su desarrollo?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "Validar el diseño con los clientes asegurará que se cumplan sus expectativas y necesidades, lo que puede mejorar la satisfacción del cliente."
    },
    {
      "questionId": "q_008",
      "question": "¿Es necesario realizar una revisión del diseño actual del front antes de presentarlo a los clientes?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "Revisar el diseño actual puede ayudar a identificar áreas de mejora y asegurar que se presente un producto de calidad a los clientes."
    },
    {
      "questionId": "q_009",
      "question": "¿Deberíamos considerar la retroalimentación de los clientes en el diseño del front como un factor clave para su desarrollo?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "Incorporar la retroalimentación de los clientes es fundamental para crear un producto que realmente satisfaga sus necesidades y expectativas."
    }
  ],
  "totalQuestions": 9,
  "generatedAt": "2026-03-29T19:26:26.812Z"
}
```

## Jedi Council

### Input

```
echo "4. El Misterio del Ejército Clon y Sifo-Dyas: Debatir el origen de los clones de Kamino y por qué el Maestro Sifo-Dyas encargó este ejército en secreto hace una década.\n5. La Advertencia de Dooku sobre Darth Sidious: Analizar la afirmación que Dooku le hizo a Obi-Wan Kenobi: que un Lord Sith llamado Darth Sidious controla el Senado Galáctico.\n6. La Redefinición del Rol Jedi: Guardianes vs. Generales: Votar y reflexionar sobre la asunción de los títulos de \"Generales\" y \"Comandantes\" por parte de los Jedi.\n7. El Oscurecimiento de la Fuerza: La incapacidad del Consejo para prever la creación del ejército clon, la traición de Dooku y el inicio de la guerra." | npm start

```

### Output

```json
{
  "questions": [
    {
      "questionId": "q_001",
      "question": "¿Crees que el origen de los clones de Kamino debe ser debatido en profundidad durante la sesión?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "Este debate puede ayudar a entender mejor el contexto y las motivaciones detrás de la creación del ejército clon."
    },
    {
      "questionId": "q_002",
      "question": "¿Consideras que la decisión de Sifo-Dyas de encargar el ejército en secreto es relevante para la historia actual?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "Entender la relevancia de esta decisión puede influir en cómo se perciben las acciones de los Jedi y los Sith."
    },
    {
      "questionId": "q_003",
      "question": "¿Deberíamos explorar las implicaciones éticas de la creación de un ejército clon en esta discusión?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "Las implicaciones éticas son cruciales para comprender el impacto de esta decisión en la galaxia."
    },
    {
      "questionId": "q_004",
      "question": "¿Crees que la afirmación de Dooku sobre Darth Sidious debe ser considerada seriamente por los Jedi?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "Evaluar esta afirmación puede ayudar a los Jedi a entender mejor las amenazas que enfrentan."
    },
    {
      "questionId": "q_005",
      "question": "¿Deberíamos investigar más sobre la relación entre Dooku y Darth Sidious en esta sesión?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "Explorar esta relación puede proporcionar información valiosa sobre la manipulación en el Senado."
    },
    {
      "questionId": "q_006",
      "question": "¿Es importante que los Jedi tomen en cuenta las advertencias de Dooku sobre el control del Senado por parte de un Sith?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "Tomar en cuenta estas advertencias puede ser crucial para la estrategia de los Jedi en la guerra."
    },
    {
      "questionId": "q_007",
      "question": "¿Deberían los Jedi mantener sus títulos tradicionales en lugar de asumir roles militares como 'Generales'?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "Esta decisión puede afectar la percepción pública de los Jedi y su misión."
    },
    {
      "questionId": "q_008",
      "question": "¿Es necesario discutir las consecuencias de que los Jedi se conviertan en 'Comandantes' en la guerra?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "Entender las consecuencias puede ayudar a los Jedi a tomar decisiones más informadas."
    },
    {
      "questionId": "q_009",
      "question": "¿Crees que la redefinición del rol Jedi impactará su relación con la Fuerza?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "Explorar este impacto puede ser fundamental para el futuro de los Jedi."
    },
    {
      "questionId": "q_010",
      "question": "¿Deberíamos analizar por qué el Consejo Jedi no pudo prever la creación del ejército clon?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "Entender esta falla puede ayudar a los Jedi a mejorar su capacidad de previsión en el futuro."
    },
    {
      "questionId": "q_011",
      "question": "¿Es relevante discutir la traición de Dooku en el contexto del oscurecimiento de la Fuerza?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "La traición de Dooku es un evento clave que puede ilustrar las fallas del Consejo Jedi."
    },
    {
      "questionId": "q_012",
      "question": "¿Crees que la incapacidad del Consejo para prever la guerra afecta su credibilidad ante la galaxia?",
      "options": [
        {
          "id": "opt_0",
          "label": "Yes"
        },
        {
          "id": "opt_1",
          "label": "No"
        }
      ],
      "reasoning": "La credibilidad del Consejo es fundamental para su autoridad y liderazgo en tiempos de crisis."
    }
  ],
  "totalQuestions": 12,
  "generatedAt": "2026-03-29T19:29:14.068Z"
}
```
