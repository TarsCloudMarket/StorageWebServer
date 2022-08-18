FROM tarscloud/base-compiler as First


RUN mkdir -p /data
COPY . /data
RUN cd /data \
    && npm install && npm run build

FROM tarscloud/tars.nodejsbase

ENV ServerType=nodejs

RUN mkdir -p /usr/local/server/bin/
COPY --from=First /data/ /usr/local/server/bin/
