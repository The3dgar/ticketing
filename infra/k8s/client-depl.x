apiVersion: apps/v1
kind: Deployment
metadata:
  name: client-depl
  labels:
    app: client
spec:
  replicas: 1
  selector:
    matchLabels:
      app: client
  template: # how create each individual pod in the deployment
    metadata:
      labels: 
        app: client
    spec:
      containers:
        - name: client
          image: edgarolivar16/ticket_client:latest
          imagePullPolicy: IfNotPresent
          command: ["yarn", "dev"]
---

apiVersion: v1
kind: Service
metadata:
  name: client-srv
spec:
  selector:
    app: client
  ports:
    - name: client
      port: 3000
      targetPort: 3000
      protocol: TCP