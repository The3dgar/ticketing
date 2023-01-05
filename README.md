# Auth methods between services

- Use JWT with cookies strategy to handle user info into the req object
- don't save sensitive information into JWT

# jest config

"jest": {
"preset": "ts-jest",
"testEnvironment": "node",
"setupFilesAfterEnv": [
"./src/auth/test/setup.ts"
]
}

# ingress local setup

- change host file!
- run skaffold dev

# consideraciones proyecto ts

- correr -> tsc --init

# trabajar con mensajes nats client

- k port-forward service_name 4222:4222 o 8222:8222
- asegurarse de que cada listener este dentro de un queue group
- nats requeriments to handle messages:
  - .setDeliverAllAvailable().setDurableName('accounting-service')
  - stan.subscribe('queue', 'queue-group')

# publisher

- new OrderCreatedPublisher(natsClient).publish({...})

- considerar el version flag para gestionar los eventos, pero esto solo debe ser incrementado por el servicio al cual el registro corresponde, ej: solo el servicio de tickets debe emitir los eventos de tickets incluyendo la version correspondiente

- existen otros event bus a los cuales se les puede indicar cuando hacer una publicacion, lo que permitiria abstenerse de usar un scheduler o expiration services

# k8s secrets

- k create secret generic jwt-secret --from-literal JWT_KEY=my_secret_key_k8s

- k create secret generic stripe-secret --from-literal STRIPE_KEY=stripe_private_key
