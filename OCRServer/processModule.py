import cv2
import numpy as np
import easyocr
import re
from datetime import datetime


def opencv_resize(image, ratio):
    width = int(image.shape[1] * ratio)
    height = int(image.shape[0] * ratio)
    dim = (width, height)
    return cv2.resize(image, dim, interpolation=cv2.INTER_NEAREST)


def plot_rgb(image):
    return cv2.imshow('rgb', cv2.cvtColor(image, cv2.COLOR_BGR2RGB))


def plot_gray(image):
    return cv2.imshow('gray', image)


def approximate_contour(contour):
    peri = cv2.arcLength(contour, True)
    return cv2.approxPolyDP(contour, 0.032 * peri, True)


def get_receipt_contour(contours):
    # loop over the contours
    area = max(contours, key=cv2.contourArea)
    for c in contours:
        approx = approximate_contour(area)

        # if our approximated contour has four points, we can assume it is receipt's rectangle
        if len(approx) == 4:
            return approx


def errorOutput(input):
    if(input is not None or len(input) > 0):
        return input
    return None


def contour_to_rect(contour, ratio):
    pts = contour.reshape(4, 2)
    rect = np.zeros((4, 2), dtype="float32")
    # top-left point has the smallest sum
    # bottom-right has the largest sum
    s = pts.sum(axis=1)
    rect[0] = pts[np.argmin(s)]
    rect[2] = pts[np.argmax(s)]
    # compute the difference between the points:
    # the top-right will have the minumum difference
    # the bottom-left will have the maximum difference
    diff = np.diff(pts, axis=1)
    rect[1] = pts[np.argmin(diff)]
    rect[3] = pts[np.argmax(diff)]
    return rect / ratio


def wrap_perspective(img, rect):
    # unpack rectangle points: top left, top right, bottom right, bottom left
    (tl, tr, br, bl) = rect
    # compute the width of the new image
    widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
    widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
    # compute the height of the new image
    heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
    heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
    # take the maximum of the width and height values to reach
    # our final dimensions
    maxWidth = max(int(widthA), int(widthB))
    maxHeight = max(int(heightA), int(heightB))
    # destination points which will be used to map the screen to a "scanned" view
    dst = np.array([
        [0, 0],
        [maxWidth - 1, 0],
        [maxWidth - 1, maxHeight - 1],
        [0, maxHeight - 1]], dtype="float32")
    # calculate the perspective transform matrix
    M = cv2.getPerspectiveTransform(rect, dst)
    # warp the perspective to grab the screen
    return cv2.warpPerspective(img, M, (maxWidth, maxHeight))


def bw_scanner(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    return gray
    # T = threshold_local(gray, 21, offset=5, method="gaussian")
    # print((gray > T).astype("uint8") * 255)
    # return (gray > T).astype("uint8") * 255
    # return (gray > T).astype("float")


def wordDetectionAndExtraction(img):
    reader = easyocr.Reader(['en'])
    readImage = reader.readtext(
        img, detail=0)
    return readImage


def isfloat(num):
    try:
        float(num)
        return True
    except ValueError:
        return False


def index_containing_substring(the_list, substring, skipstring):
    index = 0
    total = '0'
    for i, s in enumerate(the_list):
        lowerAlp = s.lower()
        removespc = s.translate({ord(' '): None})
        replacecomma = removespc.translate({ord(','): ('.')})
        if substring in lowerAlp and skipstring not in lowerAlp:
            index = i
        if index != 0:
            if i > index and isfloat(replacecomma):
                total = replacecomma
                return total


dateFormat1 = r"[\d]{1,2}-[\d]{1,2}-[\d]{4}"
dateFormat2 = r"[\d]{1,2}/[\d]{1,2}/[\d]{4}"
dateFormat3 = r"[\d]{1,2}-[ADFJMNOS]\w*-[\d]{4}"
dateFormat4 = r"[\d]{1,2}/[\d]{1,2}/[\d]{2}"
dateFormat5 = r"[\d]{1,2} [ADFJMNOS]\w* [\d]{4}"


def findPotentialDate(arr):
    for i in arr:
        textSplit = i.split()
        for x in textSplit:
            realDate = re.search(
                "|".join([dateFormat1, dateFormat2, dateFormat3, dateFormat4, dateFormat5]), x)
            if realDate != None:
                break
        if realDate != None:
            break
    return realDate.string


def formatDate(date):
    try:
        if re.search(dateFormat1, date):
            formattedDate = datetime.strptime(date.replace(
                '-', '/'), '%d/%m/%Y').strftime('%d/%m/%Y')
            return formattedDate
        elif re.search(dateFormat2, date):
            formattedDate = datetime.strptime(
                date, '%d/%m/%Y').strftime('%d/%m/%Y')
            return formattedDate
        elif re.search(dateFormat3, date):
            formattedDate = datetime.strptime(date.replace(
                '-', ' '), '%d %b %Y').strftime('%d/%m/%Y')
            return formattedDate
        elif re.search(dateFormat4, date):
            formattedDate = datetime.strptime(
                date, '%d %b %Y').strftime('%d/%m/%Y')
            return formattedDate
        elif re.search(dateFormat5, date):
            formattedDate = datetime.strptime(
                date, '%d/%b/%y').strftime('%d/%m/%Y')
            return date
    except:
        return ''
