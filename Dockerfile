FROM node:18-slim
RUN apt-get update && \
    apt-get install -y git python3 build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
RUN git clone https://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@github.com/c-o-d-e-xx/WhatsBixbyOpen.git /APEX

WORKDIR /APEX
RUN npm install @ffmpeg-installer/ffmpeg
RUN npm rebuild
EXPOSE 8000
CMD ["npm", "start"]

