# kimbu-chat/web

## Setup

1. Install latest version of NodeJS
2. Install YARN

## Run

```
1. Run your IDE with administrative previlegies
2. In the root directory run ```yarn install```
3. Copy file `.env.example` to `.env`
4. Remove comments and empty lines from `.evn` file
5. Run `yarn start`
```

## Notes

Messenger test cases: https://app.qase.io/project/RW

## TODO
- [ ] cleanup github container images

## Setup

```sh
export KUBECONFIG=~/.kube/kimbu-k3s.yaml
```

## Commands
```sh
# lint
helm lint helm/chart/

# test template
helm template helm/chart/
helm template helm/chart/ -f helm/values-develop.yaml

# dry-run
helm install web helm/chart/ --dry-run --debug | less

# install
# NOTE external_secret is used: https://github.com/kimbu-chat/k3s#web-secret
helm upgrade --install web helm/chart/ --atomic --debug -f helm/values-develop.yaml

# check logs
kubectl logs deployment/web -c web --since 5m -f

# remove
helm uninstall web

```

## k8dash

```sh
# get token
kubectl -n ops describe secret k8dash-token-xxxxx
```

Go to https://dash.dev.kimbu.io/  (IP whitelist is requered)
