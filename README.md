# Modelo de Teste de Carga
Extensão do k6 para [InfluxDB v2](https://docs.influxdata.com/influxdb/v2.0), que adiciona suporte para a versão mais recente `v2` e a API de compatibilidade para v1.8+.

#### **Por que essa saída não é diretamente parte do núcleo do `k6`?**
O núcleo do `k6` já suporta o [InfluxDB v1](https://k6.io/docs/results-visualization/influxdb-+-grafana), então a sensação natural seria fazer o mesmo para o `v2`. Infelizmente, o `v2` introduziu algumas mudanças significativas nas partes principais da API. Isso tornaria difícil suportar ambas as versões sem comprometer a retrocompatibilidade ou introduzir mudanças que afetariam a experiência atual dos usuários do k6 com a saída do InfluxDB, com alta probabilidade de criar mais confusão para os usuários do k6. Por esse motivo principal, a equipe de desenvolvimento do `k6` decidiu criar uma nova extensão independente para o InfluxDB v2.

# Install

Para construir um binário do `k6` com esta extensão, primeiro certifique-se de ter os pré-requisitos:

- Git
- [xk6](https://github.com/grafana/xk6#install)

1. Construa com `xk6`:

```bash
xk6 build --with github.com/grafana/xk6-output-influxdb
```

Isso resultará em um binário k6 no diretório atual.

2. Execute com o binário k6 recém-construído:

```bash
K6_INFLUXDB_ORGANIZATION=<insira-aqui-o-nome-da-organizacao> \
K6_INFLUXDB_BUCKET=<insira-aqui-o-nome-do-bucket> \
K6_INFLUXDB_TOKEN=<insira-aqui-um-token-válido> \
./k6 run -o xk6-influxdb=http://localhost:8086 <script.js>
```

**Usando Docker**

Este [Dockerfile](./Dockerfile) constroi uma imagem docker com o binário k6.

## Configuração

Opções para controle detalhado de flushes e conexões.


| ENV | Padrão | Descrição |
|-----|---------|-------------|
| K6_INFLUXDB_ORGANIZATION      |                       | A [Organization](https://docs.influxdata.com/influxdb/v2.0/reference/glossary/#organization). |
| K6_INFLUXDB_BUCKET            |                       | O [Bucket](https://docs.influxdata.com/influxdb/v2.0/reference/glossary/#bucket). |
| K6_INFLUXDB_TOKEN             |                       | O [Token](https://docs.influxdata.com/influxdb/v2.0/reference/glossary/#token). |
| K6_INFLUXDB_ADDR              | http://localhost:8086 | O endereço da instância. |
| K6_INFLUXDB_PUSH_INTERVAL     | 1s | TA frequência de flush das métricas do `k6`. |
| K6_INFLUXDB_CONCURRENT_WRITES | 4 | Número de solicitações concorrentes para flush de dados. É útil quando uma solicitação leva mais tempo do que o esperado (mais do que o intervalo de flush). |
| K6_INFLUXDB_TAGS_AS_FIELDS    | vu:int,iter:int,url | Uma string separada por vírgulas para definir métricas do k6 como campos não indexáveis (em vez de tags). Um tipo opcional pode ser especificado usando, como em vu, que tornará o campo um inteiro. Os tipos de campo possíveis são int, bool, float e string, que é o padrão. Exemplo: vu,iter,url,event_time. |
| K6_INFLUXDB_INSECURE          | false | Quando `true`, ignorará a verificação do certificado `https`. |
| K6_INFLUXDB_PRECISION         | 1ns | A [Precision](https://docs.influxdata.com/influxdb/v2.0/reference/glossary/#precision) do timestamp. |


# Docker Compose
Este repositório inclui um arquivo docker-compose.yml que inicia InfluxDB, Grafana e k6. Esta é apenas uma configuração rápida para mostrar o uso; para um caso de uso real, você pode querer implantar fora do docker, usar volumes e provavelmente atualizar versões.

Clone o repositório para começar e siga estes passos:

1. Coloque seus scripts k6 no diretório `samples` ou use o exemplo `http_2.js`.

2. Inicie o ambiente docker compose.
   
	```shell
	docker compose up -d
	```

	```shell
	# Output
	Creating xk6-output-influxdb_influxdb_1 ... done
	Creating xk6-output-influxdb_k6_1       ... done
	Creating xk6-output-influxdb_grafana_1  ... done
	```

3. Utilize a imagem Docker do k6 para executar o script k6 e enviar métricas para o contêiner InfluxDB iniciado na etapa anterior. Você deve [definir a tag `testid`]https://k6.io/docs/using-k6/tags-and-groups/#test-wide-tags) com um identificador exclusivo para segmentar as métricas em execuções de teste discretas para os painéis do Grafana.
    ```shell
    docker compose run --rm -T k6 run -<samples/http.js --tag testid=<ID_DO_TESTE>
    ```
   For convenience, the `docker-run.sh` can be used to simply:
    ```shell
    ./docker-run.sh samples/http_2.js
    ```

4. Acesse http://localhost:3000/ para ver o resultado no grafana
	> 
Este repositório inclui um [Dashboard](./grafana/dashboards/dashboard.yml)).


### API de Compatibilidade
A v2 inclui uma [API de compatibilidade com InfluxDB v1.8+](https://docs.influxdata.com/influxdb/v2.0/reference/api/influxdb-1x) que adiciona endpoints para comunicação com um InfluxDB v1.

> [Resumo das diferenças no uso da API do Cliente:](https://github.com/influxdata/influxdb-client-go#influxdb-18-api-compatibility)
> 1. Use o formato username para um token de autenticação. Exemplo: my-user. Use uma string vazia ("") se o servidor não exigir autenticação. 
> 2. O parâmetro de organização não é utilizado. Use uma string vazia ("") onde necessário. 
> 3. Use o formato database/retention-policy onde um bucket é necessário. Pule a política de retenção se a política de retenção padrão deve ser usada. Exemplos: telegraf/autogen, telegraf.