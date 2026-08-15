from PIL import Image

def detect_black_frame():
    img_path = r"C:\Users\DELL\.gemini\antigravity\scratch\heritage-quest\assets\bg.jpg"
    img = Image.open(img_path).convert("RGB")
    width, height = img.size
    
    # Let's scan the center row (y = height // 2) from left to right to find the black region boundaries.
    center_y = height // 2
    black_pixels = []
    
    for x in range(width):
        r, g, b = img.getpixel((x, center_y))
        # The black region is extremely dark, let's say r < 20 and g < 20 and b < 20
        if r < 18 and g < 18 and b < 18:
            black_pixels.append(x)
            
    if not black_pixels:
        print("No black region detected at center row!")
        return
        
    x_start = min(black_pixels)
    x_end = max(black_pixels)
    
    # Now let's scan the center column of the black region (x = (x_start + x_end) // 2) from top to bottom
    center_x = (x_start + x_end) // 2
    black_y_pixels = []
    
    for y in range(height):
        r, g, b = img.getpixel((center_x, y))
        if r < 18 and g < 18 and b < 18:
            black_y_pixels.append(y)
            
    y_start = min(black_y_pixels)
    y_end = max(black_y_pixels)
    
    print(f"Detected Black Frame coordinates:")
    print(f"X: {x_start} to {x_end} (Width: {x_end - x_start}, Left %: {x_start/width*100:.2f}%, Width %: {(x_end-x_start)/width*100:.2f}%)")
    print(f"Y: {y_start} to {y_end} (Height: {y_end - y_start}, Top %: {y_start/height*100:.2f}%, Height %: {(y_end-y_start)/height*100:.2f}%)")

if __name__ == "__main__":
    detect_black_frame()
