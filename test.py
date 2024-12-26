import json
from PIL import Image
import os

# Ursprungspfad und Zielordner
input_image = "icon-512x512.png"
output_folder = "./images/icons/"

# Sicherstellen, dass der Zielordner existiert
os.makedirs(output_folder, exist_ok=True)

# Manifest-Datei laden
manifest_file = "manifest.json"
try:
    with open(manifest_file, 'r') as f:
        manifest = json.load(f)
except FileNotFoundError:
    print(f"Manifest-Datei '{manifest_file}' nicht gefunden!")
    exit(1)

# Ursprungssymbol laden
try:
    img = Image.open(input_image)
except FileNotFoundError:
    print(f"Bilddatei '{input_image}' nicht gefunden!")
    exit(1)

# Für jede Größe das Bild erstellen und speichern
for icon in manifest.get("icons", []):
    sizes = icon.get("sizes")
    if not sizes:
        continue

    width, height = map(int, sizes.split('x'))
    resized_img = img.resize((width, height), Image.ANTIALIAS)  # Bildgröße ändern
    output_path = os.path.join(output_folder, f"icon-{width}x{height}.png")
    resized_img.save(output_path, format="PNG")
    print(f"Gespeichert: {output_path}")

print("Alle Bilder wurden erfolgreich erstellt!")