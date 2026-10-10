# Updating the upstream version

Gitea ships as a single Docker image (`gitea/gitea`) whose tag tracks the upstream Git release.

## Determining the upstream version

Read the upstream tag list ([go-gitea/gitea](https://github.com/go-gitea/gitea)), skipping `-dev`, `-rc`, and other prereleases; do not rely on GitHub's Latest badge:

```
gh api 'repos/go-gitea/gitea/tags?per_page=100' --paginate --jq '.[].name'
```

Strip the leading `v` and keep every version component (e.g. `v28.1.0` -> `28.1.0`) to get the Docker tag and the upstream portion of the StartOS version. Confirm the exact image tag has been published to [Docker Hub](https://hub.docker.com/r/gitea/gitea/tags), including every architecture declared in the manifest:

```
version=28.1.0
curl -fsSL "https://hub.docker.com/v2/repositories/gitea/gitea/tags/$version" | jq '{name, tag_status, images: [.images[] | {architecture, os, status}]}'
```

If the newest stable tag has no usable image, use the newest stable release whose image is published. Read its release notes for migrations or dependency requirements that raise the guide's scrutiny tier, even on a maintenance release.

The pin lives in `startos/manifest/index.ts` as `images.gitea.source.dockerTag`.

## Applying the bump

In `startos/manifest/index.ts`, update the `dockerTag` to `gitea/gitea:<new version>` (e.g. `gitea/gitea:28.1.0`).
