# Minesweeper Grid Parser

This project uses OpenCV to parse a Minesweeper grid from an image, allowing manual label updates, and training a TensorFlow model on the labeled data.

## Installation

1. Clone the repository
2. Install dependencies:

```sh
pip install -r requirements.txt
```

## Usage

### Parse the Grid

```sh
python src/parse_grid.py
```

### Label the Grid

```sh
python src/label_board.py
```

### Train the Model

```sh
python src/train_model.py
```

## Directory Structure

- `images/`: Store input images
- `data/`: Store labeled board data
- `src/`: Source code
  - `parse_grid.py`: OpenCV code to parse the grid
  - `label_board.py`: Manual labeling tool
  - `train_model.py`: TensorFlow model training
  - `utils.py`: Utility functions
- `requirements.txt`: List of dependencies
- `README.md`: Project documentation
