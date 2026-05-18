import React, { useEffect, useState } from "react";
import { supabase } from "./supabase";

export default function EscalaErvaMate() {
  const [fila, setFila] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [novoMilitar, setNovoMilitar] = useState("");
  const [editandoId, setEditandoId] = useState(null);
  const [nomeEditado, setNomeEditado] = useState("");

  async function carregarFila() {
    const { data, error } = await supabase
      .from("fila")
      .select("*")
      .order("ordem", { ascending: true });

    if (!error) {
      setFila(data);
    }
  }

  async function carregarHistorico() {
    const { data, error } = await supabase
      .from("historico")
      .select("*")
      .order("data_compra", { ascending: false });

    if (!error) {
      setHistorico(data);
    }
  }

  useEffect(() => {
    carregarFila();
    carregarHistorico();

    const canal = supabase
      .channel("fila")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "fila",
        },
        () => {
          carregarFila();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(canal);
    };
  }, []);

  async function adicionarMilitar() {
    if (!novoMilitar.trim()) return;

    const ultimaOrdem =
      fila.length > 0 ? fila[fila.length - 1].ordem : 0;

    await supabase.from("fila").insert([
      {
        nome: novoMilitar,
        ordem: ultimaOrdem + 1,
      },
    ]);

    setNovoMilitar("");
  }

  async function marcarComprou() {
    if (fila.length === 0) return;

    const primeiro = fila[0];
    const ultimaOrdem = fila[fila.length - 1].ordem;

    await supabase.from("historico").insert([
      {
        nome: primeiro.nome,
      },
    ]);

    await supabase
      .from("fila")
      .update({ ordem: ultimaOrdem + 1 })
      .eq("id", primeiro.id);

    carregarHistorico();
  }

  async function salvarEdicao(id) {
    if (!nomeEditado.trim()) return;

    await supabase
      .from("fila")
      .update({ nome: nomeEditado })
      .eq("id", id);

    setEditandoId(null);
    setNomeEditado("");
    carregarFila();
  }

  return (
    <div className="min-h-screen bg-zinc-900 text-white p-6">
      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold text-center mb-8">
          🧉 Escala da Erva Mate
        </h1>

        {/* ADICIONAR MILITAR */}
        <div className="bg-zinc-800 rounded-2xl p-6 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Adicionar Militar
          </h2>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Nome do militar"
              value={novoMilitar}
              onChange={(e) => setNovoMilitar(e.target.value)}
              className="flex-1 bg-zinc-700 rounded-xl p-3 outline-none"
            />

            <button
              onClick={adicionarMilitar}
              className="bg-blue-600 hover:bg-blue-700 px-6 rounded-xl font-bold"
            >
              ➕ Adicionar
            </button>
          </div>
        </div>

        {/* PRÓXIMO */}
        <div className="bg-zinc-800 rounded-2xl p-6 shadow-lg">
          <h2 className="text-2xl mb-4 font-semibold">
            Próximo a comprar
          </h2>

          {fila.length > 0 && (
            <div className="bg-green-700 rounded-xl p-4 text-center mb-6">
              <p className="text-3xl font-bold">
                {fila[0].nome}
              </p>
            </div>
          )}

          <button
            onClick={marcarComprou}
            className="w-full bg-green-600 hover:bg-green-700 transition rounded-xl p-4 text-xl font-bold"
          >
            ✅ Marcar que comprou
          </button>
        </div>

        {/* FILA */}
        <div className="bg-zinc-800 rounded-2xl p-6 shadow-lg mt-8">
          <h2 className="text-2xl mb-4 font-semibold">
            Ordem da fila
          </h2>

          <div className="space-y-3">
            {fila.map((pessoa, index) => (
              <div
                key={pessoa.id}
                className="bg-zinc-700 rounded-xl p-4 flex items-center justify-between gap-3"
              >
                {editandoId === pessoa.id ? (
                  <>
                    <input
                      value={nomeEditado}
                      onChange={(e) => setNomeEditado(e.target.value)}
                      className="flex-1 bg-zinc-600 rounded-xl p-2 outline-none"
                    />
                    <button
                      onClick={() => salvarEdicao(pessoa.id)}
                      className="text-green-400 font-bold"
                    >
                      ✅
                    </button>
                    <button
                      onClick={() => setEditandoId(null)}
                      className="text-red-400 font-bold"
                    >
                      ❌
                    </button>
                  </>
                ) : (
                  <>
                    <span className="flex-1">
                      {`${index + 1}. ${pessoa.nome}`}
                    </span>
                    <button
                      onClick={() => {
                        setEditandoId(pessoa.id);
                        setNomeEditado(pessoa.nome);
                      }}
                      className="text-zinc-400 hover:text-white"
                    >
                      ✏️
                    </button>
                    {index === 0 && (
                      <span className="text-green-400 font-bold">
                        Próximo
                      </span>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* HISTÓRICO */}
        <div className="bg-zinc-800 rounded-2xl p-6 shadow-lg mt-8">
          <h2 className="text-2xl mb-4 font-semibold">
            Histórico de Compras
          </h2>

          <div className="space-y-3">
            {historico.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-700 rounded-xl p-4 flex justify-between"
              >
                <span>{item.nome}</span>

                <span className="text-zinc-300 text-sm">
                  {new Date(item.data_compra).toLocaleString("pt-BR")}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}