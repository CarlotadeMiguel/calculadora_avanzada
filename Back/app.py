from flask import Flask, request, jsonify
from calculos import sumar, restar, multiplicar, dividir, get_history, ErrorCalculo
from usuarios import registrar_usuario, autenticar_usuario, cargar_usuarios, actualizar_saldo, aplicar_descuento_general
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
        usuario_id = data.get('user')  # Asegúrate de que el frontend lo envía

        if operacion not in ['sumar', 'restar', 'multiplicar', 'dividir']:
            return jsonify({'error': 'Operación no válida'}), 400

        if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
            return jsonify({'error': 'Los parámetros deben ser números'}), 400

        # Verificar saldo del usuario
        if not usuario_id:
            return jsonify({'error': 'Falta usuario_id'}), 400

        usuarios = cargar_usuarios()
        usuario = next((u for u in usuarios if u['id'] == usuario_id), None)
        if not usuario:
            return jsonify({'error': 'Usuario no encontrado'}), 404

        if usuario['saldo'] <= 0:
            return jsonify({'error': 'Saldo insuficiente'}), 403

        # Realizar el cálculo
        if operacion == 'sumar':
            result = sumar(a, b)
        elif operacion == 'restar':
            result = restar(a, b)
        elif operacion == 'multiplicar':
            result = multiplicar(a, b)
        elif operacion == 'dividir':
            result = dividir(a, b)

        # Descontar saldo
        nuevo_saldo = usuario['saldo'] - 1
        usuario_actualizado = actualizar_saldo(usuario_id, nuevo_saldo)

        return jsonify({'resultado': result, 'user': usuario_actualizado}), 200

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

@app.route('/api/usuarios/<usuario_id>/saldo', methods=['PUT'])
def api_actualizar_saldo(usuario_id):
    data = request.json
    try:
        nuevo_saldo = data.get('saldo')

        usuario_actualizado = actualizar_saldo(usuario_id, nuevo_saldo)
        return jsonify(usuario_actualizado), 200
    except ValueError as e:
        return jsonify({'error': str(e)}), 404
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500

@app.route('/api/usuarios/descuento', methods=['POST'])
def api_aplicar_descuento():
    data = request.json
    try:
        porcentaje = data.get('porcentaje')

        aplicar_descuento_general(porcentaje)
        return jsonify({"status": "Descuento aplicado"}), 200
    except Exception as e:
        return jsonify({'error': 'Error interno del servidor'}), 500


if __name__ == '__main__':
    app.run(debug=True)