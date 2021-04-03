CERT_DIR=.cert

if [[ -d "$CERT_DIR" ]]; then
    printf 'Directory exists ✅ \n'
else
    printf '🆕 \n'
    mkdir $CERT_DIR
fi

cd $CERT_DIR

CERT_FILE=cert.crt
CERT_KEY=cert.key
CERT_CONF=../certification/cert.conf

if [[ -f "$CERT_FILE" && -f "$CERT_KEY" ]]; then
    printf 'Certificate and key already exists \n'
    exit 1
else
    printf 'Generating cert and key ✅ \n'
    openssl req -x509 -newkey rsa:4096 -sha256 -keyout $CERT_KEY -out $CERT_FILE -days 365 -config $CERT_CONF -new -nodes
    printf 'Finished generating cert and key ✅ \n'
    exit 0
fi