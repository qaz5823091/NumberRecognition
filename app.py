from flask import Flask, render_template, request
from PIL import Image
from io import BytesIO
from datetime import datetime

import os
import base64
import numpy as np
import tensorflow as tf
import cv2


model = tf.keras.models.load_model('/app/cloud_model.h5')
PATH = '/app/static/'

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        file = str(request.data)
        
        filename = string2Image(file)

        image = enhanceImage(filename)

        reshaped_image = reshapeImage(image)

        prediction = model.predict(reshaped_image)
        predicted_label = np.argmax(prediction)

        os.remove(filename)

        return str(predicted_label)
    return render_template('index.html')


def string2Image(data: str):
    starter = data.find(',')
    image_data = data[starter+1:]
    image_data = bytes(image_data, encoding="ascii")
    image = Image.open(BytesIO(base64.b64decode(image_data)))

    current_time = datetime.now().strftime("%Y%m%d%H%M%S%f")
    filename = current_time + '.png'
    full_filename = os.path.join(PATH, current_time) + '.png'

    image.save(full_filename)

    return full_filename

def enhanceImage(filename):
    test_image = cv2.imread(filename, cv2.IMREAD_GRAYSCALE)
    img_resized = cv2.resize(test_image, (28, 28), interpolation=cv2.INTER_LINEAR)
    img_resized = cv2.bitwise_not(img_resized)

    return img_resized

def reshapeImage(image):
    image_array = np.asarray(image)
    reshaped_image = image_array.reshape(1, 784).astype('float32')

    return reshaped_image

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)