#!/bin/bash

GRPC_DIR="Pods/Headers/Private/grpc"
MODULEMAP="$GRPC_DIR/gRPC-Core.modulemap"

if [ ! -d "$GRPC_DIR" ]; then
  echo "Diretório $GRPC_DIR não existe. Execute pod install primeiro."
  exit 0
fi

# Cria o modulemap apenas se não existir
if [ ! -f "$MODULEMAP" ]; then
  echo "module gRPC_Core [system] {" > "$MODULEMAP"
  echo "    header \"grpc.h\"" >> "$MODULEMAP"
  echo "    export *" >> "$MODULEMAP"
  echo "}" >> "$MODULEMAP"
  echo "Arquivo $MODULEMAP criado com sucesso!"
else
  echo "Modulemap já existe em $MODULEMAP"
fi
