// middleware.js
import { createProxyMiddleware } from "http-proxy-middleware";

const dynamicProxy = async (req, res) => {
  // Obtém o domínio de destino do cabeçalho 'proxied-domain'
  const targetDomain = req.headers["proxied-domain"];

  if (!targetDomain) {
    res
      .status(400)
      .json({ error: 'Cabeçalho "proxied-domain" é obrigatório.' });
    return;
  }

  // Cria um middleware de proxy dinâmico
  const proxy = createProxyMiddleware({
    target: targetDomain, // Usa o domínio do cabeçalho
    changeOrigin: true,
    // pathRewrite: { "^/api": "" }, // Remove o prefixo '/api' (opcional)
  });

  // Executa o proxy
  return new Promise((resolve, reject) => {
    proxy(req, res, (result) => {
      if (result instanceof Error) {
        res.status(500).json({
          error: "Erro ao redirecionar a requisição: " + result.message,
        });
        reject(result);
      } else {
        resolve(result);
      }
    });
  });
};

export default dynamicProxy;
