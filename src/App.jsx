import React from 'react';
export default function EscalaErvaMate() {
  const [fila, setFila] = React.useState(() => {
    const salva = localStorage.getItem('fila-erva-mate');
    return salva
      ? JSON.parse(salva)
      : [
          'Sd Nicolas',
          'Sgt Gustavo',
          'Sgt Finamor',
          'Sgt Nene',
          'Cb Victor',
          'Sd Velasque',
        ];
  });

  const [historico, setHistorico] = React.useState(() => {
    const salvo = localStorage.getItem('historico-erva-mate');
    return salvo ? JSON.parse(salvo) : [];
  });

  const [novoNome, setNovoNome] = React.useState('');

  React.useEffect(() => {
    localStorage.setItem('fila-erva-mate', JSON.stringify(fila));
  }, [fila]);

  React.useEffect(() => {
    localStorage.setItem('historico-erva-mate', JSON.stringify(historico));
  }, [historico]);

  const marcarCompra = () => {
    if (fila.length === 0) return;

    const comprador = fila[0];
    const novaFila = [...fila.slice(1), comprador];

    setFila(novaFila);

    const agora = new Date();

    setHistorico([
      {
        nome: comprador,
        data: agora.toLocaleDateString('pt-BR'),
        hora: agora.toLocaleTimeString('pt-BR'),
      },
      ...historico,
    ]);
  };

  const adicionarPessoa = () => {
    if (!novoNome.trim()) return;

    setFila([...fila, novoNome.trim()]);
    setNovoNome('');
  };

  const removerPessoa = (nome) => {
    setFila(fila.filter((pessoa) => pessoa !== nome));
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            🧉 Escala da Erva Mate
          </h1>
          <p className="text-zinc-400">
            Sistema de controle rotativo de compras do escritório.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-2xl">
              <p className="text-zinc-400 mb-2">Próximo responsável</p>

              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h2 className="text-5xl font-black text-green-400">
                    {fila[0] || 'Sem pessoas na fila'}
                  </h2>
                </div>

                <button
                  onClick={marcarCompra}
                  className="bg-green-500 hover:bg-green-400 transition-all text-black font-bold px-6 py-4 rounded-2xl text-lg"
                >
                  ✅ Marcar que comprou
                </button>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">📋 Ordem da fila</h3>
                <span className="text-zinc-400">
                  {fila.length} participantes
                </span>
              </div>

              <div className="space-y-3">
                {fila.map((pessoa, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-2xl border ${
                      index === 0
                        ? 'bg-green-500/10 border-green-500'
                        : 'bg-zinc-800 border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>

                      <div>
                        <p className="font-semibold text-lg">{pessoa}</p>
                        {index === 0 && (
                          <p className="text-green-400 text-sm">
                            Responsável atual
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => removerPessoa(pessoa)}
                      className="bg-red-500/20 hover:bg-red-500/40 transition-all px-4 py-2 rounded-xl text-red-300"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-2xl">
              <h3 className="text-2xl font-bold mb-4">
                ➕ Adicionar participante
              </h3>

              <div className="space-y-3">
                <input
                  type="text"
                  value={novoNome}
                  onChange={(e) => setNovoNome(e.target.value)}
                  placeholder="Nome da pessoa"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 outline-none focus:border-green-500"
                />

                <button
                  onClick={adicionarPessoa}
                  className="w-full bg-blue-500 hover:bg-blue-400 transition-all text-black font-bold py-3 rounded-2xl"
                >
                  Adicionar
                </button>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 shadow-2xl">
              <h3 className="text-2xl font-bold mb-4">
                🕒 Histórico de compras
              </h3>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {historico.length === 0 && (
                  <p className="text-zinc-400">
                    Nenhuma compra registrada.
                  </p>
                )}

                {historico.map((item, index) => (
                  <div
                    key={index}
                    className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4"
                  >
                    <p className="font-bold text-green-400">{item.nome}</p>
                    <p className="text-sm text-zinc-400">
                      {item.data} às {item.hora}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-zinc-500 text-sm">
          Sistema desenvolvido para controle da escala de compra da erva mate 🧉
        </div>
      </div>
    </div>
  );
}
