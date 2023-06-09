FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-dev \
    && apt-get clean
    
RUN pip3 install tensorflow

RUN pip3 install opencv-python-headless

RUN pip3 install flask

RUN pip3 install pillow

COPY model.h5 /app/cloud_model.h5
COPY static/main.js /app/static/main.js
COPY static/style.css /app/static/style.css
COPY templates/index.html /app/templates/index.html
COPY app.py /app/app.py

CMD python3 /app/app.py