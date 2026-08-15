from PIL import Image

img = Image.open(r"C:\Users\DELL\.gemini\antigravity\scratch\heritage-quest\assets\bg.jpg").convert("RGB")
width, height = img.size

center_x = 508
for y in range(0, height, 15):
    r, g, b = img.getpixel((center_x, y))
    print(f"y={y:3d}: ({r:3d}, {g:3d}, {b:3d})")
