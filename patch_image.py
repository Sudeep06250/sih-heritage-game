import os
from PIL import Image

def patch_background_interpolation():
    src_path = r"C:\Users\DELL\.gemini\antigravity\brain\bcf70468-0c51-44cc-80e2-7d6ac63ed52a\media__1786541538018.jpg"
    dest_path = r"C:\Users\DELL\.gemini\antigravity\scratch\heritage-quest\assets\bg.jpg"
    
    if not os.path.exists(src_path):
        print(f"Error: Source image not found")
        return
        
    img = Image.open(src_path).convert("RGB")
    pixels = img.load()
    
    def interpolate_horizontal(x_start, x_end, y_start, y_end):
        for y in range(y_start, y_end):
            color_start = pixels[x_start, y]
            color_end = pixels[x_end, y]
            for x in range(x_start + 1, x_end):
                t = (x - x_start) / (x_end - x_start)
                r = int(color_start[0] * (1 - t) + color_end[0] * t)
                g = int(color_start[1] * (1 - t) + color_end[1] * t)
                b = int(color_start[2] * (1 - t) + color_end[2] * t)
                pixels[x, y] = (r, g, b)

    # 1. Interpolate top title region (HERITAGE QUEST + Sub-banner)
    # The gold border elements are on the sides, so we interpolate from x=365 to x=660
    # to avoid touching the gold borders.
    interpolate_horizontal(365, 660, 75, 190)
    
    # 2. Interpolate bottom region (FROM THE HEART OF INDIA)
    # We interpolate from x=300 to x=724 to cover the entire width of the bottom text.
    # The background is a dark gradient.
    interpolate_horizontal(300, 724, 520, 622)
    
    # Save the modified image
    img.save(dest_path)
    print("Background patched with seamless horizontal interpolation.")

if __name__ == "__main__":
    patch_background_interpolation()
