import json
import os
from datetime import datetime
from threading import Lock
from uuid import uuid4  # Nuevo: Generar UUIDs

class ErrorCalculo(Exception):
    pass

history_file = os.path.join(os.path.dirname(__file__), 'utils', 'history.json')
lock = Lock()

def log_operation(operation, params, result):
    log_entry = {
        "id": str(uuid4()),  # UUID único
        "timestamp": datetime.now().isoformat(),
        "operation": operation,
        "parameters": params,
        "result": result
    }
    with lock:
        with open(history_file, 'a') as f:
            json.dump(log_entry, f)
            f.write('\n')

def get_history():
    if not os.path.exists(history_file):
        return []
    with open(history_file, 'r') as f:
        return [json.loads(line) for line in f]

def sumar(a, b):
    result = a + b
    log_operation("sumar", {"a": a, "b": b}, result)
    return result

def restar(a, b):
    result = a - b
    log_operation("restar", {"a": a, "b": b}, result)
    return result

def multiplicar(a, b):
    result = a * b
    log_operation("multiplicar", {"a": a, "b": b}, result)
    return result

def dividir(a, b):
    if b == 0:
        raise ErrorCalculo("No se puede dividir entre cero.")
    result = a / b
    log_operation("dividir", {"a": a, "b": b}, result)
    return result