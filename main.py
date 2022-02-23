# import the necessary packages
import math
import sys

import numpy as np
import pytesseract
from pytesseract import Output

import preprocess
from preprocess import *
from PIL import Image

import cv2

def removeExcess(item):
    splitedItem = item.split(':')
    if len(splitedItem) > 1:
        return item
    else:
        return None


def getTextFromImage(imageName):
    img = cv2.imread(imageName)
    d = pytesseract.image_to_data(img, output_type=Output.DICT)
    actualText = list(filter(None, d['text']))
    actualText = list(filter(removeExcess, actualText))
    return actualText


def exportToTxt(list):
    file = open("hoursResults.txt", "w")
    numOfDays = math.floor(len(list) / 2)
    endHours = list[:numOfDays]
    startHours = list[numOfDays:]
    text = "";
    for i in range(numOfDays):
        text += startHours[i] + "-" + endHours[i] + "\n"

    file.write(text)
    file.close()

def cropAndExtract(imageName):
    im = Image.open(imageName)
    cvImg = cv2.imread(imageName)
    width, height = im.size
    topOffset = 0
    rowHeight = 25.2
    bottomOffset = topOffset + rowHeight

    for i in np.arange(topOffset + rowHeight, height - bottomOffset, rowHeight):
        top = i - rowHeight
        bottom = i
        left = 0
        right = width + 1
        row = im.crop((left, top, right, bottom)).convert('L')

        d = pytesseract.image_to_data(row, output_type=Output.DICT)
        actualText = list(filter(None, d['text']))
        if len(actualText) > 0:
            row.show()
            print(actualText)

    row = im.crop((0, topOffset, width+1, bottomOffset)).convert('L')
    row.show()


    d = pytesseract.image_to_data(row, output_type=Output.DICT)
    actualText = list(filter(None, d['text']))
    print(actualText)
    img = get_grayscale(img)
    img = deskew(img)

    cv2.imshow('img', img)
    cv2.waitKey(0)


def getBoxes(d):
    n_boxes = len(d['text'])
    for i in range(n_boxes):
        if int(d['conf'][i]) > 20:
            (x, y, w, h) = (d['left'][i], d['top'][i], d['width'][i], d['height'][i])
            img = cv2.rectangle(img, (x, y), (x + w, y + h), (0, 255, 0), 2)

    cv2.imshow('img', img)
    cv2.waitKey(0)

if __name__ == '__main__':
    filePath = sys.argv[1]
    print('===========================================================================================================')
    imgText = getTextFromImage(filePath)
    print(len(imgText))
    print('===========================================================================================================')
    exportToTxt(imgText)
