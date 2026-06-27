# Configuração de CORS para Firebase Storage

O erro `Access to XMLHttpRequest at ... has been blocked by CORS policy` acontece porque o Firebase Storage precisa de uma permissão explícita para aceitar uploads vindos de domínios diferentes (como o seu domínio na Vercel).

Siga os passos abaixo para resolver:

### Passo 1: Instalar o Google Cloud SDK (se não tiver)
Se você já tem o `gsutil` no seu computador, pule para o Passo 2. Se não, você pode usar o **Google Cloud Shell** direto no navegador (mais fácil).

### Passo 2: Usar o Google Cloud Shell
1. Acesse o [Console do Google Cloud](https://console.cloud.google.com/).
2. Selecione o seu projeto: `gen-lang-client-0699053288`.
3. Clique no ícone do **Cloud Shell** (um prompt `>_` no canto superior direito).

### Passo 3: Criar o arquivo de configuração
No terminal que abriu, cole o seguinte comando para criar um arquivo chamado `cors.json`:

```bash
cat <<EOF > cors.json
[
  {
    "origin": ["*"],
    "method": ["GET", "POST", "PUT", "DELETE", "HEAD"],
    "responseHeader": ["Content-Type", "x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]
EOF
```

*Nota: O `*` permite todos os domínios. Se quiser ser mais seguro, pode trocar por `["https://guidatrips.vercel.app"]`.*

### Passo 4: Aplicar a configuração
Agora, execute o comando abaixo para aplicar essa regra ao seu bucket:

```bash
gsutil cors set cors.json gs://gen-lang-client-0699053288.firebasestorage.app
```

### Passo 5: Verificar
Após rodar o comando, tente fazer o upload novamente no site. O erro de CORS deve ter sumido.

---

**Dica:** Se o upload ainda falhar com erro de permissão (403), verifique se você ativou o Firebase Storage no console do Firebase e se as regras de segurança permitem escrita.

Suas regras atuais devem permitir escrita para usuários autenticados ou conforme sua lógica de negócio.
