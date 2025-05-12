from flask import Flask, request, jsonify
from calculos import sumar, restar, multiplicar, dividir, get_history, ErrorCalculo
from usuarios import registrar_usuario, actualizar_saldo, aplicar_descuento_general
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
    
@app.route('/api/usuarios', methods=['POST'])
def api_registrar_usuario():
    data = request.json
    try:
        nombre = data.get('nombre')
        email = data.get('email')
        password = data.get('password')
        saldo = data.get('saldo')
        if not nombre or not email or not password or saldo is None:
            return jsonify({'error': 'Faltan parámetros'}), 400
        from usuarios import registrar_usuario
        nuevo_usuario = registrar_usuario(nombre, email, password, saldo)
        return jsonify(nuevo_usuario), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

    
@app.route('/api/login', methods=['POST'])
def api_login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'error': 'Faltan parámetros'}), 400
    from usuarios import cargar_usuarios, autenticar_usuario
    usuarios = cargar_usuarios()
    usuario = next((u for u in usuarios if u['email'] == email), None)
    if not usuario:
        return jsonify({'error': 'Usuario no encontrado'}), 404
    if not autenticar_usuario(email, password):
        return jsonify({'error': 'Credenciales incorrectas'}), 401
    # Si llega aquí, autenticación exitosa
    usuario_sin_hash = dict(usuario)
    usuario_sin_hash.pop("password_hash")
    return jsonify(usuario_sin_hash), 200


if __name__ == '__main__':
    app.run(debug=True)