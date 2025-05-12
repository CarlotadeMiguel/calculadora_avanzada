
import re
import json
import os
from threading import Lock

usuarios_file = os.path.join(os.path.dirname(__file__), 'utils', 'usuarios.json')
lock = Lock()

def registrar_usuario(nombre, email, saldo):
    if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
        raise ValueError("Email no válido")
    usuarios = cargar_usuarios()
    if any(usuario['email'] == email for usuario in usuarios):
        raise ValueError("El email ya está registrado")
    nuevo_usuario = {
        "id": len(usuarios) + 1,
        "nombre": nombre,
        "email": email,
        "saldo": saldo
    }
    usuarios.append(nuevo_usuario)
    guardar_usuarios(usuarios)
    return nuevo_usuario


def actualizar_saldo(usuario_id, nuevo_saldo):
    usuarios = cargar_usuarios()
    
    for usuario in usuarios:
        if usuario['id'] == usuario_id:
            usuario['saldo'] = nuevo_saldo
            guardar_usuarios(usuarios)
            return usuario
    
    raise ValueError("Usuario no encontrado")

def aplicar_descuento_general(porcentaje):
    usuarios = cargar_usuarios()
    
    for usuario in usuarios:
        usuario['saldo'] -= usuario['saldo'] * (porcentaje / 100)
    
    guardar_usuarios(usuarios)

def cargar_usuarios():
    if not os.path.exists(usuarios_file):
        return []
    with open(usuarios_file, 'r') as f:
        try:
            return json.load(f)
        except json.JSONDecodeError:
            return []

def guardar_usuarios(usuarios):
    with lock:
        with open(usuarios_file, 'w') as f:
            json.dump(usuarios, f, indent=2)