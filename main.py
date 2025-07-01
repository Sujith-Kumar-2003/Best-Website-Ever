from PIL import Image, ImageDraw, ImageFont

# Settings
text = "Sujith Kumaravel"
font_size = 60
font_path = "/System/Library/Fonts/Supplemental/Arial.ttf"
image_size = (800, 200)
bg_color = (0, 0, 0)  # Black background
text_color = (255, 0, 0)  # Red text
frame_duration = 100  # ms per frame

# Load font
try:
    font = ImageFont.truetype(font_path, font_size)
except IOError:
    font = ImageFont.load_default()

# Calculate final character positions
def get_text_positions(text, font, image_size):
    draw = ImageDraw.Draw(Image.new("RGB", image_size))
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    start_x = (image_size[0] - text_width) // 2
    start_y = (image_size[1] - text_height) // 2

    positions = []
    current_x = start_x
    for char in text:
        char_width = font.getbbox(char)[2]
        positions.append((current_x, start_y))
        current_x += char_width
    return positions

final_positions = get_text_positions(text, font, image_size)

# Define corners: TL, TR, BL, BR
corner_origins = [
    (0, 0),  # top-left
    (image_size[0], 0),  # top-right
    (0, image_size[1]),  # bottom-left
    (image_size[0], image_size[1]),  # bottom-right
]

frames = []

# Generate frames: one letter at a time flying in
for i in range(len(text)):
    img = Image.new("RGB", image_size, bg_color)
    draw = ImageDraw.Draw(img)

    for j in range(i + 1):
        char = text[j]
        target_x, target_y = final_positions[j]

        # Animate from corner
        corner = corner_origins[j % 4]
        step_ratio = (i + 1 - j) / (i + 1)
        curr_x = int(corner[0] + (target_x - corner[0]) * (1 - step_ratio))
        curr_y = int(corner[1] + (target_y - corner[1]) * (1 - step_ratio))

        draw.text((curr_x, curr_y), char, font=font, fill=text_color)

    frames.append(img)

# Hold final frame for a moment
for _ in range(10):
    frames.append(frames[-1])

# Save the animated GIF
frames[0].save(
    "sujith_comic_flyin.gif",
    save_all=True,
    append_images=frames[1:],
    loop=0,
    duration=frame_duration,
)

print("✅ Done! Check 'sujith_comic_flyin.gif' for red letters on black background.")
