from PIL import Image
import os

# Ursprungspfad und Zielordner
input_image = "android-icon-512x512.png"
output_folder = "./src/"

# Sicherstellen, dass der Zielordner existiert
os.makedirs(output_folder, exist_ok=True)

# Zielgrößen und Dateinamen
sizes = {
    "favicon-16x16.png": (16, 16),
    "favicon-32x32.png": (32, 32),
    "favicon-48x48.png": (48, 48),
    "apple-icon-57x57.png": (57, 57),
    "apple-icon-60x60.png": (60, 60),
    "apple-icon-72x72.png": (72, 72),
    "apple-icon-76x76.png": (76, 76),
    "apple-icon-114x114.png": (114, 114),
    "apple-icon-120x120.png": (120, 120),
    "apple-icon-144x144.png": (144, 144),
    "apple-icon-152x152.png": (152, 152),
    "apple-icon-180x180.png": (180, 180),
    "android-icon-192x192.png": (192, 192),
    "android-icon-512x512.png": (512, 512),  # Bleibt gleich
}

# Ursprungssymbol laden
try:
    img = Image.open(input_image)
except FileNotFoundError:
    print(f"Bilddatei '{input_image}' nicht gefunden!")
    exit(1)

# Für jede Größe das Bild erstellen und speichern
for filename, size in sizes.items():
    resized_img = img.resize(size, Image.ANTIALIAS)  # Bildgröße ändern
    output_path = os.path.join(output_folder, filename)
    resized_img.save(output_path, format="PNG")
    print(f"Gespeichert: {output_path}")

print("Alle Bilder wurden erfolgreich erstellt!")
