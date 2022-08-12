# Almoxarifado API

## ORM

Para manipulação do banco de dados e entidades está sendo utilizada a biblioteca TypeORM:

Documentação: <https://typeorm.io/#/>

Entidades: <https://typeorm.io/#/entities>

Manipulação: <https://typeorm.io/#/working-with-entity-manager>

---

## Docker

Para iniciar o projeto é necessário ter o `docker` e o `docker-compose` instalados.

Docker: <https://docs.docker.com/engine/install/>

Docker Compose: <https://docs.docker.com/compose/install/>

---

## Iniciando o servidor

Instale as dependências rodando o comando abaixo na raiz do diretório:

```sh
npm install
```

Na primeira vez que iniciar o projeto é necessário gerar o build do `Dockerfile` com o comando:

```sh
docker-compose up --build
```

Para rodar o projeto basta executar o comando:

```sh
docker-compose up
```

**`OBS`**: Verifique as informações de conexão no arquivo `src/config/database`

Se tudo estiver ok a api e a documentação devem estar rodando nos endereços:

**API**: <http://localhost:4444>

**Documentação dos endpoints**: <http://localhost:4444/swagger>

---

## Conectar ao Banco de dados - MySql

Com o **docker** rodando execute os comandos abaixo:

(senha disponível nas variáveis do repositório > **MYSQL_ROOT_PASSWORD**)

```sh
# conecta no docker
docker exec -it almoxarifado-mysql bash

# local
mysql -u almoxarifado_root -p

# remoto
mysql -u almoxarifado_root -h <hostname> -P <port> <database> -p
```
