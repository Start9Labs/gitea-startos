#!/bin/sh

set -e

if [ "$(yq e ".disable-registration" /data/start9/config.yaml)" = "true" ]; then
    exit 0
else
    echo "User signups should be disabled when not in use" >&2
    exit 1
fi
