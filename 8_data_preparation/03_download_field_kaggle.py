"""Download field and Kaggle dataset sources locally.

This script should collect additional field images and Kaggle datasets used in the
plant diagnosis platform training pipeline.
"""

import argparse
import logging


def main() -> None:
    parser = argparse.ArgumentParser(description="Download field and Kaggle dataset files.")
    parser.add_argument(
        "--output-dir",
        default="1_dataset/downloads/field_kaggle",
        help="Target directory for downloaded field/Kaggle dataset files.",
    )
    args = parser.parse_args()

    logging.basicConfig(level=logging.INFO)
    logging.info("Downloading field/Kaggle data to %s", args.output_dir)

    # TODO: implement field and Kaggle download logic here.


if __name__ == "__main__":
    main()
