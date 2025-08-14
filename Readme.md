# Adoptme Backend:
## Technologies: Node.js + Express + MongoDb + Handlebars + Mocha + Chai + SuperTest + Docker + Kubernetes

# Project:
- Este fue mi Proyecto Final Backend lll: Testing y Escalabilidad Backend.

- Características Implementadas:
- Logging: Se utilizó Winston para la creación y gestión de logs de la aplicación.
- Manejo de Errores: Se implementó un manejador de errores centralizado con respuestas personalizadas.
- Documentación: La API fue documentada utilizando Swagger para facilitar su consumo y entendimiento.
- Testing: Se realizaron pruebas unitarias y de integración con Mocha, Chai y SuperTest. Para la simulación de datos, se utilizó la biblioteca Faker.js.

- Escalabilidad y Rendimiento:
- Se utilizó el módulo Cluster de Node.js para crear múltiples procesos y aprovechar al máximo los recursos del servidor.
- El proyecto fue containerizado con Docker y orquestado con Kubernetes para asegurar la escalabilidad y alta disponibilidad.
- Se realizaron pruebas de carga con Artillery para simular tráfico y analizar el rendimiento bajo estrés.

# Instructions:
- Crear base de datos en MongoDB.
- Cambiar variables de entorno de: Puerto, MongoDb, Node_Mode.

# Scripts:
- Script: "Npm i" para instalar dependencias.
- Script: "Npm start" para ejecutar.

# Documentation:
- https://adoptme-app-kaok.onrender.com/apidocs/

# Link:
- https://adoptme-app-kaok.onrender.com