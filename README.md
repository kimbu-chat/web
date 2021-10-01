# kimbu-chat/web

## TODO
- [ ] cleanup github container images

## Notes

Messenger test cases: https://app.qase.io/project/RW

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
