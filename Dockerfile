FROM node:18-slim
RUN apt-get update && \
    apt-get install -y git python3 build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
RUN git clone https://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@github.com/c-o-d-e-xx/WhatsBot.git /APEX

WORKDIR /APEX
RUN npm install @ffmpeg-installer/ffmpeg
RUN npm rebuild
EXPOSE 8000
CMD ["npm", "start"]

