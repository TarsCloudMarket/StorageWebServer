FROM tarscloud/base-compiler as First


RUN mkdir -p /data
COPY . /data
RUN cd /data \
    && npm install 
# && mkdir -p tars_nodejs \
# && npm install @tars/node-agent -g \
# && mv /usr/local/lib/node_modules/@tars/node-agent tars_nodejs/

FROM tarscloud/tars.nodejsbase

ENV ServerType=nodejs

RUN mkdir -p /usr/local/server/bin/
COPY --from=First /data/ /usr/local/server/bin/
