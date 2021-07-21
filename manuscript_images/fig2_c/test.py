
from PIL import Image  # Python Image Library - Image Processing
import glob
import cv2
file = 'test.tiff'

if file[-4:] == "tiff":
    image = Image.open(file)
    image.mode = 'I'
    new_image = image.point(lambda i: i * (1. / 256)).convert('L')
    current_name = file[:-4] + "jpg"
else:
    current_name = file

new_image.save(current_name)

# load image and gets the image dimensions
im_gray = cv2.imread(current_name, cv2.IMREAD_GRAYSCALE)
dim = {'height': im_gray.shape[0], 'width': im_gray.shape[1], 'image': "static/username/images/" + current_name}
print(dim)