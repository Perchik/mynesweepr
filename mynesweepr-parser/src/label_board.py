import cv2
import numpy as np
import pytesseract
import matplotlib.pyplot as plt
from collections import defaultdict
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s - %(levelname)s - %(message)s')

pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

# Function to preprocess image and detect edges


def preprocess_image(image):
    logging.info('Preprocessing image...')
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    _, thresh = cv2.threshold(blurred, 128, 255, cv2.THRESH_BINARY_INV)
    return thresh

# Function to find grid cells and calculate grid size


def find_grid_cells_and_size(image, min_contour_area):
    logging.info(f'Finding grid cells with min_contour_area={
                 min_contour_area}...')
    contours, _ = cv2.findContours(
        image.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Filter out small contours that are not likely to be grid cells
    contours = [c for c in contours if cv2.contourArea(c) > min_contour_area]

    # Sort contours from top to bottom, left to right
    contours = sorted(contours, key=lambda c: (
        cv2.boundingRect(c)[1], cv2.boundingRect(c)[0]))

    # Find bounding boxes for each cell
    bounding_boxes = [cv2.boundingRect(c) for c in contours]

    # Calculate grid size (rows and columns)
    rows = len(set([y for x, y, w, h in bounding_boxes]))
    cols = len(set([x for x, y, w, h in bounding_boxes]))

    logging.info(f'Found {len(bounding_boxes)} cells with rows={
                 rows} and cols={cols}')
    return bounding_boxes, rows, cols

# Function to check if the cell contains a non-numeral glyph


def is_flag(cell):
    contours, _ = cv2.findContours(
        cell, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    if len(contours) == 1:
        x, y, w, h = cv2.boundingRect(contours[0])
        aspect_ratio = w / float(h)
        if 0.2 < aspect_ratio < 5:  # Adjust aspect ratio range as needed
            return True
    return False

# Function to extract and recognize cell contents


def recognize_cells(image, bounding_boxes, rows, cols):
    logging.info('Recognizing cells...')
    grid = [[' ' for _ in range(cols)] for _ in range(rows)]
    cell_contents = defaultdict(int)
    examples = {}

    for x, y, w, h in bounding_boxes:
        cell = image[y:y+h, x:x+w]
        cell_gray = cv2.cvtColor(cell, cv2.COLOR_BGR2GRAY)
        cell_thresh = cv2.threshold(
            cell_gray, 128, 255, cv2.THRESH_BINARY_INV)[1]
        text = pytesseract.image_to_string(
            cell_thresh, config='--psm 10').strip()
        row = y // h
        col = x // w
        logging.debug(f'Cell at ({row},{col}): "{text}"')
        if text.isdigit() and int(text) in range(1, 9):
            grid[row][col] = text
            cell_contents[text] += 1
            if text not in examples:
                examples[text] = cell_thresh
        elif is_flag(cell_thresh):
            grid[row][col] = 'F'
            cell_contents['F'] += 1
            if 'F' not in examples:
                examples['F'] = cell_thresh
        else:
            grid[row][col] = 'closed'
            cell_contents['closed'] += 1
            if 'closed' not in examples:
                examples['closed'] = cell_thresh

    logging.info(f'Cell contents: {dict(cell_contents)}')
    return grid, cell_contents, examples

# Function to validate the grid


def validate_grid(cell_contents):
    logging.info('Validating grid...')
    if len(cell_contents) > 11:
        logging.warning('More than 11 different cell types detected')
        return False
    for key, count in cell_contents.items():
        if not (key.isdigit() and int(key) in range(1, 9)) and key != 'F' and key != 'closed':
            logging.warning(f'Invalid cell type detected: {key}')
            return False
        if key.isdigit() and count > 1:
            logging.warning(f'Duplicate cell type detected: {key}')
            return False
    return True

# Visualization function to show intermediate results


def visualize(image, preprocessed_image, bounding_boxes, grid, examples):
    plt.figure(figsize=(20, 10))

    # Original image
    plt.subplot(1, 6, 1)
    plt.title("Original Image")
    plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

    # Preprocessed image
    plt.subplot(1, 6, 2)
    plt.title("Preprocessed Image")
    plt.imshow(preprocessed_image, cmap='gray')

    # Detected contours and bounding boxes
    image_with_boxes = image.copy()
    for x, y, w, h in bounding_boxes:
        cv2.rectangle(image_with_boxes, (x, y), (x+w, y+h), (0, 255, 0), 2)

    plt.subplot(1, 6, 3)
    plt.title("Detected Cells")
    plt.imshow(cv2.cvtColor(image_with_boxes, cv2.COLOR_BGR2RGB))

    # Recognized cells before validation
    # plt.subplot(1, 6, 4)
    # plt.title("Recognized Cells")
    # plt.imshow(np.ones_like(preprocessed_image) * 255, cmap='gray')
    # for i, row in enumerate(grid):
    #     for j, cell in enumerate(row):
    #         plt.text(j, i, cell, ha='center', va='center',
    #                  fontsize=12, color='black', backgroundcolor='white')
    # plt.xlim(-0.5, len(grid[0]) - 0.5)
    # plt.ylim(len(grid) - 0.5, -0.5)
    # plt.grid(which='both')

    # Display one example of each cell content
    plt.subplot(1, 6, 4)
    plt.title("Cell Examples")
    num_examples = len(examples)
    for i, (key, example) in enumerate(examples.items()):
        plt.imshow(example, cmap='gray')
        plt.title(f'Example of {key}')
        plt.axis('off')
        plt.pause(2)

    plt.show()


# Load the images
image_paths = [
    "C:/Users/Patrick/Documents/GitHub/mynesweepr/mynesweepr-parser/images/board1.png"
]

images = [cv2.imread(image_path) for image_path in image_paths]

# Process each image
parsed_grids = []
for image in images:
    min_contour_area = 50  # Initial minimum contour area
    preprocessed_image = preprocess_image(image)
    bounding_boxes, rows, cols = find_grid_cells_and_size(
        preprocessed_image, min_contour_area)

    runs = 0
    while runs < 10:
        runs += 1
        logging.info(f'Run {runs}: Recognizing and validating grid...')
        grid, cell_contents, examples = recognize_cells(
            image, bounding_boxes, rows, cols)

        # Visualize the preprocessed image and detected cells before validation
        visualize(image, preprocessed_image, bounding_boxes, grid, examples)

        if validate_grid(cell_contents):
            logging.info('Grid validated successfully')
            parsed_grids.append(grid)
            break
        else:
            logging.warning(
                'Grid validation failed. Adjusting parameters and retrying...')
            # Adjust grid detection parameters and retry
            min_contour_area += 10  # Example adjustment, you can tweak this as needed
            bounding_boxes, rows, cols = find_grid_cells_and_size(
                preprocessed_image, min_contour_area)

        # Pause execution
        input("Press Enter to continue...")

# Display parsed grids
for i, grid in enumerate(parsed_grids):
    print(f"Grid {i+1}:")
    for row in grid:
        print(" ".join(row))
    print("\n")
