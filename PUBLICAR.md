# Publicar o site RaffaelloXp no GitHub Pages

## Antes de publicar
1. Os preços estão em `script.js` (A3 R$ 89, A2 R$ 179). Para mudar, troque o número depois de `preco:`.
2. As fotos do site já estão na pasta `img` (800 px, do Wikimedia Commons). Se trocar alguma, mantenha o mesmo nome de arquivo.
   Se faltar uma foto, o site mostra "Imagem em breve" no lugar.
3. A pasta `extras` guarda as 10 obras que estavam antes no site. Ela não precisa ser enviada ao GitHub.

## Publicar (pelo navegador, sem instalar nada)
1. Entre em github.com e crie uma conta, se ainda não tiver.
2. Clique em **New repository**. Dê um nome (ex.: `raffaelloxp`), deixe **Public** e clique em **Create repository**.
3. Na página do repositório, clique em **uploading an existing file**.
4. Arraste `index.html`, `style.css`, `script.js` e a pasta `img` inteira. Clique em **Commit changes**.
5. Vá em **Settings > Pages**. Em **Source**, escolha **Deploy from a branch**, branch **main**, pasta **/ (root)**, e clique em **Save**.
6. Espere de 1 a 2 minutos. O endereço aparece no topo dessa página, algo como
   `https://SEU-USUARIO.github.io/raffaelloxp/`
7. Abra o link no celular, teste um pedido até abrir o WhatsApp e coloque o link na bio do Instagram.

## Para mudar algo depois
- Preços, nomes ou quadros novos: edite `script.js` no próprio GitHub (abra o arquivo e clique no lápis) e salve com **Commit changes**.
- Quadro novo: envie a foto reduzida para a pasta `img` e copie um bloco do array `QUADROS`, trocando `id`, nome e arquivo.
- O site atualiza sozinho em 1 ou 2 minutos.
