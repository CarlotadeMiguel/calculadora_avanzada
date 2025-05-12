import re
import json
import os
from threading import Lock
from uuid import uuid4  # Nuevo: Generar UUIDs
from werkzeug.security import generate_password_hash, check_password_hash

usuarios_file = os.path.join(os.path.dirname(__file__), 'utils', 'usuarios.json')
lock = Lock()

def registrar_usuario(nombre, email, password, saldo):
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise ValueError("Formato de email incorrecto")
    
    usuarios = cargar_usuarios()
    
    if list(filter(lambda u: u['email'] == email, usuarios)):
        raise ValueError("El email ya está registrado")
    
    if not password or len(password) < 6:
        raise ValueError("Contraseña demasiado corta")
   
    password_hash = generate_password_hash(password)
    
    nuevo_usuario = {
        "id": str(uuid4()),  # UUID único
        "nombre": nombre,
        "email": email,
        "password_hash": password_hash,
        "saldo": saldo
    }
    
    usuarios.append(nuevo_usuario)
    guardar_usuarios(usuarios)

    usuario_sin_hash = nuevo_usuario.copy()
    usuario_sin_hash.pop("password_hash")
    return usuario_sin_hash

def actualizar_saldo(usuario_id, nuevo_saldo):
    usuarios = cargar_usuarios()
    
    actualizados = list(map(
        lambda u: {**u, "saldo": nuevo_saldo} if u["id"] == usuario_id else u,
        usuarios
    ))
    
    if actualizados == usuarios:
        raise ValueError("Usuario no encontrado")
    
    guardar_usuarios(actualizados)
    return next(u for u in actualizados if u["id"] == usuario_id)

def aplicar_descuento_general(porcentaje):
    usuarios = cargar_usuarios()
    
    con_descuento = list(map(
        lambda u: {**u, "saldo": u["saldo"] * (1 - porcentaje/100)},
        usuarios
    ))
    
    guardar_usuarios(con_descuento)

def cargar_usuarios():
    if not os.path.exists(usuarios_file):
        return []
    
    with lock:
        with open(usuarios_file, 'r') as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []

def guardar_usuarios(usuarios):
    with lock:
        with open(usuarios_file, 'w') as f:
            json.dump(usuarios, f, indent=2)

def autenticar_usuario(email, password):
    usuarios = cargar_usuarios()
    usuario = next((u for u in usuarios if u['email'] == email), None)
    
    if usuario and check_password_hash(usuario['password_hash'], password):
        usuario_sin_hash = usuario.copy()
        usuario_sin_hash.pop("password_hash")
        return usuario_sin_hash
    return None
