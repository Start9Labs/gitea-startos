# FROM arm64v8/alpine:3.12
FROM gitea/gitea:1.16.9

RUN apk update
RUN apk add tini curl

# ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
# RUN chmod a+x /usr/local/bin/docker_entrypoint.sh
ADD ./check-web.sh /usr/local/bin/check-web.sh
RUN chmod +x /usr/local/bin/check-web.sh

# WORKDIR /root

# EXPOSE 80

# ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
