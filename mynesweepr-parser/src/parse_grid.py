import cv2
import numpy as np
import os


def main(image_path):
    image = cv2.imread(image_path)
    blur = cv2.pyrMeanShiftFiltering(image, 11, 21)

    gray = cv2.cvtColor(blur, cv2.COLOR_BGR2GRAY)
    thresh = cv2.threshold(
        gray, 0, 255, cv2.THRESH_BINARY_INV + cv2.THRESH_OTSU)[1]
    contours, hierarchy = cv2.findContours(thresh, 1, 2)

    dst = cv2.Canny(image, 50, 200, None, 3)
    
    cv2.imshow("Canny", dst)
    print("Number of contours detected:", len(contours))

    for cnt in contours:
        x1, y1 = cnt[0][0]
        approx = cv2.approxPolyDP(cnt, 0.01*cv2.arcLength(cnt, True), True)
        if len(approx) == 4:
            x, y, w, h = cv2.boundingRect(cnt)
            ratio = float(w)/h
            if ratio >= 0.9 and ratio <= 1.1:
                image = cv2.drawContours(image, [cnt], -1, (0, 255, 255), 3)

    cv2.namedWindow("Minesweeper", cv2.WINDOW_NORMAL)
    cv2.imshow("Minesweeper", image)
    cv2.waitKey(0)
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main("C:/Users/Patrick/Documents/GitHub/mynesweepr/mynesweepr-parser/images/board1.png")
