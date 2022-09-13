import os
import re
import cv2
from processModule import *
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
import uvicorn


app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]

)


@app.post("/receiptOcr")
async def main(file: UploadFile = File(...)):
    try:
        image = await file.read()
        # image = cv2.imread(image)
        nparr = np.fromstring(image, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        resize_ratio = 500 / img.shape[0]
        # Duplicate Image
        original = img.copy()
        # Resize Image
        resizeImg = opencv_resize(img, resize_ratio)
        # Convert to grayscale for further processing
        grayImg = cv2.cvtColor(resizeImg, cv2.COLOR_BGR2GRAY)
        # Convert to Binary Image
        ret, binImg = cv2.threshold(
            grayImg, 150, 255, cv2.THRESH_BINARY, cv2.THRESH_OTSU)
        # Detect all contours
        contours, hierarchy = cv2.findContours(
            binImg, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        image_with_contours = cv2.drawContours(
            img.copy(), contours, -1, (0, 255, 0), 3)

        # Get 10 largest contours
        largest_contours = sorted(
            contours, key=cv2.contourArea, reverse=True)[:10]
        image_with_largest_contours = cv2.drawContours(
            img.copy(), largest_contours, -1, (0, 255, 0), 3)
        # approximate the contour by a more primitive polygon shape

        receipt_contour = get_receipt_contour(largest_contours)

        image_with_receipt_contour = cv2.drawContours(
            img.copy(), [receipt_contour], -1, (0, 255, 0), 2)

        scanned = wrap_perspective(
            original.copy(), contour_to_rect(receipt_contour, resize_ratio))

        result = bw_scanner(scanned)

        ret, img = cv2.threshold(result, 120, 255, cv2.THRESH_BINARY)

        receiptResize = opencv_resize(img, 0.5)

        wordArr = wordDetectionAndExtraction(receiptResize)

        totalPrice = index_containing_substring(
            wordArr, 'total', 'sub')

        date = findPotentialDate(wordArr)

        realDate = formatDate(date)
        return {"totalPrice": totalPrice, 'date': realDate}

    except:
        response = '0'
        return {"totalPrice": response, 'date': ''}

if __name__ == "__main__":
    uvicorn.run(app, host="192.168.0.155", port=8000)
