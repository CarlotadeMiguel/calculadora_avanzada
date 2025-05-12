from flask import Flask, request, jsonify
from calculos import sumar, restar, multiplicar, dividir, get_history, ErrorCalculo
from flask_cors import CORS

app = Flask(__name__)
app.config['DEBUG'] = True
CORS(app)  # Permitir solicitudes desde el frontend


# Ruta de prueba para verificar que el servidor funciona  
@app.route('/health', methods=['GET'])  
def health_check():  
    return jsonify({"status": "ok", "message": "Servidor activo"}), 200  

@app.route('/api/calcular', methods=['POST'])
def api_calcular():
    data = request.json
    try:
        operacion = data.get('operacion')
        a = data.get('a')
        b = data.get('b')

        if operacion not in ['sumar', 'restar', 'multiplicar', 'dividir']:
            return jsonify({'error': 'Operación no válida'}), 400

        if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
            return jsonify({'error': 'Los parámetros deben ser números'}), 400

        if operacion == 'sumar':
            result = sumar(a, b)
        elif operacion == 'restar':
            result = restar(a, b)
        elif operacion == 'multiplicar':
            result = multiplicar(a, b)
        elif operacion == 'dividir':
            result = dividir(a, b)

        return jsonify({'resultado': result}), 200
    except ErrorCalculo as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@app.route('/api/historial', methods=['GET'])
def api_historial():
    try:
        historial = get_history()
        return jsonify(historial), 200
    except Exception as e:
        return jsonify({'error': 'No se pudo obtener el historial'}), 500

if __name__ == '__main__':
    app.run(debug=True)