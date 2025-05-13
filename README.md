# Calculadora Avanzada

Calculadora Avanzada es una aplicación web que permite a los usuarios realizar operaciones matemáticas, gestionar su saldo virtual y poner a prueba sus conocimientos de lógica para aumentarlo. El proyecto está dividido en dos partes: un backend en Python (Flask) y un frontend en React.

## Características

- **Operaciones matemáticas**: Suma, resta, multiplicación y división.
- **Gestión de usuarios**: Registro, inicio de sesión y autenticación.
- **Saldo virtual**: Cada operación descuenta saldo; puedes aumentarlo resolviendo preguntas de lógica.
- **Historial de operaciones**: Consulta y filtra tus operaciones realizadas.
- **Frontend moderno**: Interfaz intuitiva con React y Tailwind CSS.
- **Backend robusto**: API RESTful construida con Python y Flask.

## Estructura del repositorio
```
calculadora_avanzada/
│
├── Front/
│   ├── src/
│   │   ├── components/    # Componentes React
│   │   └── data/          # Archivos de datos (ej: preguntas.json)
│   ├── public/
│   └── package.json
│
├── back/                  # Backend Python (Flask)
│   ├── app.py
│   ├── calculos.py
│   ├── usuarios.py
│   └── utils/
│       ├── usuarios.json
│       └── history.json
│
└── README.md

```
## Tecnologías utilizadas

- **Frontend**: React 19, React Router DOM 7, Axios, Tailwind CSS, Vite
- **Backend**: Python 3, Flask, Flask-CORS, Werkzeug, JSON para persistencia de datos

## Instalación y ejecución

### 2. Clona el repositorio

```bash
git clone https://github.com/CarlotadeMiguel/calculadora_avanzada.git
cd calculadora_avanzada
```
### 2. Configura y ejecuta el backend
```bash
cd back
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate
pip install flask flask-cors werkzeug
python app.py
El backend se ejecuta por defecto en http://localhost:5000.
``` 

### 3. Configura y ejecuta el frontend
```bash
cd ../Front
npm install
npm run dev
El frontend se ejecuta por defecto en http://localhost:5173.
```
## Uso
### 1. Registro y login
- **Regístrate** con tus datos y saldo inicial.

- **Inicia sesión** para acceder a la calculadora.

### 2. Realización de operaciones
Realiza operaciones matemáticas (cada una descuenta saldo).

### 3. Aumenta tu saldo
Responde preguntas de lógica para aumentar tu saldo.

### 4. Historial de operaciones
Consulta el historial de operaciones y filtra por tipo.

## Personalización
- **Preguntas de lógica**: Edita el archivo Front/src/data/preguntas.json para agregar o modificar preguntas.

- **Componentes**: El frontend está modularizado en Front/src/components/.

## Contribución
¡Las contribuciones son bienvenidas! Abre un issue o un pull request para sugerir mejoras o reportar errores.

## Licencia
Este proyecto está bajo la licencia MIT.